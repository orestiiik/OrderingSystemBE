import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc} from 'firebase/firestore'
import {db} from '../../../db/firebase'
import {Category, CategoryData} from '../types/categories'

require('dotenv').config()

const categoryResolver: { Query: any, Mutation: any } = {
    Query: {
        getCategories: async (): Promise<Category[]> => {
            const colRef = collection(db, 'categories')
            const docsSnap = await getDocs(colRef)
            const categories = docsSnap.docs.map(item => ({
                id: item.id,
                data: item.data(),
            }))
            return categories as Category[] ?? [{id: 'nothing found'}] as Category[]
        },
        getCategoryById: async (
            _: any,
            args: { id: string },
        ): Promise<Category | null> => {
            const docRef = doc(db, 'categories', args.id)
            const docsSnap = await getDoc(docRef)

            return {
                id: args.id,
                data: docsSnap.data() as CategoryData,
            }
        },
    },
    Mutation: {
        createCategory: async (
            _: any,
            args: { newCategory: CategoryData },
        ): Promise<Category | null> => {
            const {name, active} = args.newCategory
            const response = await addDoc(collection(db, 'categories'), {
                name,
                active,
            })
            return {
                id: response.id,
                data: args.newCategory,
            }
        },
        updateCategory: async (
            _: any,
            args: { category: Category },
        ): Promise<boolean> => {
            const {id, data: {name, active}} = args.category
            const docRef = doc(db, 'categories', id)
            try {
                await updateDoc(docRef, {name, active})
                return true
            } catch (e) {
                console.log(e)
                return false
            }
        },
        deleteCategory: async (
            _: any,
            args: { id: string },
        ): Promise<boolean> => {
            const docRef = doc(db, 'categories', args.id)
            try {
                await deleteDoc(docRef)
                return true
            } catch (e) {
                console.log(e)
                return false
            }
        },
    },


}

export default categoryResolver