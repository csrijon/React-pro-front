import { img } from './images.js';

export const featuredIn = ['AD', 'ELLE DECOR', 'Livingetc', 'houzz', 'Dezeen'];

export const stats = [
  { value: 120, suffix: '+', label: 'Projects delivered' },
  { value: 50, suffix: '+', label: 'Happy clients' },
  { value: 12, suffix: '+', label: 'Design awards' },
];

export const testimonials = [
  { id: 't1', name: 'Ananya & Rahul Mehta', role: 'Lakeside Villa', quote: 'Domus listened more than they talked, and the house reflects that. It feels like us, only calmer.' },
  { id: 't2', name: 'Vikram Shah', role: 'Creative Office', quote: 'Attendance went up the month we moved in. People actually want to be in the space.' },
  { id: 't3', name: 'Priya Nair', role: 'Boutique Hotel', quote: 'Guests ask who designed the rooms before they ask about the beach. That says it all.' },
];

export const philosophy = [
  { title: 'Light first', text: 'We plan around daylight and layer artificial light so every room feels alive at any hour.' },
  { title: 'Honest materials', text: 'Timber, stone, lime and linen — materials that age gracefully and feel good to touch.' },
  { title: 'Built to be lived in', text: 'Beautiful is not enough. Spaces must be comfortable, practical and personal.' },
];

export const values = ['Client-centric', 'Detail driven', 'Sustainable design'];

export const processSteps = [
  { title: 'Discover', text: 'We visit, listen and understand how you live or work.' },
  { title: 'Concept', text: 'Mood boards, layouts and a clear design direction.' },
  { title: 'Develop', text: 'Detailed drawings, materials and a transparent budget.' },
  { title: 'Deliver', text: 'On-site supervision through to final styling.' },
];

export const social = [
  img('livingA', 600), img('bedroomA', 600), img('lamp', 600), img('interiorE', 600), img('chair', 600), img('dining', 600),
];

export const PROJECT_TYPES = ['Residential', 'Commercial', 'Hospitality', 'Retail', 'Office', 'Consultation'];
export const BUDGETS = ['Under ₹10 lakh', '₹10–25 lakh', '₹25–50 lakh', '₹50 lakh – 1 crore', 'Above ₹1 crore'];
export const INQUIRY_STATUSES = ['New', 'In Progress', 'Contacted', 'Completed', 'Rejected'];

const ago = (d) => new Date(Date.now() - d * 864e5).toISOString();

export const seedInquiries = [
  { id: 'i1', name: 'Rohan Mitra', email: 'rohan.mitra@gmail.com', phone: '+91 98765 11122', projectType: 'Residential', location: 'Kolkata', budget: '₹25–50 lakh', area: '2400', message: 'Looking to redesign our 3BHK. We love the Lakeside Villa palette.', status: 'New', notes: '', createdAt: ago(0.1) },
  { id: 'i2', name: 'Sneha Das', email: 'sneha.das@gmail.com', phone: '+91 98300 22233', projectType: 'Commercial', location: 'Bengaluru', budget: '₹50 lakh – 1 crore', area: '6000', message: 'New clinic fit-out for 6000 sq ft. Timeline is 4 months.', status: 'In Progress', notes: 'Call booked for Friday.', createdAt: ago(1) },
  { id: 'i3', name: 'Amit Roy', email: 'amit.roy@gmail.com', phone: '+91 99030 33344', projectType: 'Residential', location: 'Mumbai', budget: '₹10–25 lakh', area: '1500', message: 'Apartment interiors, need help with storage and lighting.', status: 'Contacted', notes: '', createdAt: ago(2) },
  { id: 'i4', name: 'Kavya Iyer', email: 'kavya@brightcafe.in', phone: '+91 90000 44455', projectType: 'Hospitality', location: 'Pune', budget: '₹10–25 lakh', area: '1200', message: 'Opening a café in Q2. Need concept and fit-out.', status: 'Completed', notes: 'Proposal accepted.', createdAt: ago(6) },
  { id: 'i5', name: 'Nikhil Verma', email: 'nikhil.v@gmail.com', phone: '+91 91234 55566', projectType: 'Retail', location: 'Delhi', budget: 'Under ₹10 lakh', area: '700', message: 'Small boutique. Budget is tight.', status: 'Rejected', notes: 'Outside budget range.', createdAt: ago(9) },
];

export const seedMedia = [
  'livingA', 'livingB', 'livingC', 'livingD', 'bedroomA', 'officeA', 'hotelA', 'retail', 'lamp', 'chair',
].map((k, i) => ({ id: `m${i + 1}`, name: `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}.jpg`, url: img(k, 1000), type: 'jpg', size: 180000 + i * 23000, createdAt: ago(i + 1) }));

