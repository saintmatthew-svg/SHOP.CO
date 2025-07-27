import { useSearchParams, Link } from 'react-router-dom';
import { useSearchDummyJsonProductsQuery, useGetFakeStoreProductsQuery } from '../store/api/productsApi';
import ProductCard from '../components/ProductCard';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: dummySearchResults, isLoading: isDummyLoading } = useSearchDummyJsonProductsQuery(
    query,
    { skip: !query }
  );
  
  const { data: fakeStoreProducts, isLoading: isFakeStoreLoading } = useGetFakeStoreProductsQuery({});

  const filteredFakeStoreProducts = fakeStoreProducts?.filter(product =>
    product.title.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  ) || [];

  const allSearchResults = [
    ...(dummySearchResults?.products.map(p => ({ ...p, source: 'dummyjson' as const })) || []),
    ...filteredFakeStoreProducts.map(p => ({ ...p, source: 'fakestore' as const }))
  ];

  const isLoading = isDummyLoading || isFakeStoreLoading;
  const totalResults = allSearchResults.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>{'>'}</span>
          <span className="text-black">Search Results</span>
        </div>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">
          Search Results for "{query}"
        </h1>
        {!isLoading && (
          <p className="text-gray-600">
            Showing {totalResults} result{totalResults !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {isLoading && (
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
      )}

      {!isLoading && totalResults === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No results found</h2>
          <p className="text-gray-600 mb-8">
            We couldn't find any products matching "{query}". Try adjusting your search terms.
          </p>
          <Link
            to="/"
            className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      )}

      {!isLoading && totalResults > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allSearchResults.map((product) => (
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
    </div>
  );
}
