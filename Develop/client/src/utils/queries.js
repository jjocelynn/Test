import { gql } from "@apollo/client";

export const GET_ME = gql`
  query me($id: ID, $username: String) {
    me(id: $id, username: $username) {
      _id
      bookCount
      email
      savedBooks {
        authors
        bookId
        descripton
        image
        link
        title
      }
      username
    }
  }
`;
