const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const Person = require('./models/person')
const User = require('./models/user')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const JWT_SECRET = process.env.JWT_SECRET

const resolvers = {
    Query: {
        personCount: async () => Person.collection.countDocuments(),
        allPersons: async (root, args) => {
            if (!args.phone) {
                return Person.find({}).populate('friendOf')
            }

            return Person.find({ phone: { $exists: args.phone === 'YES' } })
                .populate('friendOf')
        },
        findPerson: async (root, args) => Person.findOne({ name: args.name }),
        me: (root, args, context) => {
            return context.currentUser
        },
    },
    Person: {
        address: (root) => {
            return {
                street: root.street,
                city: root.city,
            }
        },
    },
    Mutation: {
        addPerson: async (root, args, context) => {
            const currentUser = context.currentUser

            if (!currentUser) {
                throw new AuthenticationError('not authenticated')
            }

            const person = new Person({ ...args })
            try {
                await person.save()
                currentUser.friends = currentUser.friends.concat(person)
                await currentUser.save()
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            }

            pubsub.publish('PERSON_ADDED', { personAdded: person })

            return person
        },
        editNumber: async (root, args) => {
            const person = await Person.findOne({ name: args.name })
            person.phone = args.phone

            try {
                await person.save()
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            }
            return person.save()
        },
        createUser: async (root, args) => {
            const user = new User({ username: args.username })

            return user.save().catch((error) => {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            })
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if (!user || args.password !== 'secret') {
                throw new UserInputError('wrong credentials')
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForToken, JWT_SECRET) }
        },
        addAsFriend: async (root, args, { currentUser }) => {
            const nonFriendAlready = (person) =>
                !currentUser.friends.map((f) => f._id.toString()).includes(person._id.toString())

            if (!currentUser) {
                throw new AuthenticationError('not authenticated')
            }

            const person = await Person.findOne({ name: args.name })
            if (nonFriendAlready(person)) {
                currentUser.friends = currentUser.friends.concat(person)
            }

            await currentUser.save()

            return currentUser
        },
    },
    Subscription: {
        personAdded: {
            subscribe: () => pubsub.asyncIterator(['PERSON_ADDED'])
        },
    },
}

module.exports = resolvers