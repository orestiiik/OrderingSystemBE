import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore'
import {db} from '../../../db/firebase'
import {ItemType, LastSale, Sale, SaleData} from '../types/sales'
import {endOfDay, startOfDay} from 'date-fns'

const salesCollection = collection(db, 'sales')

const calculateOrderPrice = (order: ItemType[]): number => {
    let totalPrice = 0
    order?.forEach((item) => {
        item.items?.forEach(x =>
            totalPrice += x.price * x.quantity,
        )
    })
    return totalPrice
}

const saleResolver: { Query: any; Mutation: any } = {
    Query: {
        getSales: async (
            _: any,
            args: { active: boolean },
        ): Promise<Sale[]> => {
            const docsSnap = await getDocs(query(
                salesCollection,
                where('done', '==', !args.active),
            ))
            const sales = docsSnap.docs.map((doc) => ({
                id: doc.id,
                data: doc.data() as SaleData,
            }))

            return sales.reverse() as Sale[]
        },
        getSaleById: async (
            _: any,
            args: { id: string },
        ): Promise<Sale | null> => {
            const docRef = doc(db, 'sales', args.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                return {
                    id: args.id,
                    data: docSnap.data() as SaleData,
                }
            }

            return null
        },
        getLastSales: async (): Promise<LastSale[]> => {
            const today = new Date()
            today.setHours(0, 0, 0, 0) // Set the time to the start of the day

            const lastFiveDays = Array.from({length: 5}, (_, index) => {
                return new Date(today.getTime() - index * 24 * 60 * 60 * 1000)
            })

            const lastFiveDaysSales: LastSale[] = []

            for (const date of lastFiveDays) {
                const startOfDate = startOfDay(date)
                const endOfDate = endOfDay(date)

                const salesQuery = query(
                    salesCollection,
                    where('timestamp', '>=', startOfDate),
                    where('timestamp', '<=', endOfDate),
                    orderBy('timestamp'),
                )

                const salesSnapshot = await getDocs(salesQuery)

                let totalPrice = 0
                salesSnapshot?.docs?.forEach((doc: any) => {
                    const saleData = doc.data() as SaleData
                    totalPrice += calculateOrderPrice(saleData.order)
                })

                lastFiveDaysSales.push({
                    date: date.toISOString().slice(0, 10),
                    totalPrice,
                })
            }
            return lastFiveDaysSales.reverse()
        },
        getTodaySalesTotal: async (): Promise<number> => {
            const startOfToday = startOfDay(new Date())
            const endOfToday = endOfDay(new Date())
            const querySnapshot = await getDocs(
                query(
                    salesCollection,
                    where('timestamp', '>=', startOfToday),
                    where('timestamp', '<=', endOfToday),
                ),
            )

            return querySnapshot.docs.length
        },
        getTodayPriceTotal: async (): Promise<number> => {
            const startOfToday = startOfDay(new Date())
            const endOfToday = endOfDay(new Date())

            const salesQuery = query(
                salesCollection,
                where('timestamp', '>=', startOfToday),
                where('timestamp', '<', endOfToday),
            )
            const salesSnapshot = await getDocs(salesQuery)

            let total = 0

            salesSnapshot.docs.forEach((doc: any) => {
                const saleData = doc.data() as SaleData
                total += calculateOrderPrice(saleData.order)
            })

            return total
        },
        getTotalSoldQuantity: async (): Promise<number> => {
            const startOfToday = startOfDay(new Date())
            const endOfToday = endOfDay(new Date())

            const salesQuery = query(
                salesCollection,
                where('timestamp', '>=', startOfToday),
                where('timestamp', '<', endOfToday),
            )
            const salesSnapshot = await getDocs(salesQuery)

            let totalQuantity = 0

            salesSnapshot.docs.forEach((doc: any) => {
                const saleData = doc.data() as SaleData
                saleData.order?.forEach((item: ItemType) => {
                    console.log(item)
                    item.items?.forEach(x =>
                        totalQuantity += x.quantity,
                    )
                })
            })

            return totalQuantity
        },
    },
    Mutation: {
        createSale: async (
            _: any,
            args: { newSale: SaleData },
        ): Promise<Sale | null> => {
            const timestamp = serverTimestamp()
            const totalPrice = calculateOrderPrice(args.newSale.order)

            const response = await addDoc(salesCollection, {
                timestamp,
                price: totalPrice ?? 0,
                ...args.newSale,
            })
            return {
                id: response.id,
                data: {
                    price: totalPrice,
                    ...args.newSale,
                },
            }
        },
        deleteSale: async (
            _: any,
            args: { id: string },
        ): Promise<boolean> => {
            const docRef = doc(db, 'sales', args.id)

            try {
                await deleteDoc(docRef)
                return true
            } catch (error) {
                console.log(error)
                return false
            }
        },
        updateSaleStatus: async (_: any, args: { id: string }): Promise<boolean> => {
            const saleRef = doc(db, 'sales', args.id)

            try {
                await updateDoc(saleRef, {done: true})

                return true
            } catch (error) {
                console.log(error)
            }

            return false
        },
    },
}

export default saleResolver
