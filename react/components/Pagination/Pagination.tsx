import React, { useState } from 'react'
import { Pagination as PaginationType } from '../../typings/global'

interface PaginationProps {
    pagination: PaginationType
    onPageChange: (page: number, pageSize: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
    const [pageSize, setPageSize] = useState(pagination.pageSize)
    const { page, total } = pagination

    const totalPages = Math.ceil(total / pageSize)

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
        if (page < totalPages) {
            onPageChange(page + 1, pageSize)
        }
    }

    const handlePageClick = (pageNum: number) => {
        onPageChange(pageNum, pageSize)
    }

    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const maxPagesToShow = 5

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            pages.push(1)
            if (page > 3) pages.push('...')

            const start = Math.max(2, page - 1)
            const end = Math.min(totalPages - 1, page + 1)
            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            if (page < totalPages - 2) pages.push('...')
            pages.push(totalPages)
        }

        return pages
    }

    return (
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

                {getPageNumbers().map((pageNum, index) =>
                    pageNum === '...' ? (
                        <span key={`ellipsis-${index}`} style={{ padding: '6px', color: '#999' }}>
                            {pageNum}
                        </span>
                    ) : (
                        <button
                            key={pageNum}
                            onClick={() => handlePageClick(pageNum as number)}
                            style={{
                                padding: '6px 12px',
                                fontSize: '14px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                backgroundColor: pageNum === page ? '#007bff' : 'white',
                                color: pageNum === page ? 'white' : 'black',
                                fontWeight: pageNum === page ? 'bold' : 'normal',
                            }}
                        >
                            {pageNum}
                        </button>
                    )
                )}

                <button
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    style={{
                        padding: '6px 12px',
                        fontSize: '14px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: page === totalPages ? 'not-allowed' : 'pointer',
                        backgroundColor: page === totalPages ? '#f0f0f0' : 'white',
                        opacity: page === totalPages ? 0.5 : 1,
                    }}
                >
                    Next
                </button>
            </div>

            <div style={{ fontSize: '14px', color: '#666' }}>
                Page {page} of {totalPages} ({total} total items)
            </div>
        </div>
    )
}

export default Pagination
