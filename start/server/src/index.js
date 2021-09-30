require('dotenv').config();

const {ApolloServer} = require('apollo-server');

//sql comunication schema
const typeDefs = require('./schema');

//function to store a single source of state
const {createStore} = require('./utils');
const resolvers = require('./resolvers');

//API Data Sources Classes LaunchAPI is external UserAPI is internal
const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');


const store = createStore();

//defines schemas and datasources for the server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userAPI: new UserAPI({store})
  }),
});

server.listen().then( () => {
  console.log(`
    Server is running!
    Listening on port 4000
  `)
})
