import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc} from 'firebase/firestore'
import {db} from '../../../db/firebase'
import {Item, ItemData} from '../types/items'

require('dotenv').config()

const itemsCollection = collection(db, 'items')

const itemResolver: { Query: any, Mutation: any } = {
    Query: {
        getItems: async (): Promise<Item[]> => {
            const docsSnap = await getDocs(itemsCollection)
            const itemPromises = docsSnap.docs.map(async (item) => {
                const categoryRef = doc(db, 'categories', item.data()?.category)
                const categorySnap = await getDoc(categoryRef)
                const {category, ...data} = await item.data()
                return ({
                    id: item.id,
                    data: {
                        category: {
                            id: category,
                            data: {
                                name: categorySnap.data().name,
                                active: categorySnap.data().active,
                            },
                        },
                        ...data,
                    } as ItemData,
                })
            })
            const items = await Promise.all(itemPromises)
            return items as Item[]
        },
        getItemById: async (
            _: any,
            args: { id: string },
        ): Promise<Item | null> => {
            const itemRef = doc(db, 'items', args.id)
            const itemSnap = await getDoc(itemRef)
            const categoryRef = doc(db, 'categories', itemSnap.data()?.category?.id)
            const categorySnap = await getDoc(categoryRef)
            return {
                id: args.id,
                data:
                    {
                        category: categorySnap.data(),
                        ...itemSnap.data(),
                    } as ItemData,
            }
        },
    },
    Mutation: {
        createItem: async (
            _: any,
            args: { newItem: ItemData },
        ): Promise<Item | null> => {
            const response = await addDoc(itemsCollection, {
                ...args.newItem,
            })
            return {
                id: response.id,
                data: args.newItem,
            }
        },
        updateItem: async (
            _: any,
            args: { item: Item },
        ): Promise<boolean> => {
            const {id, data} = args.item
            const itemRef = doc(db, 'items', id)
            try {
                await updateDoc(itemRef, {...data})
                return true
            } catch (e) {
                console.log(e)
                return false
            }
        },
        deleteItem: async (
            _: any,
            args: { id: string },
        ): Promise<boolean> => {
            const itemRef = doc(db, 'items', args.id)
            try {
                await deleteDoc(itemRef)
                return true
            } catch (e) {
                console.log(e)
                return false
            }
        },
    },
}

export default itemResolver