export interface Order {
  id: string
  sapOrderNumber: string
  shipToAddress: string
  createdDate: string
  poNumber: string
  skuNumber: string
  brand: string
}

export interface Pagination {
  pageSize: number
  page: number
  total: number
}

export interface OrdersList {
  items: Order[]
  pagination: Pagination
}

export interface FilterDates {
  from: string
  to: string
}

export interface SearchOptions {
  dateRange: FilterDates
  searchQuery: string
  brand: string
}

export interface SortOptions {
  field: string
  order: string
}

export interface OrderDataInput {
  id: string
  sapOrderNumber: string
  shipToAddress: string
  createdDate: string
  poNumber: string
  skuNumber: string
  brand: string
}
