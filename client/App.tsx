import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store';
import Header from './components/Header';
import Footer from './components/Footer';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import SearchResults from "./pages/SearchResults";
import OnSale from "./pages/OnSale";
import Brands from "./pages/Brands";
import NewArrivals from "./pages/NewArrivals";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderReview from "./pages/OrderReview";
import Placeholder from "./pages/Placeholder";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
  </div>
);

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/payment" element={<Payment />} />
              <Route path="/checkout/review" element={<OrderReview />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/sale" element={<OnSale />} />
              <Route path="/new-arrivals" element={<NewArrivals />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/about" element={<Placeholder title="About" />} />
              <Route path="/features" element={<Placeholder title="Features" />} />
              <Route path="/works" element={<Placeholder title="Works" />} />
              <Route path="/career" element={<Placeholder title="Career" />} />
              <Route path="/support" element={<Placeholder title="Customer Support" />} />
              <Route path="/delivery" element={<Placeholder title="Delivery Details" />} />
              <Route path="/terms" element={<Placeholder title="Terms & Conditions" />} />
              <Route path="/privacy" element={<Placeholder title="Privacy Policy" />} />
              <Route path="/account" element={<Placeholder title="Account" />} />
              <Route path="/manage-deliveries" element={<Placeholder title="Manage Deliveries" />} />
              <Route path="/orders" element={<Placeholder title="Orders" />} />
              <Route path="/payments" element={<Placeholder title="Payments" />} />
              <Route path="/ebooks" element={<Placeholder title="Free eBooks" />} />
              <Route path="/tutorial" element={<Placeholder title="Development Tutorial" />} />
              <Route path="/blog" element={<Placeholder title="How to - Blog" />} />
              <Route path="/youtube" element={<Placeholder title="Youtube Playlist" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

createRoot(document.getElementById("root")!).render(<App />);
