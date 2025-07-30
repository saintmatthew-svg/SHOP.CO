import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import AuthModal from './AuthModal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const cartItemCount = useAppSelector(state => state.cart.itemCount);
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const handleSearchInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsUserDropdownOpen(false);
  };

  return (
    <>
      <div className="bg-black text-white text-center py-2 px-4 text-sm">
        Sign up and get 20% off to your first order.{' '}
        <button
          onClick={() => openAuthModal('signup')}
          className="underline font-medium hover:text-gray-300 transition-colors"
        >
          Sign Up Now
        </button>
      </div>

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>

            <Link to="/" className="text-2xl font-bold text-black">
              SHOP.CO
            </Link>

            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-black">
                  <span>Shop</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 w-48 bg-white shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/category/casual" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Casual</Link>
                  <Link to="/category/formal" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Formal</Link>
                  <Link to="/category/party" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Party</Link>
                  <Link to="/category/gym" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Gym</Link>
                </div>
              </div>
              <Link to="/sale" className="text-gray-700 hover:text-black">On Sale</Link>
              <Link to="/new-arrivals" className="text-gray-700 hover:text-black">New Arrivals</Link>
              <Link to="/brands" className="text-gray-700 hover:text-black">Brands</Link>
            </nav>

            <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchInputKeyDown}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-none outline-none focus:ring-2 focus:ring-black"
                />
              </form>
            </div>

            <div className="flex items-center space-x-4">
              <button
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Search size={24} />
              </button>

              <Link to="/cart" className="relative p-2">
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <div className="relative">
                <button
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => {
                    if (isAuthenticated) {
                      setIsUserDropdownOpen(!isUserDropdownOpen);
                    } else {
                      openAuthModal('login');
                    }
                  }}
                >
                  <User size={24} />
                </button>

                {isAuthenticated && isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-black">{user?.firstName} {user?.lastName}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          navigate('/orders');
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                      >
                        My Orders
                      </button>
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          navigate('/account');
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                      >
                        Account Settings
                      </button>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchInputKeyDown}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-none outline-none focus:ring-2 focus:ring-black"
                />
              </form>
              <nav className="space-y-4">
                <Link to="/category/casual" className="block text-gray-700 hover:text-black">Shop</Link>
                <Link to="/sale" className="block text-gray-700 hover:text-black">On Sale</Link>
                <Link to="/new-arrivals" className="block text-gray-700 hover:text-black">New Arrivals</Link>
                <Link to="/brands" className="block text-gray-700 hover:text-black">Brands</Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {isUserDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserDropdownOpen(false)}
        />
      )}
    </>
  );
}
