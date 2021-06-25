const { gql }  = require('apollo-server-express');

const typeDefs = gql`
    type Book {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
    }

    type Query {
        me: User
    }

    type Mutation {
        login(email:String!, password: String!) : User
        addUser(username: String!, email: String!, password: String!) : User
    }

`;

module.exports = typeDefs;