import './App.css';
import { Route, Routes } from 'react-router-dom'
// import Shop from './pages/shop/Shop'
import Shop from './pages/shop/Shop'
import Home from './pages/home/Home'
import Register from './pages/register/Register'
import 'react-toastify/dist/ReactToastify.css' // Don't forget the styles
import { ToastContainer } from 'react-toastify';
import BodyIcons from './components/common/bodyicons/BodyIcons'
import CookieBanner from './components/cookies/CookieBanner';
import ProductsUpload from './pages/productsupload/ProductsUpload';
import ProductDetails from './pages/productdetails/ProductDetails';
import ShoppingCart from './components/shoppingcart/ShoppingCart';
import { useAuth } from './contexts/AuthProvider';
import { AnimatePresence } from 'framer-motion';
import WishList from './components/wishlist/WishList';
import SearchBar from './components/searchbar/SearchBar';

function App() {

  // Get the shopping cart state from the Auth Provider in order to display the shopping cart when 
  // the shoppping cart icon is clicked
  const { showCart, showWish, showSearch } = useAuth()

  return (
    <div className="App">
      <Routes>
        <Route path={'/'} element={<Shop />} />
        <Route path={'/home'} element={<Home />} />
        <Route path={'/register'} element={<Register />} />
        <Route path={'/productsupload'} element={<ProductsUpload />} />
        <Route path='/productdetails/:id' element={<ProductDetails />} />
      </Routes>

      <AnimatePresence>
        { showCart && (
          <ShoppingCart key="shop" />
        )}

        { showWish && (
          <WishList key="wish" />
        )}

        { showSearch && (
          <SearchBar key="search" />
        )}
        
        <CookieBanner key="cookie" />
      </AnimatePresence>
      
      <BodyIcons />
      <ToastContainer position="bottom-left" autoClose={3000} />
    </div>
  );
}

export default App;
