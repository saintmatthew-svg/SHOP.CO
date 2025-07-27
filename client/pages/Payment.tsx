import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, Calendar, User } from 'lucide-react';
import { useAppSelector } from '../store/hooks';

export default function Payment() {
  const navigate = useNavigate();
  const { items, total } = useAppSelector(state => state.cart);
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const checkoutData = JSON.parse(sessionStorage.getItem('checkoutData') || '{}');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      formattedValue = formattedValue.substring(0, 19);
    }
    
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
      }
    }
    
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    
    setCardData(prev => ({ ...prev, [name]: formattedValue }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === 'card') {
      if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }
      if (!cardData.expiryDate || !/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }
      if (!cardData.cvv || cardData.cvv.length < 3) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
      if (!cardData.cardName) {
        newErrors.cardName = 'Please enter the cardholder name';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const paymentData = {
        method: paymentMethod,
        ...(paymentMethod === 'card' ? cardData : {})
      };
      sessionStorage.setItem('paymentData', JSON.stringify(paymentData));
      navigate('/checkout/review');
    }
  };

  const subtotal = total;
  const shipping = 15;
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + shipping + tax;

  const getCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'visa';
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'mastercard';
    if (cleanNumber.startsWith('3')) return 'amex';
    return 'card';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Link to="/checkout" className="flex items-center text-gray-600 hover:text-black mr-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Shipping
          </Link>
          <h1 className="text-3xl font-bold text-black">Payment</h1>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">✓</div>
              <span className="ml-2 text-green-600">Shipping</span>
            </div>
            <div className="flex-1 h-0.5 bg-green-500 mx-4"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
              <span className="ml-2 font-medium text-black">Payment</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
              <span className="ml-2 text-gray-600">Review</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6">
            <h2 className="text-xl font-bold text-black mb-6">Payment Method</h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-200'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="w-4 h-4 text-black"
                    />
                    <CreditCard className="ml-3 mr-2" size={20} />
                    <span className="font-medium">Credit / Debit Card</span>
                  </div>
                </div>

                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'paypal' ? 'border-black bg-gray-50' : 'border-gray-200'
                  }`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="w-4 h-4 text-black"
                    />
                    <div className="ml-3 mr-2 w-5 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">P</div>
                    <span className="font-medium">PayPal</span>
                  </div>
                </div>

                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    paymentMethod === 'apple' ? 'border-black bg-gray-50' : 'border-gray-200'
                  }`}
                  onClick={() => setPaymentMethod('apple')}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="apple"
                      checked={paymentMethod === 'apple'}
                      onChange={() => setPaymentMethod('apple')}
                      className="w-4 h-4 text-black"
                    />
                    <div className="ml-3 mr-2 w-5 h-5 bg-black rounded text-white text-xs flex items-center justify-center">🍎</div>
                    <span className="font-medium">Apple Pay</span>
                  </div>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardData.cardNumber}
                        onChange={handleInputChange}
                        className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                          errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {cardData.cardNumber && (
                          <div className="text-xs text-gray-500 uppercase font-bold">
                            {getCardType(cardData.cardNumber)}
                          </div>
                        )}
                      </div>
                    </div>
                    {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={cardData.expiryDate}
                          onChange={handleInputChange}
                          className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                            errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      </div>
                      {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="cvv"
                          placeholder="123"
                          value={cardData.cvv}
                          onChange={handleInputChange}
                          className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                            errors.cvv ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      </div>
                      {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cardName"
                        placeholder="John Doe"
                        value={cardData.cardName}
                        onChange={handleInputChange}
                        className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                          errors.cardName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                    {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                  </div>
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <Lock className="text-green-600 mr-2" size={16} />
                  <span className="text-sm text-green-800">Your payment information is encrypted and secure</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Continue to Review
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-bold text-black mb-6">Order Summary</h2>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-black mb-2">Shipping Address</h3>
              <p className="text-sm text-gray-600">
                {checkoutData.firstName} {checkoutData.lastName}<br />
                {checkoutData.address}<br />
                {checkoutData.apartment && <>{checkoutData.apartment}<br /></>}
                {checkoutData.city}, {checkoutData.country} {checkoutData.postalCode}<br />
                {checkoutData.phone}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}-${item.source}`} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-black">{item.title}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-black">${Math.round(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <hr className="border-gray-200 mb-6" />

            <div className="space-y-3">
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
          </div>
        </div>
      </div>
    </div>
  );
}
