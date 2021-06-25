const { gql }  = require('apollo-server-express');

const typeDefs = gql`
    type Query {
        helloWord: String
    }
`;

module.exports = typeDefs;