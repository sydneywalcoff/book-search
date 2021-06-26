import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation login($email:String!, $password:String!) {
        login(email:$email, password:$password) {
            token
            user {
                _id
            }
        }
    }
`;

export const ADD_USER = gql`
    mutation addUser($username:String!, $password:String!, $email:String!) {
        addUser(username:$username, email:$email, password:$password){
            _id
            email
            username
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($authors: [String], $description:String!, $title: String!, $bookId:String!, $image:String, $link:String) {
        saveBook(authors: $authors, description:$description, title:$title, bookId:$bookId, image:$image, link:$link) {
            username
            savedBooks {
                title
            }
        }
    }
`;

export const REMOVE_BOOK = gql`
    mutation removeBook($bookId:String!) {
        removeBook(bookId:$bookId) {
            username
            savedBooks {
                title
            }
        }
    }
`;