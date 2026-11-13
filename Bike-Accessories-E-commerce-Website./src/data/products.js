import { categories } from './categories'

// Compact catalog definition -> expanded into full product objects below.
// [name, brand, category, price, mrp, rating, reviews, art, colorKey, flags]  flags: b=bestseller n=new t=trending o=out-of-stock
const PALETTE = {
  red: { name: 'Racing Red', hex: '#EF252B' },
  black: { name: 'Matte Black', hex: '#3a3f47' },
  white: { name: 'Pearl White', hex: '#e8eaed' },
  blue: { name: 'Electric Blue', hex: '#2f7bff' },
  orange: { name: 'Blaze Orange', hex: '#ff7a1a' },
  yellow: { name: 'Hi-Vis Yellow', hex: '#f5d90a' },
  green: { name: 'Forest Green', hex: '#2fa66a' },
  grey: { name: 'Gunmetal Grey', hex: '#7b8794' },
}
const COLOR_SETS = {
  red: ['red', 'black', 'white'], black: ['black', 'red', 'grey'], white: ['white', 'red', 'black'],
  blue: ['blue', 'black', 'white'], orange: ['orange', 'black', 'grey'], yellow: ['yellow', 'black', 'red'],
  green: ['green', 'black', 'grey'], grey: ['grey', 'black', 'red'],
}

