import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  ratingCount?: number;
  image: string;
  source: 'dummyjson' | 'fakestore';
}

export default function ProductCard({
  id,
  title,
  price,
  originalPrice,
  discount,
  rating,
  ratingCount,
  image,
  source
}: ProductCardProps) {
  const dispatch = useAppDispatch();
  const discountedPrice = originalPrice ? originalPrice * (1 - (discount || 0) / 100) : price;
  const displayPrice = discount ? discountedPrice : price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    const cartItem = {
      id,
      title,
      price: displayPrice,
      image,
      source
    };

    dispatch(addToCart(cartItem));
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="group">
      {/* Product Image - Clickable Link */}
      <Link to={`/product/${id}?source=${source}`}>
        <div className="bg-gray-100 rounded-2xl p-4 mb-4 aspect-square">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-3">
        <Link to={`/product/${id}?source=${source}`}>
          <h3 className="font-semibold text-gray-900 truncate hover:text-gray-700">{title}</h3>
        </Link>

        <div className="flex items-center space-x-1">
          {renderStars(rating)}
          <span className="text-sm text-gray-600 ml-2">
            {rating}/5 {ratingCount && `(${ratingCount})`}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-black">
            ${Math.round(displayPrice)}
          </span>
          {originalPrice && discount && (
            <>
              <span className="text-lg text-gray-400 line-through">
                ${Math.round(originalPrice)}
              </span>
              <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                -{discount}%
              </span>
            </>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-black text-white py-2 px-4 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
        >
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
