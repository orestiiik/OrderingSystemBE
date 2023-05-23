import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import typeDefs from "./graphql/schema/typeDefs";
import resolvers from "./graphql/schema/resolvers";
import https from 'https';
import fs from 'fs';
import http from "http";

require('dotenv').config();

const app = express();
app.use(express.json());

// const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ req })});

const httpServer = http.createServer(app);

// const tlsOptions = {
//     key: fs.readFileSync('./src/tls/localhost-key.pem'),
//     cert: fs.readFileSync('./src/tls/localhost.pem')
// };
// async function startServer() {
//     await server.start();
//     server.applyMiddleware({ app });
//
//     https.createServer(tlsOptions, app).listen(process.env.PORT, () => {
//         console.log(`🚀 Server ready at https://localhost:${process.env.PORT}${server.graphqlPath}`);
//     });
// }
//
// startServer();

const startApolloServer = async(app, httpServer) => {
    const server = new ApolloServer({
        context: ({ req }) => ({ req }),
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();
    console.log(`🚀 Server ready at https://localhost:${process.env.PORT}${server.graphqlPath}`)
    server.applyMiddleware({ app });
}

startApolloServer(app, httpServer);
export default httpServer;