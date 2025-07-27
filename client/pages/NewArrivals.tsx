import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Grid, List, Calendar, Sparkles, TrendingUp } from 'lucide-react';
import { useGetDummyJsonProductsQuery, useGetFakeStoreProductsQuery } from '../store/api/productsApi';
import ProductCard from '../components/ProductCard';

export default function NewArrivals() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: dummyProducts, isLoading: isDummyLoading } = useGetDummyJsonProductsQuery({ 
    limit: 30 
  });
  const { data: fakeStoreProducts, isLoading: isFakeStoreLoading } = useGetFakeStoreProductsQuery({});

  const newArrivals = [
    ...(dummyProducts?.products.map((p, index) => ({ 
      ...p, 
      source: 'dummyjson' as const,
      arrivalDate: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)),
      isNew: index < 8,
      isTrending: index < 5
    })) || []),
    ...(fakeStoreProducts?.map((p, index) => ({ 
      ...p, 
      source: 'fakestore' as const,
      arrivalDate: new Date(Date.now() - ((index + 10) * 24 * 60 * 60 * 1000)),
      isNew: index < 6,
      isTrending: index < 3
    })) || [])
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: newArrivals.length },
    { id: 'clothing', name: 'Clothing', count: newArrivals.filter(p => 
      p.category.includes('clothing') || p.category.includes('shirt') || p.category.includes('top')
    ).length },
    { id: 'electronics', name: 'Electronics', count: newArrivals.filter(p => 
      p.category.includes('electronics') || p.category.includes('phone') || p.category.includes('laptop')
    ).length },
    { id: 'accessories', name: 'Accessories', count: newArrivals.filter(p => 
      p.category.includes('jewelry') || p.category.includes('bag') || p.category.includes('watch')
    ).length },
    { id: 'beauty', name: 'Beauty', count: newArrivals.filter(p => 
      p.category.includes('beauty') || p.category.includes('skincare') || p.category.includes('makeup')
    ).length }
  ];

  const filteredProducts = newArrivals.filter(product => {
    if (selectedCategory === 'all') return true;
    
    switch (selectedCategory) {
      case 'clothing':
        return product.category.includes('clothing') || product.category.includes('shirt') || product.category.includes('top');
      case 'electronics':
        return product.category.includes('electronics') || product.category.includes('phone') || product.category.includes('laptop');
      case 'accessories':
        return product.category.includes('jewelry') || product.category.includes('bag') || product.category.includes('watch');
      case 'beauty':
        return product.category.includes('beauty') || product.category.includes('skincare') || product.category.includes('makeup');
      default:
        return true;
    }
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return b.arrivalDate.getTime() - a.arrivalDate.getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        const aRating = a.source === 'dummyjson' ? a.rating : (a as any).rating?.rate || 0;
        const bRating = b.source === 'dummyjson' ? b.rating : (b as any).rating?.rate || 0;
        return bRating - aRating;
      case 'trending':
        return Number(b.isTrending) - Number(a.isTrending);
      default:
        return 0;
    }
  });

  const isLoading = isDummyLoading || isFakeStoreLoading;
  const productsPerPage = 12;
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  const formatDate = (date: Date) => {
    const diffTime = Date.now() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <Sparkles size={48} className="text-yellow-300" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            NEW ARRIVALS
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-blue-100">
            Discover the latest trends and must-have items
          </p>
          <div className="flex justify-center items-center space-x-8 text-lg">
            <div className="text-center">
              <span className="block text-3xl font-bold">{newArrivals.filter(p => p.isNew).length}+</span>
              <span className="text-blue-200">Fresh Items</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold">{newArrivals.filter(p => p.isTrending).length}</span>
              <span className="text-blue-200">Trending Now</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold">24H</span>
              <span className="text-blue-200">Daily Updates</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-black">Home</Link>
            <span>{'>'}</span>
            <span className="text-black">New Arrivals</span>
          </div>
        </nav>

        <section className="mb-12">
          <div className="flex items-center mb-6">
            <TrendingUp className="text-red-500 mr-2" size={24} />
            <h2 className="text-2xl font-bold text-black">Trending This Week</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">👕</div>
              <div className="font-medium text-red-700">Summer Tops</div>
              <div className="text-sm text-red-600">+45% in searches</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">👟</div>
              <div className="font-medium text-blue-700">Sneakers</div>
              <div className="text-sm text-blue-600">+32% in searches</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">💍</div>
              <div className="font-medium text-green-700">Jewelry</div>
              <div className="text-sm text-green-600">+28% in searches</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">💄</div>
              <div className="font-medium text-purple-700">Beauty</div>
              <div className="text-sm text-purple-600">+21% in searches</div>
            </div>
          </div>
        </section>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-black mb-2">Latest Arrivals</h2>
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
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="trending">Trending</option>
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

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full border transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
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
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                  {product.isNew && (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <Sparkles size={10} className="mr-1" />
                      NEW
                    </div>
                  )}
                  {product.isTrending && (
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <TrendingUp size={10} className="mr-1" />
                      TRENDING
                    </div>
                  )}
                </div>

                <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                  <Calendar size={10} className="mr-1" />
                  {formatDate(product.arrivalDate)}
                </div>
                
                <ProductCard
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  originalPrice={product.price * 1.2}
                  discount={20}
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
                      ? 'bg-blue-600 text-white'
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
          <h3 className="text-2xl font-bold mb-4">Weekly New Drops</h3>
          <p className="text-gray-300 mb-6">
            Be the first to know when new products arrive. Get notified every Tuesday and Friday!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-black"
            />
            <button className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Get Notified
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Join 50k+ fashion enthusiasts getting exclusive early access
          </p>
        </section>
      </div>
    </div>
  );
}
