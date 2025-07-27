import { Link } from 'react-router-dom';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { useGetDummyJsonProductsQuery, useGetFakeStoreProductsQuery } from '../store/api/productsApi';
import ProductCard from '../components/ProductCard';

export default function Index() {
  const { data: dummyProducts, isLoading: isDummyLoading } = useGetDummyJsonProductsQuery({ limit: 8 });
  const { data: fakeStoreProducts, isLoading: isFakeStoreLoading } = useGetFakeStoreProductsQuery({});

  const newArrivals = dummyProducts?.products.slice(0, 4) || [];
  const topSelling = fakeStoreProducts?.slice(0, 4) || [];

  const reviews = [
    {
      name: "Sarah M.",
      rating: 5,
      text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
      verified: true
    },
    {
      name: "Alex K.",
      rating: 5,
      text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
      verified: true
    },
    {
      name: "James L.",
      rating: 5,
      text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
      verified: true
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="bg-white">
      <section className="bg-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center min-h-[500px] py-12">
            <div className="lg:w-1/2 lg:pr-12 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">
                FIND CLOTHES THAT MATCHES YOUR STYLE
              </h1>
              <p className="text-gray-600 text-lg mb-8 max-w-lg">
                Browse through our diverse range of meticulously crafted garments, designed 
                to bring out your individuality and cater to your sense of style.
              </p>
              <Link
                to="/category/casual"
                className="inline-block bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Shop Now
              </Link>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-12">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-black">200+</div>
                  <div className="text-gray-600">International Brands</div>
                </div>
                <div className="text-center border-l border-gray-300 pl-8">
                  <div className="text-2xl md:text-3xl font-bold text-black">2,000+</div>
                  <div className="text-gray-600">High-Quality Products</div>
                </div>
                <div className="text-center border-l border-gray-300 pl-8">
                  <div className="text-2xl md:text-3xl font-bold text-black">30,000+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 mt-8 lg:mt-0 relative">
              <div className="relative">
                <img
                  src="homepage-pic.jpg"
                  alt="Fashion Models"
                  className="w-full h-[800px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center space-x-8 md:space-x-16 text-white">
            <div><img
                  src="versace.png"
                  alt="Formal"/></div>
            <div><img
                  src="gucci.png"
                  alt="Formal"/></div>
            <div><img
                  src="burberry.png"
                  alt="Formal"/></div>
            <div><img
                  src="prada.png"
                  alt="Formal"/></div>
            <div><img
                  src="calvin-klein.png"
                  alt="Formal"/></div>
            <div><img
                  src="dior.png"
                  alt="Formal"/></div>
            <div><img
                  src="balenciaga.png"
                  alt="Formal"/></div>            
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">
            NEW ARRIVALS
          </h2>
          {isDummyLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl aspect-square mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {newArrivals.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  originalPrice={product.price * 1.25}
                  discount={product.discountPercentage}
                  rating={product.rating}
                  image={product.thumbnail}
                  source="dummyjson"
                />
              ))}
            </div>
          )}
          <div className="text-center">
            <Link
              to="/category/casual"
              className="inline-block border border-gray-300 text-black px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">
            TOP SELLING
          </h2>
          {isFakeStoreLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-2xl aspect-square mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {topSelling.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  originalPrice={product.price * 1.15}
                  discount={15}
                  rating={product.rating.rate}
                  ratingCount={product.rating.count}
                  image={product.image}
                  source="fakestore"
                />
              ))}
            </div>
          )}
          <div className="text-center">
            <Link
              to="/category/casual"
              className="inline-block border border-gray-300 text-black px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">
            BROWSE BY DRESS STYLE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/category/casual" className="relative group">
              <div className="bg-white rounded-2xl overflow-hidden h-80 w-45">
                <img
                  src="Frame 61.jpg"
                  alt="Casual"
                  className="w-full h-medium object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-6 left-6">
                  <h3 className="text-2xl font-bold text-black"></h3>
                </div>
              </div>
            </Link>
            
            <Link to="/category/formal" className="relative group">
              <div className="bg-white rounded-2xl overflow-hidden h-64">
                <img
                  src="Frame 62.jpg"
                  alt="Formal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-6 left-6">
                  <h3 className="text-2xl font-bold text-white"></h3>
                </div>
              </div>
            </Link>
            
            <Link to="/category/party" className="relative group">
              <div className="bg-white rounded-2xl overflow-hidden h-64">
                <img
                  src="Frame 64.jpg"
                  alt="Party"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-6 left-6">
                  <h3 className="text-2xl font-bold text-white"></h3>
                </div>
              </div>
            </Link>
            
            <Link to="/category/gym" className="relative group">
              <div className="bg-white rounded-2xl overflow-hidden h-80 w-50">
                <img
                  src="Frame 63.jpg"
                  alt="Gym"
                  className="w-full h-medium object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-6 left-6">
                  <h3 className="text-2xl font-bold text-black"></h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              OUR HAPPY CUSTOMERS
            </h2>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50">
                <ArrowLeft size={20} />
              </button>
              <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  {renderStars(review.rating)}
                </div>
                <div className="flex items-center mb-4">
                  <h4 className="font-semibold text-black">{review.name}</h4>
                  {review.verified && (
                    <svg className="w-5 h-5 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-gray-600 leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
