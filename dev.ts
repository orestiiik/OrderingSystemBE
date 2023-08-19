import dotenv from 'dotenv'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { ApolloServer } from 'apollo-server-express'
import resolvers from './src/graphql/schema/resolvers'
import typeDefs from './src/graphql/schema/typeDefs'
import http from 'http'
import express from 'express'
import cors from 'cors'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

const httpServer = http.createServer(app)

const uri = 'mongodb+srv://mongo_admin:EaWBl87C66PwbZ30@admindashboard.po50j5y.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
})

async function startApolloServer() {
    await client.connect()
    const db = client.db('AdminDashboard')

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: { db }, // Pass the db instance to the resolvers
    })

    await server.start()

    // Apply Apollo Server middleware to the Express app
    server.applyMiddleware({ app, path: '/graphql' }) // Add this line

    httpServer.listen({ port: 4000 }, () => {
        console.log(`Server running at http://localhost:4000${server.graphqlPath}`)
    })
}

startApolloServer().catch(err => {
    console.error('Error starting the server:', err)
})
