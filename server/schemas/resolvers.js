const resolvers = {
    Query: {
        helloWord: () => {
            return 'Hello World';
        }
    }
};

module.exports = resolvers;