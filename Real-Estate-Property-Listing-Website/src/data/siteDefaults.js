// Default website content. The owner edits all of this from Admin → Settings; anything not saved falls back to these values.
export const FONT_CHOICES = ['Poppins', 'Inter', 'Montserrat', 'Playfair Display', 'Lora', 'Roboto', 'Open Sans', 'Nunito', 'DM Sans', 'Merriweather', 'Raleway', 'Work Sans']
export const SITE_DEFAULTS = {
  company: 'EstateHub',
  tagline: 'Verified properties and projects you can trust.',
  logo: '',
  favicon: '',
  showNameWithLogo: true,
  fonts: { heading: 'Poppins', body: 'Inter' },
  currency: { symbol: '₹', system: 'indian' },
  email: 'support@estatehub.com',
  phone: '+91 98765 43210',
  address: 'New Town, Kolkata, West Bengal 700156',
  workingHours: 'Mon – Sat: 9:00 AM – 7:00 PM',
  notify: true,
  social: { facebook: '', instagram: '', twitter: '', linkedin: '', youtube: '' },
  theme: { primary: '#063E2F', accent: '#267032' },
  hero: { title: 'Find Your Dream Property', subtitle: 'Explore verified properties for sale, rent and investment across prime locations.', image: '' },
  stats: [{ value: '10K+', label: 'Properties' }, { value: '5K+', label: 'Happy clients' }, { value: '150+', label: 'Verified listings' }, { value: '50+', label: 'Cities' }],
  about: {
    subtitle: 'Your trusted partner in finding the right property.',
    heading: 'We make real estate simple, transparent, and accessible for everyone.',
    intro: 'EstateHub is a modern real estate platform connecting buyers, sellers and investors with verified properties and a team that knows the neighbourhoods. We combine local expertise with clear information so you can decide with confidence.',
    story: 'EstateHub began in 2016 with a simple frustration: finding a home meant juggling brokers, outdated listings and unclear prices. We built a platform where every listing is verified, every price is visible and every agent is accountable.\n\nToday we serve thousands of families, investors and businesses across 50+ cities, with a team that still answers the phone.',
    mission: 'To make property decisions easy and trustworthy through verified information and expert guidance.',
    vision: 'To be the most trusted real estate platform in India, where every transaction feels fair.',
    image: '',
  },
  nav: [{ label: 'Home', to: '/' }, { label: 'Properties', to: '/properties' }, { label: 'Projects', to: '/projects' }, { label: 'About', to: '/about' }, { label: 'Blog', to: '/blog' }, { label: 'Contact', to: '/contact' }],
  footerLinks: [{ label: 'Home', to: '/' }, { label: 'Properties', to: '/properties' }, { label: 'Projects', to: '/projects' }, { label: 'About us', to: '/about' }, { label: 'Guides', to: '/blog' }, { label: 'FAQ', to: '/faq' }, { label: 'EMI calculator', to: '/emi-calculator' }, { label: 'Compare', to: '/compare' }, { label: 'Contact', to: '/contact' }],
  home: {
    sections: [{ id: 'featured', visible: true }, { id: 'why', visible: true }, { id: 'projects', visible: true }, { id: 'testimonials', visible: true }, { id: 'cta', visible: true }],
    featuredTitle: 'Featured properties', projectsTitle: 'Featured projects', testimonialsTitle: 'What our clients say',
    whyTitle: 'Why choose {company}', whyIntro: 'We take the guesswork out of property searches.',
    whyCards: [
      { title: 'Verified listings', text: 'Every listing is checked for ownership and accuracy before it goes live.' },
      { title: 'Expert team', text: 'Work with advisors who know their neighbourhoods inside out.' },
      { title: 'Transparent process', text: 'Clear pricing, documents and timelines from first visit to registration.' },
      { title: 'Customer support', text: 'Reach a real person by phone or WhatsApp, six days a week.' },
    ],
    cta: { title: 'Have a property to sell or rent?', text: 'List it with {company} and reach thousands of verified buyers and tenants.', button: 'List your property' },
  },
  pages: {
    login: { title: 'Log in', subtitle: 'Welcome back to {company}.', sideTitle: 'Your next address, verified.', sideText: 'Save listings, book visits and track enquiries in one place.' },
    register: { title: 'Create account', subtitle: 'Save properties and track your enquiries.' },
    listProperty: { title: 'List your property', subtitle: 'Fill in the form below. We review every submission before it goes live.', privacy: 'Your name, phone number and email stay private. Buyers contact {company}, and our team coordinates with you.' },
  },
  options: {
    propertyTypes: ['Apartment', 'Villa', 'Builder Floor', 'Plot', 'Commercial'],
    furnishing: ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'],
    amenities: ['Swimming Pool', 'Gymnasium', 'Clubhouse', '24x7 Security', 'Power Backup', 'Lift', 'Covered Parking', 'Children Play Area', 'Landscaped Garden', 'CCTV Surveillance', 'Jogging Track', 'Intercom'],
    timeSlots: ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'],
  },
  footer: { about: 'EstateHub connects buyers, tenants and investors with verified properties, trusted projects and an experienced team across India.' },
  seo: { description: 'Browse verified apartments, villas, plots and commercial spaces for sale and rent. Explore projects and talk to a team you can trust.' },
}

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v)
/** Fills anything missing from `value` with the defaults (objects merge recursively; arrays are replaced whole). */
export function withDefaults(value, defaults = SITE_DEFAULTS) {
  const v = isObj(value) ? value : {}
  return Object.fromEntries(Object.entries(defaults).map(([k, d]) => [k, isObj(d) ? withDefaults(v[k], d) : v[k] ?? d]))
}

// Starting set of team roles. The owner adds, renames and removes roles from Admin → Team.
export const DEFAULT_TEAM_ROLES = ['Founder', 'Sales Manager', 'Property Consultant', 'Site Supervisor', 'Customer Support']
