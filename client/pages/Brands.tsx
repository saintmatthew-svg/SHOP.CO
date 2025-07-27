import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, ArrowRight } from 'lucide-react';
import { useGetDummyJsonProductsQuery, useGetFakeStoreProductsQuery } from '../store/api/productsApi';
import ProductCard from '../components/ProductCard';

interface Brand {
  name: string;
  logo: string;
  description: string;
  category: string;
  productCount: number;
  featured: boolean;
}

export default function Brands() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: dummyProducts, isLoading: isDummyLoading } = useGetDummyJsonProductsQuery({ limit: 20 });
  const { data: fakeStoreProducts, isLoading: isFakeStoreLoading } = useGetFakeStoreProductsQuery({});

  const brands: Brand[] = [
    {
      name: 'VERSACE',
      logo: '👑',
      description: 'Luxury Italian fashion and lifestyle brand',
      category: 'luxury',
      productCount: 156,
      featured: true
    },
    {
      name: 'ZARA',
      logo: '🔥',
      description: 'Fast fashion with contemporary designs',
      category: 'fashion',
      productCount: 289,
      featured: true
    },
    {
      name: 'GUCCI',
      logo: '💎',
      description: 'Italian luxury fashion and leather goods',
      category: 'luxury',
      productCount: 198,
      featured: true
    },
    {
      name: 'PRADA',
      logo: '✨',
      description: 'Italian luxury fashion house',
      category: 'luxury',
      productCount: 134,
      featured: true
    },
    {
      name: 'Calvin Klein',
      logo: '⚡',
      description: 'American fashion house specializing in leather goods',
      category: 'contemporary',
      productCount: 245,
      featured: true
    },
    {
      name: 'NIKE',
      logo: '🏃',
      description: 'Athletic footwear and apparel',
      category: 'sports',
      productCount: 312,
      featured: false
    },
    {
      name: 'ADIDAS',
      logo: '⚽',
      description: 'German multinational sportswear corporation',
      category: 'sports',
      productCount: 278,
      featured: false
    },
    {
      name: 'H&M',
      logo: '🎨',
      description: 'Swedish multinational clothing-retail company',
      category: 'fashion',
      productCount: 421,
      featured: false
    },
    {
      name: 'UNIQLO',
      logo: '🎯',
      description: 'Japanese casual wear designer and retailer',
      category: 'contemporary',
      productCount: 189,
      featured: false
    },
    {
      name: 'CHANEL',
      logo: '👜',
      description: 'French luxury fashion house',
      category: 'luxury',
      productCount: 98,
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Brands', count: brands.length },
    { id: 'luxury', name: 'Luxury', count: brands.filter(b => b.category === 'luxury').length },
    { id: 'fashion', name: 'Fashion', count: brands.filter(b => b.category === 'fashion').length },
    { id: 'sports', name: 'Sports', count: brands.filter(b => b.category === 'sports').length },
    { id: 'contemporary', name: 'Contemporary', count: brands.filter(b => b.category === 'contemporary').length }
  ];

  const filteredBrands = brands.filter(brand => {
    const matchesCategory = selectedCategory === 'all' || brand.category === selectedCategory;
    const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         brand.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredBrands = brands.filter(brand => brand.featured);

  const featuredProducts = [
    ...(dummyProducts?.products.slice(0, 4).map(p => ({ ...p, source: 'dummyjson' as const })) || []),
    ...(fakeStoreProducts?.slice(0, 4).map(p => ({ ...p, source: 'fakestore' as const })) || [])
  ].slice(0, 8);

  return (
    <div className="bg-white min-h-screen">

      <section className="bg-gradient-to-r from-black to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              DISCOVER BRANDS
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Shop from the world's most prestigious fashion brands
            </p>
            
            <div className="flex justify-center items-center space-x-8 md:space-x-16 text-2xl md:text-4xl font-bold">
              <div>VERSACE</div>
              <div>ZARA</div>
              <div>GUCCI</div>
              <div>PRADA</div>
              <div>Calvin Klein</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-black">Home</Link>
            <span>{'>'}</span>
            <span className="text-black">Brands</span>
          </div>
        </nav>

        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-8">

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8">Featured Brands</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {featuredBrands.map((brand) => (
              <Link
                key={brand.name}
                to={`/search?q=${encodeURIComponent(brand.name)}`}
                className="group"
              >
                <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 group-hover:bg-gray-100">
                  <div className="text-4xl mb-4">{brand.logo}</div>
                  <h3 className="font-bold text-lg text-black mb-2">{brand.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{brand.description}</p>
                  <div className="text-xs text-gray-500">{brand.productCount} products</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-black">
              {selectedCategory === 'all' ? 'All Brands' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <span className="text-gray-600">
              {filteredBrands.length} brands found
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map((brand) => (
              <Link
                key={brand.name}
                to={`/search?q=${encodeURIComponent(brand.name)}`}
                className="group"
              >
                <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group-hover:border-gray-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">{brand.logo}</span>
                        <h3 className="font-bold text-xl text-black">{brand.name}</h3>
                      </div>
                      <p className="text-gray-600 mb-4">{brand.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{brand.productCount} products</span>
                        <span className="inline-flex items-center text-sm font-medium text-black group-hover:text-gray-600">
                          Shop now
                          <ArrowRight size={16} className="ml-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-black mb-8">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(isDummyLoading || isFakeStoreLoading) ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl aspect-square mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))
            ) : (
              featuredProducts.map((product) => (
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
              ))
            )}
          </div>
        </section>

        <section className="bg-gray-50 rounded-2xl p-8 mt-16 text-center">
          <h3 className="text-2xl font-bold text-black mb-4">Partner with Us</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Are you a brand looking to reach millions of customers? Join our marketplace and showcase your products to a global audience.
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
            Become a Partner
          </button>
        </section>
      </div>
    </div>
  );
}
