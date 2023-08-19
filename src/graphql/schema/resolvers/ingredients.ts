import {Ingredient, NewIngredient} from '../types/ingredients'
import {Db, ObjectId} from 'mongodb'

const ingredientResolver = {
    Query: {
        getIngredients: async (_: any, __: any, {db}: { db: Db }): Promise<Ingredient[]> => {
            const itemsCollection = db.collection('ingredients')
            const items = await itemsCollection.find().toArray()

            return items.map(item => {
                return {
                    id: item._id.toString(),
                    name: item.name,
                    canBeExtra: item.canBeExtra,
                    extraPrice: item.extraPrice,

                }
            })
        },
        getIngredientById: async (
            _: any,
            args: { id: string },
            {db}: { db: Db },
        ): Promise<Ingredient | null> => {
            const ingredient = await db.collection('ingredients').findOne({_id: new ObjectId(args.id)})

            if (!ingredient) {
                return null
            }

            return {
                id: ingredient._id.toString(),
                name: ingredient.name,
                canBeExtra: ingredient.canBeExtra,
                extraPrice: ingredient.extraPrice,
            }
        },
    },
    Mutation: {
        createIngredient: async (
            _: any,
            args: { ingredient: NewIngredient },
            {db}: { db: Db },
        ): Promise<boolean> => {
            const ingredientsCollection = db.collection('ingredients')
            const result = await ingredientsCollection.insertOne(args.ingredient)

            return !!result.insertedId
        },
        updateIngredient: async (
            _: any,
            args: { ingredient: Ingredient },
            {db}: { db: Db },
        ): Promise<boolean> => {
            const {id, ...data} = args.ingredient
            const result = await db.collection('ingredients').updateOne(
                {_id: new ObjectId(id)},
                {$set: data},
            )

            return result.modifiedCount > 0
        },
        deleteIngredient: async (
            _: any,
            args: { id: string },
            {db}: { db: Db },
        ): Promise<boolean> => {
            const result = await db.collection('ingredients').deleteOne({_id: new ObjectId(args.id)})

            return result.deletedCount > 0
        },
    },
}

export default ingredientResolver