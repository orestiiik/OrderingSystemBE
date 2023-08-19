import {Db, ObjectId} from 'mongodb'
import {User, UserData, UserDataWidthId, UserWithToken} from '../types/users'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userResolvers: { Query: any; Mutation: any } = {
    Query: {
        getUsers: async (
            _: any,
            __: any,
            {db}: { db: Db },
        ): Promise<User[]> => {
            const usersCollection = db.collection('users')
            const users = await usersCollection.find().toArray()

            return users.map((user: any) => ({
                id: user._id.toString(),
                data: user as UserData,
            }))
        },
        getUserById: async (
            _: any,
            args: { id: string },
            {db}: { db: Db },
        ): Promise<User | null> => {
            const usersCollection = db.collection('users')
            const user = await usersCollection.findOne({_id: new ObjectId(args.id)})

            if (!user) {
                return null
            }

            return {
                id: user._id.toString(),
                data: user as unknown as UserData,
            }
        },
        getUserFromToken: async (
            _: any,
            {token}: { token: string },
            {db}: { db: Db },
        ): Promise<UserWithToken> => {
            const secretKey = process.env.JWT_SECRET

            try {
                const decodedToken: any = jwt.verify(token, secretKey)
                const userId = decodedToken.userId

                const usersCollection = db.collection('users')
                const user = await usersCollection.findOne({_id: new ObjectId(userId)})

                if (!user) {
                    throw new Error('User not found')
                }

                return {
                    token,
                    user: {
                        id: user._id.toString(),
                        data: user as unknown as UserData,
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
            {db}: { db: Db },
        ): Promise<boolean> => {
            const usersCollection = db.collection('users')
            const {username, firstName, lastName, password, roles} = args.newUser
            const hashedPassword = await bcrypt.hash(password, 12)

            const newUserDoc = {
                username,
                firstName,
                lastName,
                password: hashedPassword,
                roles,
            }

            const result = await usersCollection.insertOne(newUserDoc)
            const insertedUser = result.insertedId

            return !!insertedUser
        },
        updateUser: async (
            _: any,
            args: { user: UserDataWidthId },
            { db }: { db: Db }
        ): Promise<boolean> => {
            const { id, password: rawPassword, ...data } = args.user;
            const usersCollection = db.collection('users');
            const docToUpdate = {
                ...data,
                password: rawPassword ? await bcrypt.hash(rawPassword, 12) : undefined,
            };

            try {
                const result = await usersCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: docToUpdate }
                );
                return result.modifiedCount > 0;
            } catch (error) {
                console.error(error);
                return false;
            }
        },
        deleteUser: async (
            _: any,
            args: { id: string },
            { db }: { db: Db }
        ): Promise<boolean> => {
            const usersCollection = db.collection('users');

            try {
                const result = await usersCollection.deleteOne({ _id: new ObjectId(args.id) });
                return result.deletedCount > 0;
            } catch (error) {
                console.error(error);
                return false;
            }
        },
        loginUser: async (
            _: any,
            { input: { username, password } }: { input: { username: string; password: string } },
            { db }: { db: Db }
        ): Promise<UserWithToken> => {
            const usersCollection = db.collection('users');

            const user = await usersCollection.findOne({ username });

            if (!user) {
                throw new Error('User not found');
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                throw new Error('Incorrect password');
            }

            const secretKey = process.env.JWT_SECRET;
            const token = jwt.sign({ userId: user._id.toString() }, secretKey, { expiresIn: '1d' });

            return {
                user: {
                    id: user._id.toString(),
                    data: {
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        password: '',
                        roles: user.roles,
                    },
                },
                token,
            };
        },
    },
}

export default userResolvers
