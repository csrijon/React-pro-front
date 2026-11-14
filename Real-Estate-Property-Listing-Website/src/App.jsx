import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import { PageLoader } from './components/common/States'

const L = (f) => lazy(f)
const Properties = L(() => import('./pages/Properties'))
const PropertyDetails = L(() => import('./pages/PropertyDetails'))
const Projects = L(() => import('./pages/Projects'))
const ProjectDetails = L(() => import('./pages/ProjectDetails'))
const About = L(() => import('./pages/About'))
const Contact = L(() => import('./pages/Contact'))
const Wishlist = L(() => import('./pages/Wishlist'))
const ListProperty = L(() => import('./pages/ListProperty'))
const Login = L(() => import('./pages/Auth/Login'))
const Register = L(() => import('./pages/Auth/Register'))
const ResetPassword = L(() => import('./pages/Auth/ResetPassword'))
const Blog = L(() => import('./pages/Blog'))
const Post = L(() => import('./pages/Blog/Post'))
const Faq = L(() => import('./pages/Faq'))
const AdminBlog = L(() => import('./pages/Admin/Blog'))
const AdminActivity = L(() => import('./pages/Admin/ActivityLog'))
const AdminContent = L(() => import('./pages/Admin/Content'))
const Emi = L(() => import('./pages/Emi'))
const Compare = L(() => import('./pages/Compare'))
const Account = L(() => import('./pages/Account'))
const AdminSubmissions = L(() => import('./pages/Admin/Submissions'))
const ForgotPassword = L(() => import('./pages/Auth/ForgotPassword'))
const Dashboard = L(() => import('./pages/Admin/Dashboard'))
const AdminProperties = L(() => import('./pages/Admin/Properties'))
const AdminProfile = L(() => import('./pages/Admin/Profile'))
const AdminProjects = L(() => import('./pages/Admin/Projects'))
const AdminInquiries = L(() => import('./pages/Admin/Inquiries'))
const AdminAppointments = L(() => import('./pages/Admin/Appointments'))
const AdminTeam = L(() => import('./pages/Admin/Team'))
const AdminReviews = L(() => import('./pages/Admin/Reviews'))
const AdminCustomers = L(() => import('./pages/Admin/Customers'))
const AdminUsers = L(() => import('./pages/Admin/Users'))
const AdminSettings = L(() => import('./pages/Admin/Settings'))

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/:id" element={<PropertyDetails />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          {/* The Agents pages were removed: the company is the single contact. Old links land on the About page, where the team is shown. */}
          <Route path="agents/*" element={<Navigate to="/about" replace />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<Post />} />
          <Route path="faq" element={<Faq />} />
          <Route path="emi-calculator" element={<Emi />} />
          <Route path="compare" element={<Compare />} />
          <Route path="account" element={<Account />} />
          <Route path="list-property" element={<ListProperty />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="team" element={<AdminTeam />} />
          <Route path="activity" element={<AdminActivity />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
