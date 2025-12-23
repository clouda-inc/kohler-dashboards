import { KOHLER_ORDERS_DATA_ENTITY, KOHLER_ORDERS_FIELDS, KOHLER_ORDERS_SCHEMA } from "../../const/md"

export const queries = {
    getOrders: async (
        _: any,
        args: {
            searchOptions: SearchOptions
            page: number
            pageSize: number
            sortBy: string
        },
        ctx: Context
    ): Promise<any> => {
        const { searchOptions, page = 1, pageSize = 10, sortBy } = args

        console.log('Fetching orders with options:', searchOptions, page, pageSize, sortBy)

        const { clients: { masterdata } } = ctx

        const { dateRange, searchQuery, brand } = searchOptions

        console.log('Parsed search options:', { dateRange, searchQuery, brand })

        const whereClause = ''

        const ordersSearched = await masterdata.searchDocumentsWithPaginationInfo({
            dataEntity: KOHLER_ORDERS_DATA_ENTITY,
            fields: KOHLER_ORDERS_FIELDS,
            pagination: {
                page,
                pageSize,
            },
            ...(whereClause ? { where: `(${whereClause})` } : {}),
        })

        console.log('Orders search completed:', ordersSearched)
        // const { clients: { masterdatas } } = ctx

        return {
            items: ordersSearched?.data,
            pagination: ordersSearched?.pagination,
        };
    },
}

export const mutations = {
    createOrderIfNotExists: async (
        _: any,
        args: { orderData: InputOrder },
        ctx: Context
    ): Promise<any> => {
        const { orderData } = args
        // const { clients: { masterdatas } } = ctx
        console.log('Creating order if not exists with data:', orderData)

        const { clients: { masterdata } } = ctx

        if (!orderData.sapOrderNumber) {
            throw new Error('sapOrderNumber is required to create an order')
        }

        const existingOrders = await masterdata.searchDocuments({
            dataEntity: KOHLER_ORDERS_DATA_ENTITY,
            schema: KOHLER_ORDERS_SCHEMA,
            fields: KOHLER_ORDERS_FIELDS,
            where: `sapOrderNumber=${encodeURIComponent(orderData.sapOrderNumber)}`,
            pagination: { page: 1, pageSize: 10 },
        })

        console.log('Order search completed:', existingOrders)

        if (existingOrders.length > 0) {
            const existingOrder = existingOrders[0] as any
            const newOrder = { ...existingOrder, ...orderData }
            console.log('Order already exists:', newOrder)

            await masterdata.updatePartialDocument({
                dataEntity: KOHLER_ORDERS_DATA_ENTITY,
                schema: KOHLER_ORDERS_SCHEMA,
                id: existingOrder?.id,
                fields: orderData,
            })

            return newOrder
        }

        console.log('No existing order found, creating new order.')

        const newOrder = await masterdata.createDocument({
            dataEntity: KOHLER_ORDERS_DATA_ENTITY,
            schema: KOHLER_ORDERS_SCHEMA,
            fields: orderData,
        })

        console.log('New order created:', newOrder)

        return {
            id: newOrder.DocumentId,
            ...orderData,
        }
    },

    createTestData: async (
        _: any,
        args: { recordsCount: number },
        ctx: Context
    ): Promise<boolean> => {
        const { clients: { masterdata } } = ctx
        const { recordsCount } = args

        console.log('Creating test order data with records count:', recordsCount)

        const brands = ['Kohler', 'Moen', 'Delta', 'Grohe', 'Faucet']
        const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego']
        const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA']

        for (let i = 0; i < recordsCount; i++) {
            const sapOrderNumber = `SAP-${Date.now()}-${i}`
            const poNumber = `PO-${Math.floor(Math.random() * 1000000)}`
            const skuCount = Math.floor(Math.random() * 5) + 1
            const skuList = Array.from({ length: skuCount }, () => `SKU-Tap-${Math.floor(Math.random() * 9999999)}`)
            const skuNumber = skuList.join('|')
            const brandIndex = Math.floor(Math.random() * brands.length)
            const cityIndex = Math.floor(Math.random() * cities.length)
            const zipCode = Math.floor(10000 + Math.random() * 90000)

            const testOrder: InputOrder = {
                sapOrderNumber,
                shipToAddress: `${Math.floor(Math.random() * 9999)} Main St, ${cities[cityIndex]}, ${states[cityIndex]} ${zipCode}`,
                poNumber,
                skuNumber,
                brand: brands[brandIndex],
                createdDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            }

            await masterdata.createDocument({
                dataEntity: KOHLER_ORDERS_DATA_ENTITY,
                schema: KOHLER_ORDERS_SCHEMA,
                fields: testOrder,
            })

            console.log(`Created test order ${i + 1}/${recordsCount}:`, testOrder)
        }

        return true
    }
}