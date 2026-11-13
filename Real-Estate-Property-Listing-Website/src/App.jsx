import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
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
const Agents = L(() => import('./pages/Agents'))
const AgentDetails = L(() => import('./pages/AgentDetails'))
const About = L(() => import('./pages/About'))
const Contact = L(() => import('./pages/Contact'))
const Wishlist = L(() => import('./pages/Wishlist'))
const ListProperty = L(() => import('./pages/ListProperty'))
const Login = L(() => import('./pages/Auth/Login'))
const Register = L(() => import('./pages/Auth/Register'))
const ForgotPassword = L(() => import('./pages/Auth/ForgotPassword'))
const Dashboard = L(() => import('./pages/Admin/Dashboard'))
const AdminProperties = L(() => import('./pages/Admin/Properties'))
const PropertyEdit = L(() => import('./pages/Admin/PropertyEdit'))
const AdminProjects = L(() => import('./pages/Admin/Projects'))
const AdminAgents = L(() => import('./pages/Admin/Agents'))
const AdminInquiries = L(() => import('./pages/Admin/Inquiries'))
const AdminAppointments = L(() => import('./pages/Admin/Appointments'))
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
          <Route path="agents" element={<Agents />} />
          <Route path="agents/:id" element={<AgentDetails />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="list-property" element={<ListProperty />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="properties/new" element={<PropertyEdit />} />
          <Route path="properties/:id/edit" element={<PropertyEdit />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="agents" element={<AdminAgents />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
