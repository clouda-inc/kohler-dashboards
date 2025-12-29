interface AppSettings {
  vtexAppKey: string
  vtexAppToken: string
}

interface FilterDates {
  from: string
  to: string
}

interface SearchOptions {
  dateRange: FilterDates
  searchQuery: String
  userId: String
  soldToId: String
  brand: String
}

interface InputOrder {
  sapOrderNumber: string
  shipToAddress: string
  poNumber: string
  skuNumber: string
  brand: string
  createdDate: string
}
