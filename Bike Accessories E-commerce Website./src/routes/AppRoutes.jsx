import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import ProtectedRoute from './ProtectedRoute'

const Home = lazy(() => import('../pages/Home/Home'))
const Shop = lazy(() => import('../pages/Shop/Shop'))
const Category = lazy(() => import('../pages/Category/Category'))
const ProductDetails = lazy(() => import('../pages/ProductDetails/ProductDetails'))
const Cart = lazy(() => import('../pages/Cart/Cart'))
const Checkout = lazy(() => import('../pages/Checkout/Checkout'))
const OrderSuccess = lazy(() => import('../pages/Checkout/OrderSuccess'))
const Login = lazy(() => import('../pages/Authentication/Login'))
const Register = lazy(() => import('../pages/Authentication/Register'))
const ForgotPassword = lazy(() => import('../pages/Authentication/ForgotPassword'))
const ResetPassword = lazy(() => import('../pages/Authentication/ResetPassword'))
const AccountLayout = lazy(() => import('../pages/Account/AccountLayout'))
const Dashboard = lazy(() => import('../pages/Account/Dashboard'))
const Profile = lazy(() => import('../pages/Account/Profile'))
const Orders = lazy(() => import('../pages/Account/Orders'))
const OrderDetails = lazy(() => import('../pages/Account/OrderDetails'))
const AccountWishlist = lazy(() => import('../pages/Account/Wishlist'))
const Addresses = lazy(() => import('../pages/Account/Addresses'))
const About = lazy(() => import('../pages/About/About'))
const Contact = lazy(() => import('../pages/Contact/Contact'))
const Blog = lazy(() => import('../pages/Blog/Blog'))
const BlogDetails = lazy(() => import('../pages/Blog/BlogDetails'))
const Brands = lazy(() => import('../pages/Brands/Brands'))
const BrandDetails = lazy(() => import('../pages/Brands/BrandDetails'))
const FAQ = lazy(() => import('../pages/Policies/FAQ'))
const Policy = lazy(() => import('../pages/Policies/Policy'))
const NotFound = lazy(() => import('../pages/NotFound'))

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="category/:slug" element={<Category />} />
        <Route path="product/:slug" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-success" element={<OrderSuccess />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />

        <Route path="account" element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="wishlist" element={<AccountWishlist />} />
          <Route path="addresses" element={<Addresses />} />
        </Route>

        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogDetails />} />
        <Route path="brands" element={<Brands />} />
        <Route path="brands/:slug" element={<BrandDetails />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="shipping-policy" element={<Policy slug="shipping-policy" />} />
        <Route path="return-policy" element={<Policy slug="return-policy" />} />
        <Route path="privacy-policy" element={<Policy slug="privacy-policy" />} />
        <Route path="terms" element={<Policy slug="terms" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
