import {Db, ObjectId} from 'mongodb'
import {LastSale, Sale, SaleData} from '../types/sales'

const saleResolver: { Query: any; Mutation: any } = {
    Query: {
        getSales: async (
            _: any,
            args: { active: boolean },
            {db}: { db: Db },
        ): Promise<Sale[]> => {
            const salesCollection = db.collection('sales')
            const salesQuery = {done: !args.active}
            const sales = await salesCollection.find(salesQuery).toArray()

            return sales.map((doc: any) => ({
                id: doc._id.toString(),
                data: doc as SaleData,
            }))
        },
        getSaleById: async (
            _: any,
            args: { id: string },
            {db}: { db: Db },
        ): Promise<Sale | null> => {
            const salesCollection = db.collection('sales')
            const sale = await salesCollection.findOne({_id: new ObjectId(args.id)})

            if (!sale) {
                return null
            }

            return {
                id: sale._id.toString(),
                data: sale as unknown as SaleData,
            }
        },
        getLastSales: async (
            _: any,
            __: any,
            {db}: { db: Db },
        ): Promise<LastSale[]> => {
            const salesCollection = db.collection('sales')
            const lastFiveDays = Array.from({length: 5}, (_, index) => {
                const date = new Date()
                date.setDate(date.getDate() - index)
                return date
            })

            const lastFiveDaysSales: LastSale[] = []

            for (const date of lastFiveDays) {
                const startOfDay = new Date(date.setHours(0, 0, 0, 0))
                const endOfDay = new Date(date.setHours(23, 59, 59, 999))

                const salesQuery = {
                    timestamp: {$gte: startOfDay, $lte: endOfDay},
                }

                const sales = await salesCollection.find(salesQuery).toArray()
                const totalPrice = sales.reduce((total, sale) => {
                    const orderTotal = sale.order.reduce(
                        (orderTotal, item) => {
                            return (
                                orderTotal +
                                item.items.reduce(
                                    (itemTotal, x) =>
                                        itemTotal + x.price * x.quantity,
                                    0,
                                )
                            )
                        },
                        0,
                    )
                    return total + orderTotal
                }, 0)

                lastFiveDaysSales.push({
                    date: date.toISOString().slice(0, 10),
                    totalPrice: parseFloat(
                        (Math.round(totalPrice * 100) / 100).toFixed(2),
                    ),
                })
            }

            return lastFiveDaysSales.reverse()
        },
        getTodaySalesTotal: async (
            _: any,
            __: any,
            {db}: { db: Db },
        ): Promise<number> => {
            const salesCollection = db.collection('sales')
            const startOfDay = new Date()
            startOfDay.setHours(0, 0, 0, 0)
            const endOfDay = new Date()
            endOfDay.setHours(23, 59, 59, 999)

            const salesQuery = {
                timestamp: {$gte: startOfDay, $lte: endOfDay},
            }

            const sales = await salesCollection.find(salesQuery).toArray()

            return sales.length
        },
        getTodayPriceTotal: async (
            _: any,
            __: any,
            {db}: { db: Db },
        ): Promise<number> => {
            const salesCollection = db.collection('sales')
            const startOfDay = new Date()
            startOfDay.setHours(0, 0, 0, 0)
            const endOfDay = new Date()
            endOfDay.setHours(23, 59, 59, 999)

            const salesQuery = {
                timestamp: {$gte: startOfDay, $lt: endOfDay},
            }

            const sales = await salesCollection.find(salesQuery).toArray()
            const totalPrice = sales.reduce((total, sale) => {
                const orderTotal = sale.order.reduce(
                    (orderTotal, item) => {
                        return (
                            orderTotal +
                            item.items.reduce(
                                (itemTotal, x) =>
                                    itemTotal + x.price * x.quantity,
                                0,
                            )
                        )
                    },
                    0,
                )
                return total + orderTotal
            }, 0)

            return parseFloat((Math.round(totalPrice * 100) / 100).toFixed(2))
        },
        getTotalSoldQuantity: async (
            _: any,
            __: any,
            {db}: { db: Db },
        ): Promise<number> => {
            const salesCollection = db.collection('sales')
            const startOfDay = new Date()
            startOfDay.setHours(0, 0, 0, 0)
            const endOfDay = new Date()
            endOfDay.setHours(23, 59, 59, 999)

            const salesQuery = {
                timestamp: {$gte: startOfDay, $lt: endOfDay},
            }

            const sales = await salesCollection.find(salesQuery).toArray()
            const totalQuantity = sales.reduce((total, sale) => {
                const orderQuantity = sale.order.reduce(
                    (orderQuantity, item) => {
                        return (
                            orderQuantity +
                            item.items.reduce(
                                (itemQuantity, x) =>
                                    itemQuantity + x.quantity,
                                0,
                            )
                        )
                    },
                    0,
                )
                return total + orderQuantity
            }, 0)

            return totalQuantity
        },
    },
    Mutation: {
        createSale: async (
            _: any,
            args: { newSale: SaleData },
            {db}: { db: Db },
        ): Promise<boolean> => {
            const salesCollection = db.collection('sales')
            const timestamp = new Date()

            const totalPrice = args.newSale.order.reduce(
                (total, item) =>
                    total +
                    item.items.reduce((itemTotal, x) => itemTotal + x.price * x.quantity, 0),
                0,
            )

            const saleDoc = {
                timestamp,
                price: parseFloat((Math.round(totalPrice * 100) / 100).toFixed(2)),
                ...args.newSale,
            }

            const result = await salesCollection.insertOne(saleDoc)
            const insertedSale = result.insertedId

            return !!insertedSale
        },
        deleteSale: async (
            _: any,
            args: { id: string },
            {db}: { db: Db },
        ): Promise<boolean> => {
            const salesCollection = db.collection('sales')
            const result = await salesCollection.deleteOne({_id: new ObjectId(args.id)})

            return result.deletedCount > 0
        },
        updateSaleStatus: async (
            _: any,
            args: { id: string },
            {db}: { db: Db },
        ): Promise<boolean> => {
            const salesCollection = db.collection('sales')
            const result = await salesCollection.updateOne(
                {_id: new ObjectId(args.id)},
                {$set: {done: true}},
            )

            return result.modifiedCount > 0
        },
    },
}

export default saleResolver
