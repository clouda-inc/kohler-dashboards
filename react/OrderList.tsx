import React, { useState } from 'react'
import { useQuery } from 'react-apollo'

import GET_ORDERS from './queries/getOrders.graphql'
import { OrdersList, SearchOptions, SortOptions } from './typings/global'
import SearchBar from './components/SearchBar/SearchBar'
import OrdersTable from './components/OrdersTable/OrdersTable'
import Pagination from './components/Pagination/Pagination'

const BRANDS_TO_FILTER = ['Kohler', 'Moen', 'Delta', 'Grohe', 'Faucet']

interface QueryVariables {
  searchOptions: SearchOptions
  page: number
  pageSize: number
  sortBy: string
  sort: SortOptions
}

const OrderList: React.FC = () => {
  const [queryVariables, setQueryVariables] = useState<QueryVariables>({
    searchOptions: {
      searchQuery: '',
      brand: '',
      dateRange: {
        from: '',
        to: '',
      },
    },
    page: 1,
    pageSize: 10,
    sortBy: 'createdDate',
    sort: {
      field: 'createdDate',
      order: 'DESC',
    },
  })

  const { data, loading, error } = useQuery(GET_ORDERS, {
    variables: {
      searchOptions: queryVariables.searchOptions,
      page: queryVariables.page,
      pageSize: queryVariables.pageSize,
      sort: queryVariables.sort,
    },
    ssr: false,
  })

  const orders = (data?.getOrders as OrdersList)?.items || []
  const pagination = (data?.getOrders as OrdersList)?.pagination

  const handleSearch = (searchQuery: string, brand: string) => {
    setQueryVariables(prev => ({
      ...prev,
      searchOptions: {
        ...prev.searchOptions,
        searchQuery,
        brand,
      },
      page: 1,
    }))
  }

  const handleSort = (field: string, order: string) => {
    setQueryVariables(prev => ({
      ...prev,
      sort: {
        field,
        order,
      },
    }))
  }

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryVariables(prev => ({
      ...prev,
      page,
      pageSize,
    }))
  }

  if (error) return <p>Error: {error.message}</p>

  return (
    <div style={{ padding: '20px' }}>
      <h1>Order List</h1>

      <SearchBar brands={BRANDS_TO_FILTER} onSearch={handleSearch} />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <OrdersTable
            orders={orders}
            sortBy={queryVariables.sort.field}
            sortOrder={queryVariables.sort.order}
            onSort={handleSort}
          />

          {pagination && (
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  )
}

export default OrderList
