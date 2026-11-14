import { avatar } from './images.js'

export const testimonials = [
  { id: 't1', name: 'Rahul & Anjali Mehta', role: 'Bought a 3 BHK in New Town', avatar: avatar('men', 41), rating: 5, text: 'We compared dozens of listings in one evening. Every detail was accurate, and our agent never pushed us. We moved in within two months.' },
  { id: 't2', name: 'Sneha Banerjee', role: 'Rented in Salt Lake', avatar: avatar('women', 65), rating: 5, text: 'The verified badge made me trust the listing. The flat looked exactly like the photos and the agreement was ready in a day.' },
  { id: 't3', name: 'Karan Malhotra', role: 'Investor, Rajarhat', avatar: avatar('men', 22), rating: 5, text: 'Project details, payment plans and RERA numbers are all in one place. That saved me weeks of research.' },
  { id: 't4', name: 'Dr. Sunita Rao', role: 'Bought a villa in Behala', avatar: avatar('women', 17), rating: 4, text: 'Great experience overall. Site visits were arranged quickly and the team followed up after the sale.' },
]

export const inquiries = [
  { id: 'q1', name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 98300 11122', property: '3 BHK Luxury Apartment', message: 'Is this still available? I would like to visit this weekend.', status: 'New', createdAt: '2026-11-12T10:20:00' },
  { id: 'q2', name: 'Sneha Das', email: 'sneha.das@example.com', phone: '+91 98310 44455', property: '2 BHK Apartment', message: 'Can the rent be negotiated for a 2 year agreement?', status: 'Contacted', createdAt: '2026-11-12T08:05:00' },
  { id: 'q3', name: 'Amit Mondal', email: 'amit.m@example.com', phone: '+91 97490 88810', property: '4 BHK Villa', message: 'Please share the floor plan and payment schedule.', status: 'New', createdAt: '2026-11-11T17:40:00' },
  { id: 'q4', name: 'Priya Nair', email: 'priya.n@example.com', phone: '+91 90070 66321', property: 'The Green Heights', message: 'Interested in a 3 BHK. What is the possession timeline?', status: 'Converted', createdAt: '2026-11-10T12:00:00' },
  { id: 'q5', name: 'Vikash Gupta', email: 'vikash.g@example.com', phone: '+91 98000 34567', property: 'Commercial Office Space', message: 'Need space for 25 people. Is a 3 year lock-in required?', status: 'Contacted', createdAt: '2026-11-09T15:30:00' },
  { id: 'q6', name: 'Moumita Paul', email: 'moumita.p@example.com', phone: '+91 98311 90012', property: '2 BHK Builder Floor', message: 'Is a home loan available for this property?', status: 'New', createdAt: '2026-11-09T09:15:00' },
  { id: 'q7', name: 'Anirban Roy', email: 'anirban.r@example.com', phone: '+91 98748 21190', property: 'Residential Plot – 5 Cottah', message: 'Could you send the title documents?', status: 'Closed', createdAt: '2026-11-05T11:00:00' },
  { id: 'q8', name: 'Tanvi Shah', email: 'tanvi.s@example.com', phone: '+91 97480 55600', property: 'Skyline Residency', message: 'Do you have any ready-to-move 3 BHK units?', status: 'New', createdAt: '2026-11-04T16:45:00' },
]

export const appointments = [
  { id: 'ap1', name: 'Rahul Sharma', phone: '+91 98300 11122', property: '3 BHK Luxury Apartment', date: '2026-11-15', time: '11:00', status: 'Confirmed' },
  { id: 'ap2', name: 'Moumita Paul', phone: '+91 98311 90012', property: '2 BHK Builder Floor', date: '2026-11-16', time: '15:30', status: 'Pending' },
  { id: 'ap3', name: 'Vikash Gupta', phone: '+91 98000 34567', property: 'Commercial Office Space', date: '2026-11-17', time: '10:00', status: 'Confirmed' },
  { id: 'ap4', name: 'Tanvi Shah', phone: '+91 97480 55600', property: 'Skyline Residency', date: '2026-11-18', time: '12:30', status: 'Pending' },
  { id: 'ap5', name: 'Amit Mondal', phone: '+91 97490 88810', property: '4 BHK Villa', date: '2026-11-10', time: '16:00', status: 'Completed' },
]

export const customers = [
  { id: 'c1', name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 98300 11122', joined: '2026-08-10', saved: 4 },
  { id: 'c2', name: 'Sneha Das', email: 'sneha.das@example.com', phone: '+91 98310 44455', joined: '2026-08-21', saved: 7 },
  { id: 'c3', name: 'Amit Mondal', email: 'amit.m@example.com', phone: '+91 97490 88810', joined: '2026-09-02', saved: 2 },
  { id: 'c4', name: 'Priya Nair', email: 'priya.n@example.com', phone: '+91 90070 66321', joined: '2026-09-15', saved: 9 },
  { id: 'c5', name: 'Vikash Gupta', email: 'vikash.g@example.com', phone: '+91 98000 34567', joined: '2026-10-01', saved: 1 },
]

export const users = [
  { id: 'u1', name: 'Admin User', email: 'admin@estatehub.com', role: 'Admin', status: 'Active' },
  { id: 'u2', name: 'Pallavi Roy', email: 'pallavi@estatehub.com', role: 'Editor', status: 'Active' },
  { id: 'u3', name: 'Arindam Sen', email: 'arindam@estatehub.com', role: 'Editor', status: 'Active' },
  { id: 'u4', name: 'Content Editor', email: 'editor@estatehub.com', role: 'Editor', status: 'Inactive' },
]

export const viewsSeries = [
  { day: '1', views: 820 }, { day: '3', views: 940 }, { day: '5', views: 880 }, { day: '7', views: 1180 },
  { day: '9', views: 1050 }, { day: '11', views: 1320 }, { day: '13', views: 1240 }, { day: '15', views: 1560 },
  { day: '17', views: 1480 }, { day: '19', views: 1710 }, { day: '21', views: 1640 }, { day: '23', views: 1920 },
  { day: '25', views: 1850 }, { day: '27', views: 2140 }, { day: '30', views: 2310 },
]

export const cities = ['Kolkata', 'Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai']
export const propertyTypes = ['Apartment', 'Villa', 'Builder Floor', 'Plot', 'Commercial']
export const furnishingOptions = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished']
export const propertyStatuses = ['Ready to Move', 'Under Construction']
export const amenityOptions = ['Swimming Pool', 'Gymnasium', 'Clubhouse', '24x7 Security', 'Power Backup', 'Lift', 'Covered Parking', 'Children Play Area', 'Landscaped Garden', 'CCTV Surveillance', 'Jogging Track', 'Intercom']
