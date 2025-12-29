import React from 'react'

import { Order } from '../../typings/global'

interface OrdersTableProps {
  orders: Order[]
  sortBy: string
  sortOrder: string
  onSort: (field: string, order: string) => void
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const columns = [
    { key: 'userId', label: 'User Id' },
    { key: 'soldToId', label: 'Sold To Id' },
    { key: 'sapOrderNumber', label: 'SAP Order Number' },
    { key: 'poNumber', label: 'PO Number' },
    { key: 'skuNumber', label: 'SKU Number' },
    { key: 'brand', label: 'Brand' },
    { key: 'shipToAddress', label: 'Ship To Address' },
    { key: 'createdDate', label: 'Created Date' },
  ]

  const handleSort = (field: string) => {
    const newOrder = sortBy === field && sortOrder === 'ASC' ? 'DESC' : 'ASC'

    onSort(field, newOrder)
  }

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return ' ⇅'

    return sortOrder === 'ASC' ? ' ↑' : ' ↓'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)

    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

  return (
    <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #ddd',
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: '#f5f5f5',
              borderBottom: '2px solid #ddd',
            }}
          >
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column.key)}
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  userSelect: 'none',
                  backgroundColor:
                    sortBy === column.key ? '#e8e8e8' : 'transparent',
                }}
              >
                {column.label}
                {renderSortIcon(column.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: '12px', textAlign: 'center', color: '#999' }}
              >
                No orders found
              </td>
            </tr>
          ) : (
            orders.map((order, index) => (
              <tr
                key={order.id}
                style={{
                  borderBottom: '1px solid #ddd',
                  backgroundColor: index % 2 === 0 ? '#fafafa' : 'white',
                }}
              >
                <td style={{ padding: '12px' }}>{order.userId}</td>
                <td style={{ padding: '12px' }}>{order.soldToId}</td>
                <td style={{ padding: '12px' }}>{order.sapOrderNumber}</td>
                <td style={{ padding: '12px' }}>{order.poNumber}</td>
                <td style={{ padding: '12px' }}>{order.skuNumber}</td>
                <td style={{ padding: '12px' }}>{order.brand}</td>
                <td style={{ padding: '12px' }}>{order.shipToAddress}</td>
                <td style={{ padding: '12px' }}>
                  {formatDate(order.createdDate)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default OrdersTable
