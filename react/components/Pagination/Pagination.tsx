import React, { useState } from 'react'
import { Pagination as PaginationType } from '../../typings/global'

interface PaginationProps {
    pagination: PaginationType
    onPageChange: (page: number, pageSize: number) => void
}

const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US')
}

const MAX_VISIBLE_RECORDS = 9999

const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
    const [pageSize, setPageSize] = useState(pagination.pageSize)
    const { page, total } = pagination

    const totalPages = Math.ceil(total / pageSize)
    const maxAllowedPage = Math.floor(MAX_VISIBLE_RECORDS / pageSize)
    // const isPageDisabled = page > maxAllowedPage

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(e.target.value, 10)
        setPageSize(newPageSize)
        onPageChange(1, newPageSize)
    }

    const handlePreviousPage = () => {
        if (page > 1) {
            onPageChange(page - 1, pageSize)
        }
    }

    const handleNextPage = () => {
        if (page < totalPages && page < maxAllowedPage) {
            onPageChange(page + 1, pageSize)
        }
    }

    const handlePageClick = (pageNum: number) => {
        onPageChange(pageNum, pageSize)
    }

    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const maxPagesToShow = 5

        // Use maxAllowedPage instead of totalPages for pagination display
        const displayTotalPages = Math.min(totalPages, maxAllowedPage)

        if (displayTotalPages <= maxPagesToShow) {
            for (let i = 1; i <= displayTotalPages; i++) {
                pages.push(i)
            }
        } else {
            pages.push(1)
            if (page > 3) pages.push('...')

            const start = Math.max(2, page - 1)
            const end = Math.min(displayTotalPages - 1, page + 1)
            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            if (page < displayTotalPages - 2) pages.push('...')
            pages.push(displayTotalPages)
        }

        // Add indication of max allowed page if there are more pages beyond the limit
        if (totalPages > maxAllowedPage) {
            pages.push('...')
            pages.push(`MAX(${formatNumber(totalPages)})`)
        }

        return pages
    }

    return (
        <>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label htmlFor="pageSize" style={{ fontSize: '14px' }}>
                        Items per page:
                    </label>
                    <select
                        id="pageSize"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        style={{
                            padding: '6px',
                            fontSize: '14px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                        style={{
                            padding: '6px 12px',
                            fontSize: '14px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            cursor: page === 1 ? 'not-allowed' : 'pointer',
                            backgroundColor: page === 1 ? '#f0f0f0' : 'white',
                            opacity: page === 1 ? 0.5 : 1,
                        }}
                    >
                        Previous
                    </button>

                    {getPageNumbers().map((pageNum, index) => {
                        // Check if this is the MAX indicator
                        const isMaxIndicator = typeof pageNum === 'string' && pageNum.startsWith('MAX')

                        return pageNum === '...' ? (
                            <span key={`ellipsis-${index}`} style={{ padding: '6px', color: '#999' }}>
                                {pageNum}
                            </span>
                        ) : isMaxIndicator ? (
                            <button
                                key={`max-indicator-${index}`}
                                disabled={true}
                                title={`Maximum accessible page: ${formatNumber(maxAllowedPage)}`}
                                style={{
                                    padding: '6px 12px',
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    border: '2px solid #ff6b6b',
                                    borderRadius: '4px',
                                    cursor: 'not-allowed',
                                    backgroundColor: '#ffe0e0',
                                    color: '#c92a2a',
                                    opacity: 0.7,
                                }}
                            >
                                {pageNum}
                            </button>
                        ) : (
                            <button
                                key={pageNum}
                                onClick={() => handlePageClick(pageNum as number)}
                                disabled={(pageNum as number) > maxAllowedPage}
                                style={{
                                    padding: '6px 12px',
                                    fontSize: '14px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    cursor: (pageNum as number) > maxAllowedPage ? 'not-allowed' : 'pointer',
                                    backgroundColor: pageNum === page ? '#007bff' : (pageNum as number) > maxAllowedPage ? '#f0f0f0' : 'white',
                                    color: pageNum === page ? 'white' : (pageNum as number) > maxAllowedPage ? '#999' : 'black',
                                    fontWeight: pageNum === page ? 'bold' : 'normal',
                                    opacity: (pageNum as number) > maxAllowedPage ? 0.5 : 1,
                                }}
                            >
                                {formatNumber(pageNum as number)}
                            </button>
                        )
                    })}

                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages || page >= maxAllowedPage}
                        style={{
                            padding: '6px 12px',
                            fontSize: '14px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            cursor: page === totalPages || page >= maxAllowedPage ? 'not-allowed' : 'pointer',
                            backgroundColor: page === totalPages || page >= maxAllowedPage ? '#f0f0f0' : 'white',
                            opacity: page === totalPages || page >= maxAllowedPage ? 0.5 : 1,
                        }}
                    >
                        Next
                    </button>
                </div>

                <div style={{ fontSize: '14px', color: '#333', fontWeight: 'bold' }}>
                    Page {formatNumber(page)} of {formatNumber(Math.min(totalPages, maxAllowedPage))}
                    {totalPages > maxAllowedPage && (
                        <span style={{ color: '#929191ff', fontWeight: 'normal' }}>
                            {' (limited to '}
                            {formatNumber(maxAllowedPage)}
                            {' pages out of '}
                            {formatNumber(totalPages)}
                            {' pages)'}
                        </span>
                    )}
                    {' ('}
                    <span style={{ color: '#333', fontWeight: 'bold' }}>
                        {formatNumber(total)}
                        {' total items'}
                    </span>
                    {')'}
                </div>
            </div>

            {totalPages > maxAllowedPage && (
                <div style={{
                    marginTop: '20px',
                    padding: '12px',
                    backgroundColor: '#f0f7ff',
                    border: '1px solid #cce5ff',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#0056b3',
                    lineHeight: '1.5',
                    width: '100%'
                }}>
                    <strong>ℹ️ Pagination Limit Notice:</strong> Typically, Master Data's API limits pagination to a maximum of 10,000 records per query. If you need to find records beyond this point, use filtering strategies.
                </div>
            )}
        </>
    )

}

export default Pagination
