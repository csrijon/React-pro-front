import { Link, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Account, { AuthRoute } from './pages/Account.jsx';
import { Brands, Categories } from './pages/Brands.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import AdminLogin from './admin/AdminLogin.jsx';
import Dashboard from './admin/Dashboard.jsx';
import AdminProducts from './admin/Products.jsx';
import ProductForm from './admin/ProductForm.jsx';
import AdminCategories from './admin/Categories.jsx';
import AdminBrands from './admin/Brands.jsx';
import Customers from './admin/Customers.jsx';
import Inventory from './admin/Inventory.jsx';
import StockHistory from './admin/StockHistory.jsx';
import Reorder from './admin/Reorder.jsx';
import Featured from './admin/Featured.jsx';
import Settings from './admin/Settings.jsx';
import Profile from './admin/Profile.jsx';
import { Empty } from './components/ui.jsx';

const NotFound = () => <div className="container page"><Empty title="Page not found">The page you are looking for does not exist. <Link to="/">Go to the homepage</Link></Empty></div>;

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:gender" element={<Products />} />
        <Route path="products/:gender/:category" element={<Products />} />
        <Route path="category/:gender" element={<Products />} />
        <Route path="category/:gender/:category" element={<Products />} />
        <Route path="product/:slug" element={<ProductDetail />} />
        <Route path="brands" element={<Brands />} />
        <Route path="categories" element={<Categories />} />
        <Route path="login" element={<AuthRoute mode="login" />} />
        <Route path="register" element={<AuthRoute mode="register" />} />
        <Route path="account" element={<Account />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/:id" element={<ProductForm />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="brands" element={<AdminBrands />} />
        <Route path="customers" element={<Customers />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="stock-history" element={<StockHistory />} />
        <Route path="reorder" element={<Reorder />} />
        <Route path="featured" element={<Featured />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
