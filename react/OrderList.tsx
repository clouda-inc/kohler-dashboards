import React from 'react'
import { useQuery } from 'react-apollo'

import GET_ORDERS from '../graphql/getOrders.graphql'
import { OrdersList } from './typings/global'

const BRANDS_TO_FILTER = ['Kohler', 'Moen', 'Delta', 'Grohe', 'Faucet']

const OrderList: React.FC = () => {
  const { data, loading, error } = useQuery(GET_ORDERS, {
    variables: {
      searchOptions: {
        searchQuery: '',
        brand: '',
      },
      page: 1,
      pageSize: 10,
      sort: {
        field: 'createdDate',
        order: 'DESC',
      },
    },
  })

  const orders = (data?.getOrders as OrdersList)?.items || []
  const pagination = (data?.getOrders as OrdersList)?.pagination

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <h1>Order List</h1>
      {/* Order list implementation goes here */}
    </div>
  )
}

export default OrderList