const RAW = [
  // Helmets
  ['Axor Apex Full Face Helmet', 'axor', 'helmets', 4999, 5999, 4.6, 1240, 'helmet', 'red', 'bt'],
  ['STUDDS Ninja Elite Super D3', 'studds', 'helmets', 1699, 2099, 4.2, 3120, 'helmet', 'black', 'b'],
  ['SMK Stellar Sports Helmet', 'smk', 'helmets', 7499, 8999, 4.5, 640, 'helmet', 'blue', 'n'],
  ['LS2 Rapid Street Helmet', 'ls2', 'helmets', 8999, 10999, 4.7, 480, 'helmet', 'white', 't'],
  ['VEGA Bolt Flip-Up Helmet', 'vega', 'helmets', 3299, 3999, 4.3, 910, 'helmet', 'orange', ''],
  ['Steelbird SBA-7 Hyper Helmet', 'steelbird', 'helmets', 1399, 1799, 4.1, 2210, 'helmet', 'yellow', 'b'],
  // Jackets
  ['Raida Riding Jacket', 'raida', 'riding-jackets', 6499, 7999, 4.5, 780, 'jacket', 'red', 'bt'],
  ['Rynox Stealth Evo Jacket', 'rynox', 'riding-jackets', 8999, 10999, 4.7, 560, 'jacket', 'black', 't'],
  ['Axor Street Mesh Jacket', 'axor', 'riding-jackets', 4299, 5199, 4.3, 420, 'jacket', 'grey', 'n'],
  ['Guardian Winter Shield Jacket', 'guardian', 'riding-jackets', 5599, 6999, 4.4, 310, 'jacket', 'blue', ''],
  ['Raida Touring Textile Jacket', 'raida', 'riding-jackets', 7299, 8499, 4.6, 350, 'jacket', 'orange', 'n'],
  ['Rynox Air Mesh Summer Jacket', 'rynox', 'riding-jackets', 4999, 5999, 4.4, 270, 'jacket', 'green', ''],
  // Gloves
  ['Pro Biker Gloves', 'raida', 'riding-gloves', 1299, 1699, 4.5, 1850, 'gloves', 'red', 'bt'],
  ['STUDDS Thunder Gloves', 'studds', 'riding-gloves', 899, 1199, 4.1, 2400, 'gloves', 'black', 'b'],
  ['Rynox Storm Gauntlet Gloves', 'rynox', 'riding-gloves', 2299, 2799, 4.6, 390, 'gloves', 'grey', ''],
  ['Axor Carbon Knuckle Gloves', 'axor', 'riding-gloves', 1899, 2299, 4.4, 520, 'gloves', 'orange', 'n'],
  ['VEGA Cruise Leather Gloves', 'vega', 'riding-gloves', 1499, 1899, 4.2, 610, 'gloves', 'black', ''],
  // Boots
  ['Raida Track Riding Boots', 'raida', 'riding-boots', 5499, 6499, 4.5, 330, 'boots', 'red', 't'],
  ['Rynox Adventure Boots', 'rynox', 'riding-boots', 7999, 9499, 4.7, 280, 'boots', 'black', 'b'],
  ['Axor Urban Riding Shoes', 'axor', 'riding-boots', 3299, 3999, 4.2, 440, 'boots', 'grey', 'n'],
  ['Guardian Waterproof Boots', 'guardian', 'riding-boots', 4699, 5599, 4.4, 260, 'boots', 'black', ''],
  ['STUDDS Rider Short Boots', 'studds', 'riding-boots', 2599, 3199, 4.0, 700, 'boots', 'orange', ''],
  // Covers
  ['Bajaj Dominar Body Cover', 'bajaj', 'bike-covers', 799, 1099, 4.3, 980, 'cover', 'grey', ''],
  ['Universal Waterproof Bike Cover', 'studds', 'bike-covers', 599, 899, 4.2, 3400, 'cover', 'black', 'b'],
  ['Rynox Premium Parking Cover XL', 'rynox', 'bike-covers', 1099, 1499, 4.5, 410, 'cover', 'red', ''],
  ['VEGA Reflective Cruiser Cover', 'vega', 'bike-covers', 1299, 1699, 4.4, 230, 'cover', 'blue', 'n'],
  // Luggage
  ['Bajaj Top Box 45L', 'bajaj', 'luggage-carriers', 3299, 3799, 4.6, 860, 'topbox', 'black', 'bt'],
  ['Rynox Tail Bag 20L', 'rynox', 'luggage-carriers', 2799, 3299, 4.5, 540, 'topbox', 'red', ''],
  ['Rynox Waterproof Saddle Bags (Pair)', 'rynox', 'luggage-carriers', 3999, 4799, 4.6, 360, 'topbox', 'grey', 't'],
  ['Axor Magnetic Tank Bag 15L', 'axor', 'luggage-carriers', 1899, 2399, 4.3, 470, 'topbox', 'orange', 'n'],
  ['Bajaj Universal Luggage Rack', 'bajaj', 'luggage-carriers', 1599, 1999, 4.1, 650, 'topbox', 'black', ''],
  // Bike care
  ['Chain Cleaner & Lube Kit', 'guardian', 'bike-care', 799, 999, 4.6, 2100, 'bottles', 'red', 'b'],
  ['Ceramic Gloss Polish 250ml', 'guardian', 'bike-care', 599, 799, 4.4, 890, 'bottles', 'blue', ''],
  ['Microfiber Detailing Kit', 'studds', 'bike-care', 499, 699, 4.3, 1320, 'bottles', 'orange', 'n'],
  ['Helmet Visor Cleaner Spray', 'studds', 'bike-care', 249, 349, 4.2, 1540, 'bottles', 'green', ''],
  ['Rust Remover & Protector', 'guardian', 'bike-care', 349, 449, 4.1, 760, 'bottles', 'yellow', ''],
  // Electronics
  ['4K Action Camera Pro', 'axor', 'electronics', 4999, 6499, 4.4, 620, 'camera', 'red', 't'],
  ['Bluetooth Intercom Duo Pack', 'ls2', 'electronics', 5999, 7499, 4.5, 740, 'camera', 'black', 'b'],
  ['LED Auxiliary Fog Lights (Pair)', 'bajaj', 'electronics', 1999, 2599, 4.5, 1980, 'led', 'yellow', 'bt'],
  ['Handlebar Phone Mount with Charger', 'rynox', 'electronics', 1199, 1599, 4.4, 1210, 'mount', 'black', 't'],
  ['Wireless Tyre Pressure Monitor', 'guardian', 'electronics', 1699, 2199, 4.2, 330, 'camera', 'blue', 'n'],
  ['Dual USB Fast Charger', 'axor', 'electronics', 599, 799, 4.3, 2600, 'mount', 'red', ''],
  // Performance
  ['Slip-on Performance Exhaust', 'axor', 'performance', 5999, 7499, 4.6, 410, 'exhaust', 'red', 'bt'],
  ['High-Flow Air Filter', 'bajaj', 'performance', 1299, 1699, 4.3, 520, 'filter', 'red', ''],
  ['Alloy Rear Sprocket 42T', 'guardian', 'performance', 1099, 1399, 4.2, 280, 'sprocket', 'orange', ''],
  ['Racing Chain & Sprocket Kit', 'rynox', 'performance', 3499, 4299, 4.5, 190, 'sprocket', 'yellow', 'n'],
  ['Titanium Race Silencer', 'ls2', 'performance', 11999, 14499, 4.7, 90, 'exhaust', 'grey', 'o'],
  // Safety
  ['Disc Brake Lock with Alarm', 'guardian', 'safety-accessories', 899, 1199, 4.4, 1450, 'lock', 'red', 'b'],
  ['Hi-Vis Reflective Rider Vest', 'raida', 'safety-accessories', 549, 799, 4.3, 980, 'vest', 'yellow', 't'],
  ['Knee & Elbow Guard Set', 'axor', 'safety-accessories', 1299, 1699, 4.5, 710, 'guard', 'black', ''],
  ['Heavy Duty Helmet Lock Cable', 'studds', 'safety-accessories', 349, 499, 4.0, 540, 'lock', 'black', 'n'],
  ['Reflective Safety Armband Set', 'raida', 'safety-accessories', 299, 449, 4.1, 320, 'vest', 'orange', ''],
]

