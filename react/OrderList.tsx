import React, { useState } from 'react'
import { useQuery } from 'react-apollo'

import GET_ORDERS from './queries/getOrders.graphql'
import { OrdersList, SearchOptions, SortOptions } from './typings/global'
import SearchBar from './components/SearchBar/SearchBar'
import OrdersTable from './components/OrdersTable/OrdersTable'
import Pagination from './components/Pagination/Pagination'

const BRANDS_TO_FILTER = ['Kohler', 'Moen', 'Delta', 'American Standard', 'Grohe', 'Pfister', 'Hansgrohe', 'Toto', 'Brizo', 'Rohl']
const USER_IDS_TO_FILTER = [
  "USR-00102", "USR-00559", "USR-01165", "USR-01750", "USR-02150",
  "USR-02894", "USR-02916", "USR-03379", "USR-03406", "USR-03668",
  "USR-03822", "USR-04160", "USR-04248", "USR-04440", "USR-04719",
  "USR-05494", "USR-06057", "USR-06304", "USR-06360", "USR-06844",
  "USR-07008", "USR-07022", "USR-07423", "USR-07528", "USR-07962",
  "USR-08291", "USR-08362", "USR-09017", "USR-09679", "USR-09873"
]
const SOLD_TO_IDS_TO_FILTER = [
  "SOLD-TO-00001", "SOLD-TO-00101", "SOLD-TO-00200", "SOLD-TO-00201", "SOLD-TO-00301",
  "SOLD-TO-00400", "SOLD-TO-00401", "SOLD-TO-00501", "SOLD-TO-00600", "SOLD-TO-00601",
  "SOLD-TO-00701", "SOLD-TO-00800", "SOLD-TO-00801", "SOLD-TO-00901", "SOLD-TO-01000",
  "SOLD-TO-01001", "SOLD-TO-01101", "SOLD-TO-01200", "SOLD-TO-01201", "SOLD-TO-01301",
  "SOLD-TO-01400", "SOLD-TO-01401", "SOLD-TO-01501", "SOLD-TO-01600", "SOLD-TO-01601",
  "SOLD-TO-01701", "SOLD-TO-01800", "SOLD-TO-01801", "SOLD-TO-01901", "SOLD-TO-02000"
]

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
      userId: '',
      soldToId: '',
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

  const handleSearch = (
    searchQuery: string,
    brand: string,
    userId: string,
    soldToId: string
  ) => {
    setQueryVariables((prev) => ({
      ...prev,
      searchOptions: {
        ...prev.searchOptions,
        searchQuery,
        brand,
        userId,
        soldToId,
      },
      page: 1,
    }))
  }

  const handleSort = (field: string, order: string) => {
    setQueryVariables((prev) => ({
      ...prev,
      sort: {
        field,
        order,
      },
    }))
  }

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryVariables((prev) => ({
      ...prev,
      page,
      pageSize,
    }))
  }

  if (error) return <p>Error: {error.message}</p>

  return (
    <div style={{ padding: '20px' }}>
      <h1>Order List</h1>

      <SearchBar
        brands={BRANDS_TO_FILTER}
        userIds={USER_IDS_TO_FILTER}
        soldToIds={SOLD_TO_IDS_TO_FILTER}
        onSearch={handleSearch}
      />

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
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  )
}

export default OrderList
