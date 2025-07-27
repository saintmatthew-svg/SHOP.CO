import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Grid, List } from 'lucide-react';
import { useGetDummyJsonProductsQuery, useGetFakeStoreProductsQuery } from '../store/api/productsApi';
import ProductCard from '../components/ProductCard';

export default function OnSale() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('discount');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: dummyProducts, isLoading: isDummyLoading } = useGetDummyJsonProductsQuery({ 
    limit: 50 
  });
  const { data: fakeStoreProducts, isLoading: isFakeStoreLoading } = useGetFakeStoreProductsQuery({});

  const saleProducts = [
    ...(dummyProducts?.products
      .filter(p => p.discountPercentage && p.discountPercentage > 10)
      .map(p => ({ ...p, source: 'dummyjson' as const, saleDiscount: p.discountPercentage }))
    || []),
    ...(fakeStoreProducts
      ?.map(p => ({ ...p, source: 'fakestore' as const, saleDiscount: Math.floor(Math.random() * 30) + 20 }))
      || [])
  ];

  const sortedProducts = [...saleProducts].sort((a, b) => {
    switch (sortBy) {
      case 'discount':
        return (b.saleDiscount || 0) - (a.saleDiscount || 0);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        const aRating = a.source === 'dummyjson' ? a.rating : (a as any).rating?.rate || 0;
        const bRating = b.source === 'dummyjson' ? b.rating : (b as any).rating?.rate || 0;
        return bRating - aRating;
      default:
        return 0;
    }
  });

  const isLoading = isDummyLoading || isFakeStoreLoading;
  const productsPerPage = 12;
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            MEGA SALE
          </h1>
          <p className="text-xl md:text-2xl mb-6">
            Up to 70% OFF on selected items
          </p>
          <div className="flex justify-center items-center space-x-8 text-lg">
            <div>
              <span className="block text-3xl font-bold">{saleProducts.length}+</span>
              <span>Items on Sale</span>
            </div>
            <div>
              <span className="block text-3xl font-bold">70%</span>
              <span>Max Discount</span>
            </div>
            <div>
              <span className="block text-3xl font-bold">24H</span>
              <span>Limited Time</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-black">Home</Link>
            <span>{'>'}</span>
            <span className="text-black">On Sale</span>
          </div>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-black mb-2">Sale Items</h2>
            <p className="text-gray-600">
              {isLoading ? 'Loading...' : `Showing ${currentProducts.length} of ${sortedProducts.length} products`}
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
              >
                <List size={16} />
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="discount">Highest Discount</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Best Rated</option>
            </select>

            <button className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">50-70%</div>
            <div className="text-sm text-red-700">Electronics</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">30-50%</div>
            <div className="text-sm text-blue-700">Clothing</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">20-40%</div>
            <div className="text-sm text-green-700">Accessories</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">15-30%</div>
            <div className="text-sm text-purple-700">Beauty</div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl aspect-square mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {currentProducts.map((product) => (
              <div key={`${product.source}-${product.id}`} className="relative">
                <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  SALE -{product.saleDiscount}%
                </div>
                
                <ProductCard
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  originalPrice={product.price * (1 + (product.saleDiscount || 20) / 100)}
                  discount={product.saleDiscount}
                  rating={product.source === 'dummyjson' ? product.rating : (product as any).rating?.rate || 4}
                  ratingCount={product.source === 'fakestore' ? (product as any).rating?.count : undefined}
                  image={product.source === 'dummyjson' ? (product as any).thumbnail : (product as any).image}
                  source={product.source}
                />
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-12">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-medium ${
                    currentPage === page
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        <section className="bg-black rounded-2xl p-8 mt-16 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Don't Miss Our Flash Sales!</h3>
          <p className="text-gray-300 mb-6">Subscribe to get notified about exclusive deals and limited-time offers</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-black"
            />
            <button className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors">
              Subscribe
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
