import { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Star, Minus, Plus, Filter } from 'lucide-react';
import { useGetDummyJsonProductQuery, useGetFakeStoreProductQuery, useGetDummyJsonProductsQuery, useGetFakeStoreProductsQuery } from '../store/api/productsApi';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source') as 'dummyjson' | 'fakestore' || 'dummyjson';
  const dispatch = useAppDispatch();

  const [selectedSize, setSelectedSize] = useState('Large');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  const { data: dummyProduct, isLoading: isDummyLoading } = useGetDummyJsonProductQuery(
    Number(id), 
    { skip: source !== 'dummyjson' }
  );
  
  const { data: fakeStoreProduct, isLoading: isFakeStoreLoading } = useGetFakeStoreProductQuery(
    Number(id), 
    { skip: source !== 'fakestore' }
  );

  const { data: dummyProducts } = useGetDummyJsonProductsQuery({ limit: 4 });
  const { data: fakeStoreProducts } = useGetFakeStoreProductsQuery({});

  const product = source === 'dummyjson' ? dummyProduct : fakeStoreProduct;
  const isLoading = source === 'dummyjson' ? isDummyLoading : isFakeStoreLoading;

  const relatedProducts = source === 'dummyjson' 
    ? (dummyProducts?.products.slice(0, 4) || [])
    : (fakeStoreProducts?.slice(0, 4) || []);

  const colors = ['green', 'blue', 'navy'];
  const sizes = ['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large'];

  const reviews = [
    {
      name: "Samantha D.",
      rating: 5,
      text: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.",
      date: "August 14, 2023",
      verified: true
    },
    {
      name: "Alex M.",
      rating: 4,
      text: "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UIUX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.",
      date: "August 15, 2023",
      verified: true
    },
    {
      name: "Ethan R.",
      rating: 4,
      text: "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet expressive design caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt.",
      date: "August 16, 2023",
      verified: true
    }
  ];

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: source === 'dummyjson' ? (product as any).thumbnail : product.images,
      size: selectedSize,
      color: selectedColor,
      source
    };

    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(cartItem));
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="space-y-4">
              <div className="bg-gray-200 rounded-2xl aspect-square"></div>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg aspect-square"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-96 flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-lg text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/" className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  const rating = source === 'dummyjson' ? (product as any).rating : product.rating?.rate || 0;
  const ratingCount = source === 'fakestore' ? product.rating?.count : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>{'>'}</span>
          <Link to="/category/casual" className="hover:text-black">Shop</Link>
          <span>{'>'}</span>
          <Link to="/category/men" className="hover:text-black">Men</Link>
          <span>{'>'}</span>
          <span className="text-black">T-shirts</span>
        </div>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-12 mb-16">
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-2xl p-8">
            <img
              src={source === 'dummyjson' ? (product as any).thumbnail : product.images}
              alt={product.title}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          
          {source === 'dummyjson' && (product as any).images && (
            <div className="grid grid-cols-3 gap-4">
              {(product as any).images.slice(0, 3).map((image: string, index: number) => (
                <div key={index} className="bg-gray-100 rounded-lg p-4 aspect-square">
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 lg:mt-0">
          <h1 className="text-3xl font-bold text-black mb-4">{product.title}</h1>
          
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex items-center">
              {renderStars(rating)}
            </div>
            <span className="text-sm text-gray-600">
              {rating}/5 {ratingCount && `(${ratingCount})`}
            </span>
          </div>

          <div className="flex items-center space-x-3 mb-6">
            <span className="text-3xl font-bold text-black">${Math.round(product.price)}</span>
            <span className="text-2xl text-gray-400 line-through">${Math.round(product.price * 1.25)}</span>
            <span className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full">-40%</span>
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

          <hr className="border-gray-200 mb-8" />

          <div className="mb-6">
            <h3 className="font-medium text-black mb-3">Select Colors</h3>
            <div className="flex space-x-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? 'border-black' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-medium text-black mb-3">Choose Size</h3>
            <div className="grid grid-cols-3 gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 px-4 rounded-full border text-sm font-medium ${
                    selectedSize === size
                      ? 'bg-black text-white border-black'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-gray-200 mb-8" />

          <div className="flex items-center space-x-4 mb-8">
            <div className="flex items-center space-x-3 bg-gray-100 rounded-full px-4 py-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-200"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {[
            { id: 'details', label: 'Product Details' },
            { id: 'reviews', label: 'Rating & Reviews' },
            { id: 'faqs', label: 'FAQs' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'reviews' && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-black">All Reviews ({reviews.length})</h3>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-black">
                <Filter size={20} />
                <span>Latest</span>
              </button>
              <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800">
                Write a Review
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p className="text-gray-600 leading-relaxed mb-4">{review.text}</p>
                <p className="text-sm text-gray-500">Posted on {review.date}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="bg-white border border-gray-300 text-black px-8 py-3 rounded-full font-medium hover:bg-gray-50">
              Load More Reviews
            </button>
          </div>
        </div>
      )}

      <section>
        <h2 className="text-3xl font-bold text-center text-black mb-12">
          YOU MIGHT ALSO LIKE
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard
              key={relatedProduct.id}
              id={relatedProduct.id}
              title={relatedProduct.title}
              price={source === 'dummyjson' ? relatedProduct.price : (relatedProduct as any).price}
              originalPrice={source === 'dummyjson' ? relatedProduct.price * 1.15 : (relatedProduct as any).price * 1.15}
              discount={15}
              rating={source === 'dummyjson' ? relatedProduct.rating : (relatedProduct as any).rating?.rate || 4}
              ratingCount={source === 'fakestore' ? (relatedProduct as any).rating?.count : undefined}
              image={source === 'dummyjson' ? relatedProduct.thumbnail : (relatedProduct as any).image}
              source={source}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
