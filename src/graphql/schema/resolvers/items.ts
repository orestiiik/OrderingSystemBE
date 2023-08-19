import { Db, ObjectId } from 'mongodb';
import { Ingredient } from '../types/ingredients';
import {Item, ItemData, NewItem, NewItemData} from '../types/items'

const itemResolver: { Query: any; Mutation: any } = {
    Query: {
        getItems: async (_: any, __: any, { db }: { db: Db }): Promise<Item[]> => {
            const itemsCollection = db.collection('items');
            const items = await itemsCollection.find().toArray();

            const populatedItems = await Promise.all(items.map(async (item) => ({
                id: item._id.toString(),
                data: {
                    category: {
                        id: item.category.toString(),
                        data: await getCategoryData(db, item.category),
                    },
                    name: item.name,
                    price: item.price,
                    weight: item.weight,
                    state: item.state,
                    liquid: item.liquid,
                    ingredients: await getIngredientsForItem(db, item._id.toString()),  // Populate ingredients
                },
            })));

            return populatedItems;
        },

        getItemById: async (
            _: any,
            args: { id: string },
            { db }: { db: Db }
        ): Promise<{
            data: {
                liquid: any;
                price: any;
                name: any;
                weight: any;
                ingredients: Ingredient[];
                state: any;
                category: { data: { name: any; active: any }; id: string }
            };
            id: string
        }> => {
            const item = await db.collection('items').findOne({ _id: new ObjectId(args.id) });

            if (!item) {
                return null;
            }

            const ingredients = await getIngredientsForItem(db, args.id);  // Get ingredients

            return {
                id: item._id.toString(),
                data: {
                    name: item.name,
                    category: {
                        id: item.category.toString(),
                        data: await getCategoryData(db, item.category),
                    },
                    price: item.price,
                    weight: item.weight,
                    liquid: item.liquid,
                    state: item.state,
                    ingredients,
                },
            };
        },
    },
    Mutation: {
        createItem: async (
            _: any,
            args: { newItem: NewItemData },
            { db }: { db: Db }
        ): Promise<boolean> => {
            const itemsCollection = db.collection('items');
            const result = await itemsCollection.insertOne(args.newItem);

            return !!result.insertedId;
        },
        updateItem: async (
            _: any,
            args: { item: NewItem },
            { db }: { db: Db }
        ): Promise<boolean> => {
            const { id, data } = args.item;
            const result = await db.collection('items').updateOne(
                { _id: new ObjectId(id) },
                { $set: {...extractItemData(data)} }
            );

            return result.modifiedCount > 0;
        },
        deleteItem: async (
            _: any,
            args: { id: string },
            { db }: { db: Db }
        ): Promise<boolean> => {
            const result = await db.collection('items').deleteOne({ _id: new ObjectId(args.id) });

            return result.deletedCount > 0;
        },
    },
};

async function getCategoryData(db: Db, categoryId: ObjectId) {
    const category = await db.collection('categories').findOne({ _id: categoryId });

    if (!category) {
        return null;
    }

    return {
        name: category.name,
        active: category.active,
    };
}

// Helper function to extract item data
const extractItemData = (data: NewItemData) => {
    const { name, category, price, weight, liquid, state, ingredients } = data;

    return {
        name,
        category: new ObjectId(category), // Convert to ObjectId
        price,
        weight,
        liquid,
        state,
        ingredients
    };
}

async function getIngredientsForItem(db: Db, itemId: string): Promise<Ingredient[]> {
    const item = await db.collection('items').findOne({ _id: new ObjectId(itemId) });
    if (!item || !item.ingredients) {
        return [];
    }

    const ingredientsCollection = db.collection('ingredients');
    const ingredientIds = item.ingredients.map(id => new ObjectId(id));
    const ingredients = await ingredientsCollection.find({ _id: { $in: ingredientIds } }).toArray();

    return ingredients.map(ingredient => ({
        id: ingredient._id.toString(),
        name: ingredient.name,
        canBeExtra: ingredient.canBeExtra,
        extraPrice: ingredient.extraPrice,
    }));
}
export default itemResolver;