const SIZES = {
  helmets: ['S', 'M', 'L', 'XL', 'XXL'],
  'riding-jackets': ['S', 'M', 'L', 'XL', 'XXL'],
  'riding-gloves': ['S', 'M', 'L', 'XL'],
  'riding-boots': ['6', '7', '8', '9', '10', '11'],
  'safety-accessories': [],
}

const SPECS = {
  helmets: (b) => [['Certification', 'ISI / DOT'], ['Shell', 'High-impact ABS / polycarbonate'], ['Visor', 'Anti-scratch, anti-fog'], ['Liner', 'Removable & washable'], ['Ventilation', 'Dual intake & exhaust vents'], ['Weight', '1,350 g'], ['Brand', b]],
  'riding-jackets': (b) => [['Armour', 'CE Level 1 shoulders & elbows'], ['Outer', 'Ripstop textile / mesh'], ['Liner', 'Removable thermal & waterproof'], ['Fit', 'Regular touring fit'], ['Reflective', '3M reflective piping'], ['Brand', b]],
  'riding-gloves': (b) => [['Material', 'Goat leather & stretch textile'], ['Protection', 'Carbon knuckle, palm slider'], ['Touchscreen', 'Compatible'], ['Closure', 'Velcro wrist strap'], ['Brand', b]],
  'riding-boots': (b) => [['Upper', 'Full-grain leather'], ['Protection', 'Ankle & shin armour'], ['Sole', 'Oil & slip resistant'], ['Waterproof', 'Yes - breathable membrane'], ['Brand', b]],
  'bike-covers': (b) => [['Fabric', '210D UV-coated polyester'], ['Water Resistance', 'Waterproof'], ['Features', 'Elastic hem, lock loops'], ['Fit', 'Universal 100-350cc'], ['Brand', b]],
  'luggage-carriers': (b) => [['Capacity', 'As listed'], ['Material', 'Reinforced polymer / 600D nylon'], ['Weather', 'Waterproof'], ['Mounting', 'Universal brackets included'], ['Brand', b]],
  'bike-care': (b) => [['Form', 'Spray / liquid'], ['Usage', 'Chain, body, helmet'], ['Safe On', 'Paint, plastics, rubber'], ['Brand', b]],
  electronics: (b) => [['Power', '5V / 12V'], ['Water Rating', 'IP65-IP67'], ['Connectivity', 'Bluetooth 5.0 / USB'], ['Warranty', '1 year'], ['Brand', b]],
  performance: (b) => [['Material', 'Stainless steel / alloy'], ['Fitment', 'Check compatibility chart'], ['Finish', 'Heat-resistant coating'], ['Warranty', '6 months'], ['Brand', b]],
  'safety-accessories': (b) => [['Material', 'Hardened steel / reflective fabric'], ['Visibility', 'High-intensity reflective'], ['Fit', 'Adjustable'], ['Brand', b]],
}

