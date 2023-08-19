import {Db, ObjectId} from 'mongodb'
import {Category, CategoryData} from '../types/categories'

const categoryResolver: { Query: any, Mutation: any } = {
    Query: {
        getCategories: async (_: any, __: any, {db}: { db: Db }): Promise<Category[]> => {
            const categoriesCollection = db.collection('categories')
            const categories = await categoriesCollection.find().toArray()

            return categories.map(category => ({
                id: category._id.toString(),
                data: {
                    name: category.name,
                    active: category.active,
                },
            }))
        },
        getCategoryById: async (
            _: any,
            args: { id: string },
            {db}: { db: Db },
        ): Promise<Category | null> => {
            const category = await db.collection('categories').findOne({_id: new ObjectId(args.id)})

            if (!category) {
                return null
            }

            return {
                id: category._id.toString(),
                data: {
                    name: category.name,
                    active: category.active,
                },
            }
        },
    },
    Mutation: {
        createCategory: async (
            _: any,
            args: { newCategory: CategoryData },
            {db}: { db: Db },
        ): Promise<Category | null> => {
            const response = await db.collection('categories').insertOne(args.newCategory)
            const insertedCategory = response.insertedId

            return {
                id: insertedCategory.toString(),
                data: args.newCategory,
            }
        },
        updateCategory: async (
            _: any,
            args: { category: Category },
            {db}: { db: Db },
        ): Promise<boolean> => {
            const {id, data} = args.category
            const result = await db.collection('categories').updateOne(
                {_id: new ObjectId(id)},
                {$set: {name: data.name, active: data.active}},
            )

            return result.modifiedCount > 0
        },
        deleteCategory: async (
            _: any,
            args: { id: string },
            {db}: { db: Db },
        ): Promise<boolean> => {
            const result = await db.collection('categories').deleteOne({_id: new ObjectId(args.id)})

            return result.deletedCount > 0
        },
    },
}

export default categoryResolver
