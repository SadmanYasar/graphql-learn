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
    author
    published
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