// import express from "express";
// import { ApolloServer } from "apollo-server-express";
// import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import td from "../src/graphql/schema/typeDefs";
import rs from "../src/graphql/schema/resolvers";
// import https from 'https';
// import fs from 'fs';
// import http from "http";
//
// require('dotenv').config();
//
// const app = express();
// app.use(express.json());
//
// // const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ req })});
//
// const httpServer = http.createServer(app);
//
// // const tlsOptions = {
// //     key: fs.readFileSync('./src/tls/localhost-key.pem'),
// //     cert: fs.readFileSync('./src/tls/localhost.pem')
// // };
// // async function startServer() {
// //     await server.start();
// //     server.applyMiddleware({ app });
// //
// //     https.createServer(tlsOptions, app).listen(process.env.PORT, () => {
// //         console.log(`🚀 Server ready at https://localhost:${process.env.PORT}${server.graphqlPath}`);
// //     });
// // }
// //
// // startServer();
//
// const startApolloServer = async(app, httpServer) => {
//     const server = new ApolloServer({
//         context: ({ req }) => ({ req }),
//         typeDefs,
//         resolvers,
//         plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
//     });
//
//     await server.start();
//     console.log(`🚀 Server ready at https://localhost:${process.env.PORT}${server.graphqlPath}`)
//     server.applyMiddleware({ app });
// }
//
// startApolloServer(app, httpServer);
// export default httpServer;

import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import http from "http";
import express from "express";
import cors from "cors";
import {tr} from 'date-fns/locale'

const app = express();

app.use(cors());
app.use(express.json());
app.listen(4040)

const httpServer = http.createServer(app);

const typeDefs = gql`
    type CategoryWithId {
        id: String,
        data: CategoryType
    }

    type CategoryType {
        name: String,
        active: Boolean
    }


    input CategoryInput {
        name: String,
        active: Boolean
    }

    input CategoryData {
        name: String,
        active: Boolean
    }

    input CategoryInputWithId {
        id: String,
        data: CategoryData
    }
    type Item {
        id: String,
        data: ItemData
    }

    type CategoryInfo {
        name: String,
        active: Boolean
    }

    type Category {
        id: String,
        data: CategoryInfo
    }

    input ItemInput {
        name: String,
        category: String,
        price: Float,
        weight: Float,
        liquid: Boolean,
        state: String
    }

    type ItemData {
        name: String,
        category: Category,
        price: Float,
        weight: Float,
        liquid: Boolean,
        state: String
    }

    input ItemInputWithId {
        id: String,
        data: ItemInput
    }
    type Sale {
        id: String!
        data: SaleData!
    }

    type SaleData {
        done: Boolean,
        address: Address
        person: Person
        price: Float!
        timestamp: String,
        order: [ItemType]
    }

    type Address {
        city: String,
        street: String,
        note: String,
    }

    type Person {
        fullName: String,
        telephone: String,
    }

    type ItemType {
        category: Category
        items: [ItemDataType]
    }

    type ItemDataType {
        name: String,
        price: Float,
        weight: Float,
        liquid: Boolean,
        state: String
        quantity: Int,
    }

    type LastSale {
        date: String,
        totalPrice: Float,
    }

    type Query {
        getSales(active: Boolean!): [Sale!]
        getSaleById(id: String!): Sale
        getTodaySalesTotal: Float
        getTodayPriceTotal: Float
        getTotalSoldQuantity: Float
        getLastSales: [LastSale!]
        getUsers: [UserWithId]
        getUserById(id: String!): UserWithId
        getUserFromToken(token: String!): UserWithToken
        getCategories: [CategoryWithId]
        getCategoryById(id: String!): CategoryWithId
        getItems: [Item]
        getItemById(id: String!): Item
    }

    input ItemTypeInput {
        category: CategoryInputType
        items: [ItemDataTypeInput]
    }

    input ItemDataTypeInput {
        name: String,
        price: Float,
        weight: Float,
        liquid: Boolean,
        state: String
        quantity: Int,
    }

    input CategoryInputType {
        id: String,
        data: CategoryDataType
    }

    input CategoryDataType {
        name: String,
        active: Boolean
    }

    input SaleInput {
        done: Boolean
        address: AddressInput
        person: PersonInput
        order: [ItemTypeInput]
    }

    input AddressInput {
        city: String,
        street: String,
        note: String,
    }

    input PersonInput {
        fullName: String,
        telephone: String,
    }

    type Mutation {
        updateSaleStatus(id: String!): Boolean
        createSale(newSale: SaleInput!): Sale
        deleteSale(id: String!): Boolean
        updateUser(user: inputUser) : Boolean
        createUser(newUser: userData!): UserWithId
        deleteUser(id: String!): Boolean
        loginUser(input: LoginInput!): UserWithToken
        getUserFromToken(token: String!): UserWithToken
        updateCategory(category: CategoryInputWithId) : Boolean
        createCategory(newCategory: CategoryInput): CategoryWithId
        deleteCategory(id: String!): Boolean
        updateItem(item: ItemInputWithId): Boolean
        createItem(newItem: ItemInput): Item
        deleteItem(id: String!): Boolean
    }
    type UserWithId {
        id: String,
        data: User
    }

    type UserWithToken {
        token: String,
        user: UserWithId
    }

    type User {
        username: String
        firstName: String
        lastName: String
        password: String
        roles: [String]
    }

    input userData {
        username: String
        firstName: String
        lastName: String
        password: String
        roles: [String]
    }

    input inputUser {
        id: String,
        username: String
        firstName: String
        lastName: String
        password: String
        roles: [String]
    }

    input LoginInput {
        username: String!
        password: String!
    }
`;
const startApolloServer = async(app, httpServer) => {
    const server = new ApolloServer({
        context: ({ req }) => ({ req }),
        typeDefs,
        resolvers: rs,
        introspection: true,
        plugins: [
            ApolloServerPluginLandingPageLocalDefault({ footer: false }),
            ApolloServerPluginDrainHttpServer({ httpServer })
        ]
    });

    await server.start();
    server.applyMiddleware({ app });
}

startApolloServer(app, httpServer);

export default httpServer;