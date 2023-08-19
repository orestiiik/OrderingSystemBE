// import {ApolloServer, gql} from 'apollo-server-express'
import {ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault} from 'apollo-server-core'
// import http from 'http'
// import express from 'express'
// import cors from 'cors'
// import {Category, CategoryData} from '../src/graphql/schema/types/categories'
// import {
//     addDoc,
//     collection,
//     deleteDoc,
//     doc,
//     getDoc,
//     getDocs, orderBy,
//     query,
//     serverTimestamp,
//     updateDoc, where,
// } from 'firebase/firestore'
// import {db} from '../src/db/firebase'
// import {Item, ItemData} from '../src/graphql/schema/types/items'
// import {User, UserData, UserDataWidthId, UserWithToken} from '../src/graphql/schema/types/users'
// import {ItemType, LastSale, Sale, SaleData} from '../src/graphql/schema/types/sales'
//
// import jwt from 'jsonwebtoken'
// import bcrypt from 'bcrypt'
// import {endOfDay, startOfDay} from 'date-fns'
//
// require('dotenv').config()
//
// const app = express()
//
// app.use(cors())
// app.use(express.json())
//
// const httpServer = http.createServer(app)
//
// const typeDefs = gql`
//     type CategoryWithId {
//         id: String,
//         data: CategoryType
//     }
//
//     type CategoryType {
//         name: String,
//         active: Boolean
//     }
//
//
//     input CategoryInput {
//         name: String,
//         active: Boolean
//     }
//
//     input CategoryData {
//         name: String,
//         active: Boolean
//     }
//
//     input CategoryInputWithId {
//         id: String,
//         data: CategoryData
//     }
//     type Item {
//         id: String,
//         data: ItemData
//     }
//
//     type CategoryInfo {
//         name: String,
//         active: Boolean
//     }
//
//     type Category {
//         id: String,
//         data: CategoryInfo
//     }
//
//     input ItemInput {
//         name: String,
//         category: String,
//         price: Float,
//         weight: Float,
//         liquid: Boolean,
//         state: String
//     }
//
//     type ItemData {
//         name: String,
//         category: Category,
//         price: Float,
//         weight: Float,
//         liquid: Boolean,
//         state: String
//     }
//
//     input ItemInputWithId {
//         id: String,
//         data: ItemInput
//     }
//     type Sale {
//         id: String!
//         data: SaleData!
//     }
//
//     type SaleData {
//         done: Boolean,
//         address: Address
//         person: Person
//         price: Float!
//         timestamp: String,
//         order: [ItemType]
//     }
//
//     type Address {
//         city: String,
//         street: String,
//         note: String,
//     }
//
//     type Person {
//         fullName: String,
//         telephone: String,
//     }
//
//     type ItemType {
//         category: Category
//         items: [ItemDataType]
//     }
//
//     type ItemDataType {
//         name: String,
//         price: Float,
//         weight: Float,
//         liquid: Boolean,
//         state: String
//         quantity: Int,
//     }
//
//     type LastSale {
//         date: String,
//         totalPrice: Float,
//     }
//
//     type Query {
//         getSales(active: Boolean!): [Sale!]
//         getSaleById(id: String!): Sale
//         getTodaySalesTotal: Float
//         getTodayPriceTotal: Float
//         getTotalSoldQuantity: Float
//         getLastSales: [LastSale!]
//         getUsers: [UserWithId]
//         getUserById(id: String!): UserWithId
//         getUserFromToken(token: String!): UserWithToken
//         getCategories: [CategoryWithId]
//         getCategoryById(id: String!): CategoryWithId
//         getItems: [Item]
//         getItemById(id: String!): Item
//     }
//
//     input ItemTypeInput {
//         category: CategoryInputType
//         items: [ItemDataTypeInput]
//     }
//
//     input ItemDataTypeInput {
//         name: String,
//         price: Float,
//         weight: Float,
//         liquid: Boolean,
//         state: String
//         quantity: Int,
//     }
//
//     input CategoryInputType {
//         id: String,
//         data: CategoryDataType
//     }
//
//     input CategoryDataType {
//         name: String,
//         active: Boolean
//     }
//
//     input SaleInput {
//         done: Boolean
//         address: AddressInput
//         person: PersonInput
//         order: [ItemTypeInput]
//     }
//
//     input AddressInput {
//         city: String,
//         street: String,
//         note: String,
//     }
//
//     input PersonInput {
//         fullName: String,
//         telephone: String,
//     }
//
//     type Mutation {
//         updateSaleStatus(id: String!): Boolean
//         createSale(newSale: SaleInput!): Sale
//         deleteSale(id: String!): Boolean
//         updateUser(user: inputUser) : Boolean
//         createUser(newUser: userData!): UserWithId
//         deleteUser(id: String!): Boolean
//         loginUser(input: LoginInput!): UserWithToken
//         getUserFromToken(token: String!): UserWithToken
//         updateCategory(category: CategoryInputWithId) : Boolean
//         createCategory(newCategory: CategoryInput): CategoryWithId
//         deleteCategory(id: String!): Boolean
//         updateItem(item: ItemInputWithId): Boolean
//         createItem(newItem: ItemInput): Item
//         deleteItem(id: String!): Boolean
//     }
//     type UserWithId {
//         id: String,
//         data: User
//     }
//
//     type UserWithToken {
//         token: String,
//         user: UserWithId
//     }
//
//     type User {
//         username: String
//         firstName: String
//         lastName: String
//         password: String
//         roles: [String]
//     }
//
//     input userData {
//         username: String
//         firstName: String
//         lastName: String
//         password: String
//         roles: [String]
//     }
//
//     input inputUser {
//         id: String,
//         username: String
//         firstName: String
//         lastName: String
//         password: String
//         roles: [String]
//     }
//
//     input LoginInput {
//         username: String!
//         password: String!
//     }
// `
//
// const resolvers = {
//     Query: {
//         getCategories: async (): Promise<Category[]> => {
//             const colRef = collection(db, 'categories')
//             const docsSnap = await getDocs(colRef)
//             const categories = docsSnap.docs.map(item => ({
//                 id: item.id,
//                 data: item.data(),
//             }))
//             return categories as Category[] ?? [{id: 'nothing found'}] as Category[]
//         },
//         getCategoryById: async (
//             _: any,
//             args: { id: string },
//         ): Promise<Category | null> => {
//             const docRef = doc(db, 'categories', args.id)
//             const docsSnap = await getDoc(docRef)
//
//             return {
//                 id: args.id,
//                 data: docsSnap.data() as CategoryData,
//             }
//         },
//         getItems: async (): Promise<Item[]> => {
//             const itemsCollection = collection(db, 'items')
//             const docsSnap = await getDocs(itemsCollection)
//             const itemPromises = docsSnap.docs.map(async (item) => {
//                 const categoryRef = doc(db, 'categories', item.data()?.category)
//                 const categorySnap = await getDoc(categoryRef)
//                 const {category, ...data} = await item.data()
//                 return ({
//                     id: item.id,
//                     data: {
//                         category: {
//                             id: category,
//                             data: {
//                                 name: categorySnap.data().name,
//                                 active: categorySnap.data().active,
//                             },
//                         },
//                         ...data,
//                     } as ItemData,
//                 })
//             })
//             const items = await Promise.all(itemPromises)
//             return items as Item[]
//         },
//         getItemById: async (
//             _: any,
//             args: { id: string },
//         ): Promise<Item | null> => {
//             const itemRef = doc(db, 'items', args.id)
//             const itemSnap = await getDoc(itemRef)
//             const categoryRef = doc(db, 'categories', itemSnap.data()?.category?.id)
//             const categorySnap = await getDoc(categoryRef)
//             return {
//                 id: args.id,
//                 data:
//                     {
//                         category: categorySnap.data(),
//                         ...itemSnap.data(),
//                     } as ItemData,
//             }
//         },
//         getSales: async (
//             _: any,
//             args: { active: boolean },
//         ): Promise<Sale[]> => {
//             const salesCollection = collection(db, 'sales')
//             const docsSnap = await getDocs(query(
//                 salesCollection,
//                 where('done', '==', !args.active),
//             ))
//             const sales = docsSnap.docs.map((doc) => ({
//                 id: doc.id,
//                 data: doc.data() as SaleData,
//             }))
//
//             return sales.reverse() as Sale[]
//         },
//         getSaleById: async (
//             _: any,
//             args: { id: string },
//         ): Promise<Sale | null> => {
//             const docRef = doc(db, 'sales', args.id)
//             const docSnap = await getDoc(docRef)
//
//             if (docSnap.exists()) {
//                 return {
//                     id: args.id,
//                     data: docSnap.data() as SaleData,
//                 }
//             }
//
//             return null
//         },
//         getLastSales: async (): Promise<LastSale[]> => {
//             const salesCollection = collection(db, 'sales')
//             const today = new Date()
//             today.setHours(0, 0, 0, 0) // Set the time to the start of the day
//
//             const lastFiveDays = Array.from({length: 5}, (_, index) => {
//                 return new Date(today.getTime() - index * 24 * 60 * 60 * 1000)
//             })
//
//             const lastFiveDaysSales: LastSale[] = []
//
//             for (const date of lastFiveDays) {
//                 const startOfDate = startOfDay(date)
//                 const endOfDate = endOfDay(date)
//
//                 const salesQuery = query(
//                     salesCollection,
//                     where('timestamp', '>=', startOfDate),
//                     where('timestamp', '<=', endOfDate),
//                     orderBy('timestamp'),
//                 )
//
//                 const salesSnapshot = await getDocs(salesQuery)
//
//                 const calculateOrderPrice = (order: ItemType[]): number => {
//                     let totalPrice = 0
//                     order?.forEach((item) => {
//                         item.items?.forEach(x =>
//                             totalPrice += x.price * x.quantity,
//                         )
//                     })
//                     return totalPrice
//                 }
//
//                 let totalPrice = 0
//                 salesSnapshot?.docs?.forEach((doc: any) => {
//                     const saleData = doc.data() as SaleData
//                     totalPrice += calculateOrderPrice(saleData.order)
//                 })
//
//                 lastFiveDaysSales.push({
//                     date: date.toISOString().slice(0, 10),
//                     totalPrice: parseFloat((Math.round(totalPrice * 100) / 100).toFixed(2)),
//                 })
//             }
//             return lastFiveDaysSales.reverse()
//         },
//         getTodaySalesTotal: async (): Promise<number> => {
//             const salesCollection = collection(db, 'sales')
//             const startOfToday = startOfDay(new Date())
//             const endOfToday = endOfDay(new Date())
//             const querySnapshot = await getDocs(
//                 query(
//                     salesCollection,
//                     where('timestamp', '>=', startOfToday),
//                     where('timestamp', '<=', endOfToday),
//                 ),
//             )
//
//             return querySnapshot.docs.length
//         },
//         getTodayPriceTotal: async (): Promise<number> => {
//             const salesCollection = collection(db, 'sales')
//             const startOfToday = startOfDay(new Date())
//             const endOfToday = endOfDay(new Date())
//
//             const salesQuery = query(
//                 salesCollection,
//                 where('timestamp', '>=', startOfToday),
//                 where('timestamp', '<', endOfToday),
//             )
//             const salesSnapshot = await getDocs(salesQuery)
//
//             let total = 0
//
//             const calculateOrderPrice = (order: ItemType[]): number => {
//                 let totalPrice = 0
//                 order?.forEach((item) => {
//                     item.items?.forEach(x =>
//                         totalPrice += x.price * x.quantity,
//                     )
//                 })
//                 return totalPrice
//             }
//
//             salesSnapshot.docs.forEach((doc: any) => {
//                 const saleData = doc.data() as SaleData
//                 total += calculateOrderPrice(saleData.order)
//             })
//
//             return parseFloat((Math.round(total * 100) / 100).toFixed(2))
//         },
//         getTotalSoldQuantity: async (): Promise<number> => {
//             const salesCollection = collection(db, 'sales')
//             const startOfToday = startOfDay(new Date())
//             const endOfToday = endOfDay(new Date())
//
//             const salesQuery = query(
//                 salesCollection,
//                 where('timestamp', '>=', startOfToday),
//                 where('timestamp', '<', endOfToday),
//             )
//             const salesSnapshot = await getDocs(salesQuery)
//
//             let totalQuantity = 0
//
//             salesSnapshot.docs.forEach((doc: any) => {
//                 const saleData = doc.data() as SaleData
//                 saleData.order?.forEach((item: ItemType) => {
//                     item.items?.forEach(x =>
//                         totalQuantity += x.quantity,
//                     )
//                 })
//             })
//
//             return totalQuantity
//         },
//         getUsers: async (): Promise<{ data: any; id: string }[]> => {
//             const colRef = collection(db, 'users')
//
//             const docsSnap = await getDocs(colRef)
//             const users = docsSnap.docs.map(item => ({
//                 id: item.id,
//                 data: item.data(),
//             }))
//             return users
//         },
//         getUserById: async (
//             _: any,
//             args: { id: string },
//         ): Promise<User | null> => {
//             const docRef = doc(db, 'users', args.id)
//             const docsSnap = await getDoc(docRef)
//
//             return {
//                 id: args.id,
//                 data: docsSnap.data() as UserData,
//             }
//         },
//         getUserFromToken: async (
//             _: any,
//             {token}: { token: string },
//         ): Promise<UserWithToken> => {
//             const secretKey = process.env.JWT_SECRET
//             try {
//                 const decodedToken: any = jwt.verify(token, secretKey)
//                 const userId = decodedToken.userId
//
//                 const docRef = doc(db, 'users', userId)
//                 const docsSnap = await getDoc(docRef)
//
//                 if (!docsSnap.exists) {
//                     throw new Error('User not found')
//                 }
//
//                 return {
//                     token,
//                     user: {
//                         id: docsSnap.id,
//                         data: docsSnap.data() as UserData,
//                     },
//                 }
//             } catch (error) {
//                 throw new Error('Invalid token')
//             }
//         },
//     },
//     Mutation: {
//         createCategory: async (
//             _: any,
//             args: { newCategory: CategoryData },
//         ): Promise<Category | null> => {
//             const {name, active} = args.newCategory
//             const response = await addDoc(collection(db, 'categories'), {
//                 name,
//                 active,
//             })
//             return {
//                 id: response.id,
//                 data: args.newCategory,
//             }
//         },
//         updateCategory: async (
//             _: any,
//             args: { category: Category },
//         ): Promise<boolean> => {
//             const {id, data: {name, active}} = args.category
//             const docRef = doc(db, 'categories', id)
//             try {
//                 await updateDoc(docRef, {name, active})
//                 return true
//             } catch (e) {
//                 console.log(e)
//                 return false
//             }
//         },
//         deleteCategory: async (
//             _: any,
//             args: { id: string },
//         ): Promise<boolean> => {
//             const docRef = doc(db, 'categories', args.id)
//             try {
//                 await deleteDoc(docRef)
//                 return true
//             } catch (e) {
//                 console.log(e)
//                 return false
//             }
//         },
//         createItem: async (
//             _: any,
//             args: { newItem: ItemData },
//         ): Promise<Item | null> => {
//             const itemsCollection = collection(db, 'items')
//             const response = await addDoc(itemsCollection, {
//                 ...args.newItem,
//             })
//             return {
//                 id: response.id,
//                 data: args.newItem,
//             }
//         },
//         updateItem: async (
//             _: any,
//             args: { item: Item },
//         ): Promise<boolean> => {
//             const {id, data} = args.item
//             const itemRef = doc(db, 'items', id)
//             try {
//                 await updateDoc(itemRef, {...data})
//                 return true
//             } catch (e) {
//                 console.log(e)
//                 return false
//             }
//         },
//         deleteItem: async (
//             _: any,
//             args: { id: string },
//         ): Promise<boolean> => {
//             const itemRef = doc(db, 'items', args.id)
//             try {
//                 await deleteDoc(itemRef)
//                 return true
//             } catch (e) {
//                 console.log(e)
//                 return false
//             }
//         },
//         createUser: async (
//             _: any,
//             args: { newUser: UserData },
//         ): Promise<User | null> => {
//             const {username, firstName, lastName, password, roles} = args.newUser
//             const hashedPassword = await bcrypt.hash(password, 12)
//             const response = await addDoc(collection(db, 'users'),
//                 {
//                     username,
//                     firstName,
//                     lastName,
//                     hashedPassword,
//                     roles,
//                 },
//             )
//             return {
//                 id: response.id,
//                 data: args.newUser,
//             }
//         },
//         updateUser: async (
//             _: any,
//             args: { user: UserDataWidthId },
//         ): Promise<boolean> => {
//             const {id, password: rawPassword, ...data} = args.user
//             const docRef = doc(db, 'users', id)
//             const docsSnap = await getDoc(docRef)
//             const password = await bcrypt.hash(rawPassword ?? docsSnap.data().password, 12)
//             try {
//                 await updateDoc(docRef, {
//                     password,
//                     ...data,
//                 })
//                 return true
//             } catch (e) {
//                 return false
//             }
//         },
//         deleteUser: async (
//             _: any,
//             args: { id: string },
//         ): Promise<boolean> => {
//             const docRef = doc(db, 'users', args.id)
//             try {
//                 deleteDoc(docRef)
//                 return true
//             } catch (e) {
//                 return false
//             }
//         },
//         loginUser: async (
//             _: any,
//             {input: {username, password}}: { input: { username: string; password: string } },
//         ): Promise<UserWithToken> => {
//             const secretKey = process.env.JWT_SECRET
//             const colRef = collection(db, 'users')
//             const docsSnap = await getDocs(colRef)
//             const users = docsSnap.docs.map(item => ({
//                 id: item.id,
//                 data: item.data(),
//             }))
//             if (users.length === 0) {
//                 throw new Error('Nenašiel sa použivateľ ' + username)
//             }
//             const user = users.find(user => user.data.username === username)
//             const passwordMatch = await bcrypt.compare(password, user.data.password)
//
//             if (!passwordMatch) {
//                 throw new Error('Nesprávne heslo.')
//             }
//
//             const token = jwt.sign({userId: user.id}, secretKey, {expiresIn: '1d'}) // Customize the expiration time as needed
//
//             return {user: user as User, token}
//         },
//         getUserFromToken: async (
//             _: any,
//             {token}: { token: string },
//         ): Promise<UserWithToken> => {
//             const secretKey = process.env.JWT_SECRET
//             try {
//                 const decodedToken: any = jwt.verify(token, secretKey)
//                 const userId = decodedToken.userId
//
//                 const docRef = doc(db, 'users', userId)
//                 const docsSnap = await getDoc(docRef)
//
//                 if (!docsSnap.exists) {
//                     throw new Error('User not found')
//                 }
//
//                 return {
//                     token,
//                     user: {
//                         id: docsSnap.id,
//                         data: docsSnap.data() as UserData,
//                     },
//                 }
//             } catch (error) {
//                 throw new Error('Invalid token')
//             }
//         },
//         createSale: async (
//             _: any,
//             args: { newSale: SaleData },
//         ): Promise<Sale | null> => {
//             const salesCollection = collection(db, 'sales')
//             const timestamp = serverTimestamp()
//
//             const calculateOrderPrice = (order: ItemType[]): number => {
//                 let totalPrice = 0
//                 order?.forEach((item) => {
//                     item.items?.forEach(x =>
//                         totalPrice += x.price * x.quantity,
//                     )
//                 })
//                 return totalPrice
//             }
//
//             const totalPrice = calculateOrderPrice(args.newSale.order)
//
//
//             const response = await addDoc(salesCollection, {
//                 timestamp,
//                 price: totalPrice ? parseFloat((Math.round(totalPrice * 100) / 100).toFixed(2)) : 0,
//                 ...args.newSale,
//             })
//             return {
//                 id: response.id,
//                 data: {
//                     price: totalPrice,
//                     ...args.newSale,
//                 },
//             }
//         },
//         deleteSale: async (
//             _: any,
//             args: { id: string },
//         ): Promise<boolean> => {
//             const docRef = doc(db, 'sales', args.id)
//
//             try {
//                 await deleteDoc(docRef)
//                 return true
//             } catch (error) {
//                 console.log(error)
//                 return false
//             }
//         },
//         updateSaleStatus: async (_: any, args: { id: string }): Promise<boolean> => {
//             const saleRef = doc(db, 'sales', args.id)
//
//             try {
//                 await updateDoc(saleRef, {done: true})
//
//                 return true
//             } catch (error) {
//                 console.log(error)
//             }
//
//             return false
//         },
//
//     },
// }
// const startApolloServer = async (app, httpServer) => {
//     const server = new ApolloServer({
//         context: ({req}) => ({req}),
//         typeDefs,
//         resolvers,
//         introspection: true,
//         plugins: [
//             ApolloServerPluginLandingPageLocalDefault({footer: false}),
//             ApolloServerPluginDrainHttpServer({httpServer}),
//         ],
//     })
//
//     await server.start()
//     server.applyMiddleware({app})
// }
//
// startApolloServer(app, httpServer)
//
// export default httpServer

import dotenv from 'dotenv'
import {MongoClient, ServerApiVersion} from 'mongodb'
import {ApolloServer} from 'apollo-server-express'
import http from 'http'
import express from 'express'
import cors from 'cors'
import typeDefs from '../src/graphql/schema/typeDefs'
import resolvers from '../src/graphql/schema/resolvers'

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
        introspection: true,
        context: {db},
        plugins: [
            ApolloServerPluginLandingPageLocalDefault({footer: false}),
            ApolloServerPluginDrainHttpServer({httpServer}),
        ],
    })
    await server.start()

    // Apply Apollo Server middleware to the Express app
    server.applyMiddleware({app, path: '/graphql'}) // Add this line

    httpServer.listen({port: 4000}, () => {
        console.log(`Server running at http://localhost:4000${server.graphqlPath}`)
    })
}

startApolloServer().catch(err => {
    console.error('Error starting the server:', err)
})
