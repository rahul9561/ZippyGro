import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Herosection';
import Navbar from './components/Navbar';
import Footer from './components/footer';
import CartPage from './components/Home/Cart';
import About from './components/about/About';
import Contact from './components/contact/Contact';
import Shop from './components/shop/Shop';
import  { ThemeProvider } from './components/project/Findcurrent'
import Checkout from './components/shop/Checkout';
import Search from './components/Search/Search';
import { useState } from 'react';
import Categories from './components/categories/Categories';

function App() {
  let handleSearch;
    const [searchQuery, setSearchQuery] = useState("");
  return (
    <BrowserRouter>
     <ThemeProvider>
     <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} />
      <div className="min-h-screen">
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="*"  element={<div>page not found  <Link to="/" className='text-red-400'>Back To Home</Link> </div>} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" exact element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/search" element={<Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} />} />
        </Routes>
      </div>
      <Footer />
      </ThemeProvider>

    </BrowserRouter>
  );
}

export default App;
