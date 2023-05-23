import express from "express";
import {ApolloServer} from "apollo-server-express";
import typeDefs from "./graphql/schema/typeDefs";
import resolvers from "./graphql/schema/resolvers";
import https from 'https';
import fs from 'fs';

require('dotenv').config();

const app = express();
const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ req })});

const tlsOptions = {
    key: fs.readFileSync('./src/tls/localhost-key.pem'),
    cert: fs.readFileSync('./src/tls/localhost.pem')
};
async function startServer() {
    await server.start();
    server.applyMiddleware({ app });

    https.createServer(tlsOptions, app).listen(process.env.PORT, () => {
        console.log(`🚀 Server ready at https://localhost:${process.env.PORT}${server.graphqlPath}`);
    });
}

startServer();