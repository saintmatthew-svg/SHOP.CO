import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';

export default function Cart() {
  const dispatch = useAppDispatch();
  const { items, total, itemCount } = useAppSelector(state => state.cart);

  const handleRemoveItem = (id: number, size?: string, color?: string, source?: string) => {
    dispatch(removeFromCart({ id, size, color, source: source || 'dummyjson' }));
  };

  const handleUpdateQuantity = (id: number, quantity: number, size?: string, color?: string, source?: string) => {
    dispatch(updateQuantity({ id, quantity, size, color, source: source || 'dummyjson' }));
  };

  const subtotal = total;
  const discount = subtotal * 0.2;
  const deliveryFee = 15;
  const finalTotal = subtotal - discount + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-96 flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
        <p className="text-lg text-gray-600 mb-6 max-w-md">
          Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
        </p>
        <Link
          to="/"
          className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>{'>'}</span>
          <span className="text-black">Cart</span>
        </div>
      </nav>

      <h1 className="text-3xl font-bold text-black mb-8">YOUR CART</h1>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">

        <div className="lg:col-span-2">
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={`${item.id}-${item.size}-${item.color}-${item.source}`} className="flex items-center space-x-4 bg-white border border-gray-200 rounded-2xl p-4">
                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-black mb-1">{item.title}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    {item.size && <p>Size: {item.size}</p>}
                    {item.color && <p>Color: {item.color}</p>}
                  </div>
                  <p className="text-lg font-bold text-black mt-2">${Math.round(item.price)}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.size, item.color, item.source)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.size, item.color, item.source)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <button
                  onClick={() => handleRemoveItem(item.id, item.size, item.color, item.source)}
                  className="p-2 text-red-500 hover:text-red-600"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 lg:mt-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-black mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${Math.round(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount (-20%)</span>
                <span className="font-medium text-red-500">-${Math.round(discount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">${deliveryFee}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${Math.round(finalTotal)}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add promo code"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full outline-none focus:ring-2 focus:ring-black"
                />
                <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800">
                  Apply
                </button>
              </div>
              
              <Link
                to="/checkout"
                className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Go to Checkout</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
