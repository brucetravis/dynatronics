import "./App.css";
import { Route, Routes } from "react-router-dom";
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
import { AnimatePresence } from 'framer-motion';
import WishList from './components/wishlist/WishList';
import SearchBar from './components/searchbar/SearchBar';
import { useShop } from './contexts/ShopProvider';
import { useWish } from './contexts/WishListProvider';
import { useSearch } from './contexts/SearchProvider';
import Payment from './pages/payment/Payment';
import About from './pages/about/About';
import CategoryDetails from './pages/categorydetails/CategoryDetails';
import NotFound from './pages/notfound/NotFound'

function App() {
  // Get the shopping cart state from the ShopProvider in order to display the shopping cart when
  // the shoppping cart icon is clicked
  const { showCart } = useShop();

  // Get the WishList state from the WishListProvider to display the WishList
  const { showWish } = useWish();

  // Get the Search bar state for the SearchProvider to display the searchBar
  const { showSearch } = useSearch();

  return (
    <div className="App">
      <Routes>
        <Route path={'/'} element={<Shop />} />
        <Route path={'/home'} element={<Home />} />
        <Route path={'/about'} element={<About />} />
        <Route path={'/register'} element={<Register />} />
        <Route path={'/payment/:userId'} element={<Payment />} />
        <Route path={'/productsupload'} element={<ProductsUpload />} />
        <Route path='/productdetails/:id' element={<ProductDetails />} />
        <Route path='/categorydetails/:categoryName' element={<CategoryDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <AnimatePresence>
        {showCart && <ShoppingCart key="shop" />}

        {showWish && <WishList key="wish" />}

        {showSearch && <SearchBar key="search" />}

        <CookieBanner key="cookie" />
      </AnimatePresence>

      <BodyIcons />
      <ToastContainer position="bottom-left" autoClose={3000} />
    </div>
);
}

export default App;
