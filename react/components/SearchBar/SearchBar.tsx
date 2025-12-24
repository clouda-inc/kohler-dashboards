import React, { useState } from 'react'

interface SearchBarProps {
    brands: string[]
    onSearch: (searchQuery: string, brand: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ brands, onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedBrand, setSelectedBrand] = useState('')

    const handleSearch = () => {
        onSearch(searchQuery, selectedBrand)
    }

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newBrand = e.target.value
        setSelectedBrand(newBrand)
        onSearch(searchQuery, newBrand)
    }

    return (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
            <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleSearchKeyPress}
                    style={{
                        flex: 1,
                        padding: '8px',
                        fontSize: '14px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Search
                </button>
            </div>

            <div>
                <select
                    value={selectedBrand}
                    onChange={handleBrandChange}
                    style={{
                        padding: '8px',
                        fontSize: '14px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        minWidth: '150px',
                    }}
                >
                    <option value="">All Brands</option>
                    {brands.map(brand => (
                        <option key={brand} value={brand}>
                            {brand}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default SearchBar
