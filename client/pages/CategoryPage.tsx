import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, X, ChevronDown, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { useGetDummyJsonProductsQuery, useGetFakeStoreProductsQuery } from '../store/api/productsApi';
import ProductCard from '../components/ProductCard';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([50, 200]);
  const [selectedDressStyle, setSelectedDressStyle] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Most Popular');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: dummyProducts, isLoading: isDummyLoading } = useGetDummyJsonProductsQuery({ 
    limit: 1000000,
    skip: (currentPage - 1) * 50 
  });
  
  const { data: fakeStoreProducts, isLoading: isFakeStoreLoading } = useGetFakeStoreProductsQuery({});

  const colors = [
    { name: 'Green', color: '#22c55e' },
    { name: 'Red', color: '#ef4444' },
    { name: 'Yellow', color: '#eab308' },
    { name: 'Orange', color: '#f97316' },
    { name: 'Blue', color: '#06b6d4' },
    { name: 'Navy', color: '#1e40af' },
    { name: 'Purple', color: '#8b5cf6' },
    { name: 'Pink', color: '#ec4899' },
    { name: 'White', color: '#ffffff' },
    { name: 'Black', color: '#000000' }
  ];

  const sizes = ['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large'];
  const dressStyles = ['Casual', 'Formal', 'Party', 'Gym'];

  const categories = [
    { name: 'T-shirts', count: 0 },
    { name: 'Shorts', count: 0 },
    { name: 'Shirts', count: 0 },
    { name: 'Hoodie', count: 0 },
    { name: 'Jeans', count: 0 }
  ];

  const allProducts = [
    ...(dummyProducts?.products.map(p => ({ ...p, source: 'dummyjson' as const })) || []),
    ...(fakeStoreProducts?.map(p => ({ ...p, source: 'fakestore' as const })) || [])
  ];

  const filteredProducts = allProducts.filter(product => {
    const price = product.price;
    if (price < priceRange[0] || price > priceRange[1]) return false;
    
    return true;
  });

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleDressStyleToggle = (style: string) => {
    setSelectedDressStyle(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const totalProducts = filteredProducts.length;
  const productsPerPage = 9;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const FilterSidebar = () => (
    <div className="w-80 bg-white border-r border-gray-200 p-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-black">Filters</h2>
        <button 
          onClick={() => setIsFilterOpen(false)}
          className="lg:hidden p-2"
        >
          <X size={24} />
        </button>
      </div>

      <div className="mb-8">
        {categories.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <span className="text-gray-700">{cat.name}</span>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        ))}
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-black">Price</h3>
          <ChevronDown size={16} />
        </div>
        <div className="relative">
          <input
            type="range"
            min="50"
            max="200"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-black">Colors</h3>
          <ChevronDown size={16} />
        </div>
        <div className="grid grid-cols-5 gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorToggle(color.name)}
              className={`w-8 h-8 rounded-full border-2 ${
                selectedColors.includes(color.name) ? 'border-black' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color.color }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-black">Size</h3>
          <ChevronDown size={16} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeToggle(size)}
              className={`py-2 px-3 rounded-full border text-sm ${
                selectedSizes.includes(size)
                  ? 'bg-black text-white border-black'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-black">Dress Style</h3>
          <ChevronDown size={16} />
        </div>
        {dressStyles.map((style) => (
          <div key={style} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <span className="text-gray-700">{style}</span>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        ))}
      </div>

      <button className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800">
        Apply Filter
      </button>
    </div>
  );

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-black">Home</Link>
            <span>{'>'}</span>
            <span className="text-black capitalize">{category}</span>
          </div>
        </nav>
      </div>

      <div className="flex">
        <div className="hidden lg:block">
          <FilterSidebar />
        </div>

        {isFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsFilterOpen(false)} />
            <div className="absolute left-0 top-0 h-full">
              <FilterSidebar />
            </div>
          </div>
        )}

        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-black capitalize">{category}</h1>
              <span className="text-gray-600">
                Showing 1-{Math.min(productsPerPage, totalProducts)} of {totalProducts} Products
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full"
              >
                <Filter size={16} />
                <span>Filters</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option>Most Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                  <option>Rating</option>
                </select>
              </div>
            </div>
          </div>

          {isDummyLoading || isFakeStoreLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl aspect-square mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentProducts.map((product) => (
                <ProductCard
                  key={`${product.source}-${product.id}`}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  originalPrice={product.price * (product.source === 'dummyjson' ? 1.25 : 1.15)}
                  discount={product.source === 'dummyjson' ? (product as any).discountPercentage : 15}
                  rating={product.source === 'dummyjson' ? (product as any).rating : (product as any).rating?.rate || 4}
                  ratingCount={product.source === 'fakestore' ? (product as any).rating?.count : undefined}
                  image={product.source === 'dummyjson' ? (product as any).thumbnail : (product as any).image}
                  source={product.source}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={16} />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-2">
                {[...Array(Math.min(10, totalPages))].map((_, i) => {
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
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
