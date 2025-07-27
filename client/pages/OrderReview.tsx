import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, CreditCard, MapPin, Package, Truck } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { clearCart } from '../store/slices/cartSlice';

export default function OrderReview() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector(state => state.cart);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId] = useState(() => `ORD-${Date.now()}`);

  const checkoutData = JSON.parse(sessionStorage.getItem('checkoutData') || '{}');
  const paymentData = JSON.parse(sessionStorage.getItem('paymentData') || '{}');

  const subtotal = total;
  const shipping = 15;
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    dispatch(clearCart());
    setIsProcessing(false);
    setOrderComplete(true);
    
    sessionStorage.removeItem('checkoutData');
    sessionStorage.removeItem('paymentData');
  };

  const formatCardNumber = (number: string) => {
    if (!number) return '';
    const cleaned = number.replace(/\s/g, '');
    return `**** **** **** ${cleaned.slice(-4)}`;
  };

  if (orderComplete) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            
            <h1 className="text-3xl font-bold text-black mb-4">Order Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your purchase. Your order has been confirmed and is being processed.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-black mb-2">Order Number</h3>
                  <p className="text-gray-600">{orderId}</p>
                </div>
                <div>
                  <h3 className="font-medium text-black mb-2">Total Amount</h3>
                  <p className="text-gray-600">${Math.round(finalTotal)}</p>
                </div>
                <div>
                  <h3 className="font-medium text-black mb-2">Estimated Delivery</h3>
                  <p className="text-gray-600">5-7 business days</p>
                </div>
                <div>
                  <h3 className="font-medium text-black mb-2">Shipping Address</h3>
                  <p className="text-gray-600">
                    {checkoutData.firstName} {checkoutData.lastName}<br />
                    {checkoutData.address}<br />
                    {checkoutData.city}, {checkoutData.country}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/orders"
                className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Track Your Order
              </Link>
              <Link
                to="/"
                className="border border-gray-300 text-black px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Link to="/checkout/payment" className="flex items-center text-gray-600 hover:text-black mr-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Payment
          </Link>
          <h1 className="text-3xl font-bold text-black">Review Order</h1>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">✓</div>
              <span className="ml-2 text-green-600">Shipping</span>
            </div>
            <div className="flex-1 h-0.5 bg-green-500 mx-4"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">✓</div>
              <span className="ml-2 text-green-600">Payment</span>
            </div>
            <div className="flex-1 h-0.5 bg-green-500 mx-4"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
              <span className="ml-2 font-medium text-black">Review</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <Truck className="text-black mr-2" size={20} />
                <h2 className="text-xl font-bold text-black">Shipping Information</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-black">{checkoutData.firstName} {checkoutData.lastName}</p>
                <p className="text-gray-600 mt-1">
                  {checkoutData.address}<br />
                  {checkoutData.apartment && <>{checkoutData.apartment}<br /></>}
                  {checkoutData.city}, {checkoutData.country} {checkoutData.postalCode}
                </p>
                <p className="text-gray-600 mt-2">{checkoutData.phone}</p>
                <p className="text-gray-600">{checkoutData.email}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="text-black mr-2" size={20} />
                <h2 className="text-xl font-bold text-black">Payment Information</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                {paymentData.method === 'card' ? (
                  <div>
                    <p className="font-medium text-black">Credit/Debit Card</p>
                    <p className="text-gray-600">{formatCardNumber(paymentData.cardNumber)}</p>
                    <p className="text-gray-600">{paymentData.cardName}</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-black capitalize">{paymentData.method} Pay</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <Package className="text-black mr-2" size={20} />
                <h2 className="text-xl font-bold text-black">Delivery Estimate</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-black">Standard Delivery</p>
                <p className="text-gray-600">5-7 business days</p>
                <p className="text-sm text-gray-500 mt-2">
                  You'll receive tracking information once your order ships.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-bold text-black mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}-${item.source}`} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-black">{item.title}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                    {item.color && <p className="text-sm text-gray-600">Color: {item.color}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-black">${Math.round(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <hr className="border-gray-200 mb-6" />

            <div className="space-y-3 mb-8">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${Math.round(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">${shipping}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${Math.round(tax)}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${Math.round(finalTotal)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </div>
              ) : (
                `Place Order - $${Math.round(finalTotal)}`
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
