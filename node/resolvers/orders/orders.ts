import { KOHLER_ORDERS_DATA_ENTITY, KOHLER_ORDERS_FIELDS, KOHLER_ORDERS_SCHEMA } from "../../const/md"

export const queries = {
  getOrders: async (
    _: any,
    args: {
      searchOptions: SearchOptions
      page: number
      pageSize: number
      sort?: {
        field: string
        order: string
      }
    },
    ctx: Context
  ): Promise<any> => {
    const {
      searchOptions:
      {
        searchQuery,
        brand
      },
      page = 1,
      pageSize = 10,
      sort: { field, order } = {}
    } = args

    const { clients: { masterdata } } = ctx

    const whereClauses = []

    if (searchQuery) {
      const searchConditions = ["sapOrderNumber", "poNumber", "skuNumber", "brand"].map(
        field => `${field}=*${encodeURIComponent(searchQuery.toString())}*`
      ).join(' OR ')
      whereClauses.push(`(${searchConditions})`)
    }

    if (brand) {
      whereClauses.push(`brand=${encodeURIComponent(brand.toString())}`)
    }

    const whereClause = whereClauses.join(' AND ')

    const sortBy = (field && order) ? `${field} ${order}` : undefined;

    const ordersSearched = await masterdata.searchDocumentsWithPaginationInfo({
      dataEntity: KOHLER_ORDERS_DATA_ENTITY,
      schema: KOHLER_ORDERS_SCHEMA,
      fields: KOHLER_ORDERS_FIELDS,
      pagination: {
        page,
        pageSize,
      },
      ...(whereClause ? { where: `(${whereClause})` } : {}),
      ...(sortBy ? { sort: sortBy } : {}),
    })

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

    // Create a pool of SKU numbers to be shared across orders
    const skuPool = Array.from({ length: Math.ceil(recordsCount * 1.5) }, () => `SKU-${Math.floor(Math.random() * 9999999)}`)

    for (let i = 0; i < recordsCount; i++) {
      const sapOrderNumber = `SAP-${Date.now()}-${i}`
      const poNumber = `PO-${Math.floor(Math.random() * 1000000)}`
      const skuCount = Math.floor(Math.random() * 15) + 1

      // Select random unique SKUs from the pool for this order
      const selectedSkus = new Set<string>()
      while (selectedSkus.size < Math.min(skuCount, skuPool.length)) {
        const randomIndex = Math.floor(Math.random() * skuPool.length)
        selectedSkus.add(skuPool[randomIndex])
      }

      const skuNumber = Array.from(selectedSkus).join('|')
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