export const seedPages = {
  home: {
    heroHeading: 'Spaces That Reflect Your Story',
    heroText: 'Bespoke interior design solutions for homes, offices and lifestyle spaces.',
    heroImage: img('livingA', 1400),
    heroImage2: img('interiorD', 600),
    eyebrow: 'Interior design studio',
    primaryButton: 'Explore Work',
    secondaryButton: 'Consultation',
    featuredLabel: 'Featured in',
    featuredIn: featuredIn,
    introHeading: 'Designing timeless interiors',
    introText: 'We create meaningful spaces that blend aesthetics, comfort and functionality. Every project begins by listening — to the site, the light and the people who will live there.',
    introLink: 'Our story',
    stats,
    projectsHeading: 'Selected projects',
    projectsLink: 'View all projects',
    servicesHeading: 'What we do',
    servicesText: 'From first sketch to final styling, we cover every layer of an interior.',
    servicesButton: 'All services',
    showreel: { heading: 'Studio showreel', text: 'A short look at our recent work.', url: '', poster: '' },
    philosophyHeading: 'Our design philosophy',
    philosophyImage: img('dining', 1000),
    philosophy,
    testimonialsHeading: 'In our clients’ words',
    testimonials,
    instagramHeading: 'On Instagram',
    instagramHandle: '@domusstudio',
    social,
    ctaHeading: 'Let’s design a space that feels like you',
    ctaText: 'Tell us about your project and we will reply within two working days.',
    seoTitle: 'Domus Studio — Interior Design Studio', seoDescription: 'Bespoke residential, commercial and hospitality interior design.',
  },
  about: {
    heading: 'About Domus Studio',
    intro: 'A design studio passionate about creating functional, beautiful and timeless interiors for modern living.',
    image: img('dining', 1200),
    storyHeading: 'Our story',
    story: 'Domus Studio began in 2013 with a small team and a simple idea: interiors should be calm, functional and personal. Today we are a team of designers working across India.',
    values,
    missionHeading: 'Mission',
    mission: 'To create meaningful spaces that blend aesthetics, comfort and functionality.',
    visionHeading: 'Vision',
    vision: 'To be the most trusted name in thoughtful, timeless interior design.',
    philosophyHeading: 'Design philosophy',
    philosophy,
    processHeading: 'Our process',
    process: processSteps,
    stats,
    teamHeading: 'The team',
    teamLink: 'Meet everyone',
    seoTitle: 'About — Domus Studio', seoDescription: 'Our story, philosophy and team.',
  },
  contact: {
    heading: 'Get in touch',
    text: 'Have a project in mind? Tell us about it and we’ll show how we can bring it to life.',
    formHeading: 'Project inquiry',
    email: 'hello@domusstudio.in', phone: '+91 98765 43210', address: 'Kolkata, West Bengal, India',
    showMap: true, mapUrl: '',
    seoTitle: 'Contact — Domus Studio', seoDescription: 'Start a project with Domus Studio.',
  },
  projectsPage: {
    heading: 'Our Projects',
    text: 'A curated collection of spaces we’ve designed, from private homes to hotels and workplaces.',
    detailCtaHeading: 'Planning something like {title}?',
    detailCtaText: 'Share a few details and we’ll suggest where to begin.',
    seoTitle: 'Projects — Domus Studio', seoDescription: 'A curated collection of residential, commercial and hospitality interiors by Domus Studio.',
  },
  servicesPage: {
    heading: 'Our Services',
    text: 'End-to-end interior design, tailored to your space and the way you live.',
    seoTitle: 'Services — Domus Studio', seoDescription: 'Residential, commercial, lighting and furniture design services from Domus Studio.',
  },
  designersPage: {
    heading: 'Meet Our Designers',
    text: 'The creative minds behind our most inspiring spaces — architects, makers and storytellers.',
    ctaHeading: 'Work with the team',
    ctaText: 'Book a consultation and we will match you with the right designer.',
    ctaLabel: 'Book a consultation',
    seoTitle: 'Designers — Domus Studio', seoDescription: 'Meet the designers behind Domus Studio.',
  },
  site: {
    nav: [
      { label: 'Home', to: '/', visible: true }, { label: 'Projects', to: '/projects', visible: true }, { label: 'Services', to: '/services', visible: true },
      { label: 'Designers', to: '/designers', visible: true }, { label: 'About', to: '/about', visible: true }, { label: 'Contact', to: '/contact', visible: true },
    ],
    ctaLabel: 'Start a Project',
    footerTagline: 'Spaces that reflect your story, crafted with light, material and care.',
    footerExploreHeading: 'Explore',
    footerStudioHeading: 'Studio',
    copyright: 'Domus Studio. All rights reserved.',
    categories: ['Residential', 'Commercial', 'Hospitality', 'Retail', 'Office'],
    projectTypes: PROJECT_TYPES,
    budgets: BUDGETS,
  },
};

export const THEME_FONTS = {
  heading: ['Cormorant Garamond', 'Playfair Display', 'Lora', 'Fraunces', 'Libre Baskerville', 'DM Serif Display'],
  body: ['Manrope', 'Inter', 'DM Sans', 'Work Sans', 'Nunito Sans'],
};

export const DEFAULT_THEME = {
  primary: '#173D2E', background: '#F5F0E7', accent: '#A7B49B', warm: '#D8C8B4',
  headingFont: 'Cormorant Garamond', bodyFont: 'Manrope',
};

export const seedSettings = {
  profile: { name: 'Admin', email: 'admin@domusstudio.in' },
  logo: '',
  favicon: '',
  contact: { email: 'hello@domusstudio.in', phone: '+91 98765 43210', address: 'Kolkata, West Bengal, India' },
  social: { instagram: 'https://instagram.com', facebook: 'https://facebook.com', pinterest: 'https://pinterest.com', linkedin: 'https://linkedin.com' },
  seo: { title: 'Domus Studio — Interior Design', description: 'Bespoke residential, commercial and hospitality interior design.' },
  theme: DEFAULT_THEME,
};