const FEATURES = {
  helmets: ['ISI Certified', 'Dual Visor', 'Aero Dynamic Design', 'Removable & Washable Liner'],
  'riding-jackets': ['CE Armoured', 'Removable Thermal Liner', 'Reflective Piping', 'Ventilation Zips'],
  'riding-gloves': ['Carbon Knuckle Guard', 'Touchscreen Tips', 'Palm Slider', 'Pre-curved Fit'],
  'riding-boots': ['Ankle Armour', 'Waterproof Membrane', 'Oil-resistant Sole', 'Quick-lace Closure'],
  'bike-covers': ['UV Resistant', '100% Waterproof', 'Elastic Hem', 'Lock Loops'],
  'luggage-carriers': ['Waterproof', 'Quick-release Mount', 'Reinforced Build', 'Lockable'],
  'bike-care': ['Paint Safe', 'Fast-acting Formula', 'Long Lasting', 'Easy Application'],
  electronics: ['Water Resistant', 'Easy Install', 'Fast Charging', '1 Year Warranty'],
  performance: ['Improved Response', 'Heat Resistant', 'Durable Build', 'Bolt-on Fitment'],
  'safety-accessories': ['High Visibility', 'Adjustable', 'Durable Build', 'Easy to Carry'],
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const brandName = (s) => ({ studds: 'STUDDS', smk: 'SMK', ls2: 'LS2', vega: 'VEGA' }[s] || s.charAt(0).toUpperCase() + s.slice(1))

export const products = RAW.map((r, i) => {
  const [name, brand, category, price, mrp, rating, reviews, art, colorKey, flags] = r
  const cat = categories.find((c) => c.slug === category)
  const colorKeys = COLOR_SETS[colorKey]
  return {
    id: `p${String(i + 1).padStart(3, '0')}`,
    slug: slug(name),
    name,
    brand,
    brandName: brandName(brand),
    category,
    categoryName: cat.name,
    subtitle: FEATURES[category].slice(0, 2).join(' | '),
    price,
    mrp,
    rating,
    reviewCount: reviews,
    art,
    colors: colorKeys.map((k) => PALETTE[k]),
    sizes: SIZES[category] || [],
    stock: flags.includes('o') ? 0 : 6 + ((i * 7) % 40),
    bestseller: flags.includes('b'),
    isNew: flags.includes('n'),
    trending: flags.includes('t'),
    createdAt: new Date(Date.UTC(2026, 9, 28) - i * 86400000 * (flags.includes('n') ? 1 : 6)).toISOString(),
    features: FEATURES[category],
    specs: SPECS[category](brandName(brand)).map(([k, v]) => ({ label: k, value: v })),
    description:
      `${name} is engineered for riders who refuse to compromise. Crafted by ${brandName(brand)}, it blends premium materials with a sport-inspired design to deliver dependable ${cat.name.toLowerCase()} performance on city streets, highways and everything in between. ` +
      `Every detail - from the reinforced construction to the finishing touches - has been tested across real riding conditions so you can focus on the road ahead.`,
  }
})

export const getProductBySlug = (s) => products.find((p) => p.slug === s)
