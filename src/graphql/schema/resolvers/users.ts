import {User, UserData, UserDataWidthId, UserWithToken} from '../types/users'
import bcrypt from 'bcrypt'
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc} from 'firebase/firestore'
import {db} from '../../../db/firebase'
import firebase from 'firebase/compat'
import jwt from 'jsonwebtoken'
import DocumentData = firebase.firestore.DocumentData

require('dotenv').config()

const secretKey = process.env.JWT_SECRET

const q = query(collection(db, 'users'))
const colRef = collection(db, 'users')

const userResolvers: { Query: any; Mutation: any } = {
    Query: {
        getUsers: async (): Promise<{ data: DocumentData; id: string }[]> => {
            const docsSnap = await getDocs(colRef)
            const users = docsSnap.docs.map(item => ({
                id: item.id,
                data: item.data(),
            }))
            return users
        },
        getUserById: async (
            _: any,
            args: { id: string },
        ): Promise<User | null> => {
            const docRef = doc(db, 'users', args.id)
            const docsSnap = await getDoc(docRef)

            return {
                id: args.id,
                data: docsSnap.data() as UserData,
            }
        },
        getUserFromToken: async (
            _: any,
            {token}: { token: string },
        ): Promise<UserWithToken> => {
            try {
                const decodedToken: any = jwt.verify(token, secretKey)
                const userId = decodedToken.userId

                const docRef = doc(db, 'users', userId)
                const docsSnap = await getDoc(docRef)

                if (!docsSnap.exists) {
                    throw new Error('User not found')
                }

                return {
                    token,
                    user: {
                        id: docsSnap.id,
                        data: docsSnap.data() as UserData,
                    },
                }
            } catch (error) {
                throw new Error('Invalid token')
            }
        },
    },
    Mutation: {
        createUser: async (
            _: any,
            args: { newUser: UserData },
        ): Promise<User | null> => {
            const {username, firstName, lastName, password, roles} = args.newUser
            const hashedPassword = await bcrypt.hash(password, 12)
            const response = await addDoc(collection(db, 'users'),
                {
                    username,
                    firstName,
                    lastName,
                    hashedPassword,
                    roles,
                },
            )
            return {
                id: response.id,
                data: args.newUser,
            }
        },
        updateUser: async (
            _: any,
            args: { user: UserDataWidthId },
        ): Promise<boolean> => {
            const {id, password: rawPassword, ...data} = args.user
            const docRef = doc(db, 'users', id)
            const docsSnap = await getDoc(docRef)
            const password = await bcrypt.hash(rawPassword ?? docsSnap.data().password, 12)
            try {
                await updateDoc(docRef, {
                    password,
                    ...data,
                })
                return true
            } catch (e) {
                return false
            }
        },
        deleteUser: async (
            _: any,
            args: { id: string },
        ): Promise<boolean> => {
            const docRef = doc(db, 'users', args.id)
            try {
                deleteDoc(docRef)
                return true
            } catch (e) {
                return false
            }
        },
        loginUser: async (
            _: any,
            {input: {username, password}}: { input: { username: string; password: string } },
        ): Promise<UserWithToken> => {
            const docsSnap = await getDocs(colRef)
            const users = docsSnap.docs.map(item => ({
                id: item.id,
                data: item.data(),
            }))
            if (users.length === 0) {
                throw new Error('Nenašiel sa použivateľ ' + username)
            }
            const user = users.find(user => user.data.username === username)
            const passwordMatch = await bcrypt.compare(password, user.data.password)

            if (!passwordMatch) {
                throw new Error('Nesprávne heslo.')
            }

            const token = jwt.sign({userId: user.id}, secretKey, {expiresIn: '3d'}) // Customize the expiration time as needed

            return {user: user as User, token}
        },
        getUserFromToken: async (
            _: any,
            {token}: { token: string },
        ): Promise<UserWithToken> => {
            try {
                const decodedToken: any = jwt.verify(token, secretKey)
                const userId = decodedToken.userId

                const docRef = doc(db, 'users', userId)
                const docsSnap = await getDoc(docRef)

                if (!docsSnap.exists) {
                    throw new Error('User not found')
                }

                return {
                    token,
                    user: {
                        id: docsSnap.id,
                        data: docsSnap.data() as UserData,
                    },
                }
            } catch (error) {
                throw new Error('Invalid token')
            }
        },
    },
}

export default userResolvers