import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
query {
  allAuthors {
      name
      born
      bookCount
      id
  }
}
`

export const ALL_BOOKS = gql`
query {
  allBooks {
    title
    author {
      name
      born
      bookCount
    }
    published
    genres
    id
  }
}
`

export const ADD_BOOK = gql`
mutation(
  $title: String!
  $author: String!
  $published: Int!
  $genres: [String!]!) {
  addBook(title: $title, author: $author, published: $published, genres: $genres) {
    author
    genres
    published
    title
    id
  }
}
`

export const UPDATE_BIRTHYEAR = gql`
mutation($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    bookCount
    born
    name
    id
  }
}
`

export const LOGIN_USER = gql`
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
`