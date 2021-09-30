require('dotenv').config();

const {ApolloServer} = require('apollo-server');
const isEmail = require('isemail');

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

  context: async ({ req }) => {
    // simple auth check on every request
    const auth = req.headers && req.headers.authorization || '';
    const email = Buffer.from(auth, 'base64').toString('ascii');
    if (!isEmail.validate(email)) return { user: null };
    // find a user by their email
    const users = await store.users.findOrCreate({ where: { email } });
    const user = users && users[0] || null;
    return { user: { ...user.dataValues } };
  },
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
