export const testimonials = [
  { id: 1, name: 'Rohit Sharma', city: 'Mumbai', rating: 5, bike: 'Royal Enfield Himalayan', text: 'The Axor helmet fit perfectly and arrived in two days. Genuine product, great packaging and the support team helped me pick the right size.' },
  { id: 2, name: 'Ananya Das', city: 'Kolkata', rating: 5, bike: 'KTM Duke 390', text: 'Finally a store that feels built by riders. The jacket quality is outstanding and the returns process was painless when I needed a size swap.' },
  { id: 3, name: 'Imran Khan', city: 'Bengaluru', rating: 4, bike: 'Yamaha R15', text: 'Fast delivery and honest pricing. The LED fog lights transformed my night rides. Will be ordering more accessories soon.' },
  { id: 4, name: 'Priya Nair', city: 'Kochi', rating: 5, bike: 'Honda CB350', text: 'Loved the gloves and the tank bag. Product descriptions were accurate, and the checkout was smooth and secure.' },
]

export const faqs = [
  { q: 'How do I choose the right helmet size?', a: 'Measure the circumference of your head just above your eyebrows and ears with a soft tape. Compare it with the size chart on the product page. If you are between sizes, pick the smaller one - helmet liners compress with use.' },
  { q: 'Are all products genuine?', a: 'Yes. MotoGear sources directly from brands and authorised distributors. Every product ships with the manufacturer’s warranty and invoice.' },
  { q: 'What is your delivery time?', a: 'Standard delivery takes 4-6 business days. Express takes 2-3 business days and Next-Day delivery is available in select metro cities.' },
  { q: 'Can I return or exchange a product?', a: 'Yes, you can return unused products within 7 days of delivery in original packaging. Helmets must have intact seals and hygiene liners.' },
  { q: 'Which payment methods are accepted?', a: 'We accept UPI, credit and debit cards, net banking, wallets and Cash on Delivery for eligible pin codes.' },
  { q: 'How can I track my order?', a: 'Open My Orders in your account to view live status, or use the tracking link sent by SMS and email once your order ships.' },
  { q: 'Do you offer warranty on products?', a: 'Electronics and performance parts carry brand warranty (6-12 months). Warranty details are listed on each product page.' },
  { q: 'How do coupon codes work?', a: 'Enter a valid code in the cart or checkout. Try MOTO10 for 10% off orders above ₹1,000. Only one coupon can be applied per order.' },
]

export const coupons = [
  { code: 'MOTO10', type: 'percent', value: 10, minOrder: 1000, maxDiscount: 1500, description: '10% off on orders above ₹1,000 (max ₹1,500)' },
  { code: 'RIDE500', type: 'flat', value: 500, minOrder: 5000, description: '₹500 off on orders above ₹5,000' },
  { code: 'FREESHIP', type: 'shipping', value: 0, minOrder: 0, description: 'Free standard shipping on any order' },
]

export const stats = [
  { value: '50K+', label: 'Happy Riders', icon: 'users' },
  { value: '250+', label: 'Products', icon: 'package' },
  { value: '50+', label: 'Trusted Brands', icon: 'shield' },
  { value: '4.6★', label: 'Average Rating', icon: 'star' },
]

export const team = [
  { name: 'Arjun Mehta', role: 'Founder & CEO', bike: 'Royal Enfield Interceptor' },
  { name: 'Neha Kapoor', role: 'Head of Product', bike: 'Triumph Street Triple' },
  { name: 'Vikram Rao', role: 'Gear Testing Lead', bike: 'KTM 390 Adventure' },
  { name: 'Sneha Iyer', role: 'Customer Experience', bike: 'Honda CB350' },
]

export const policies = {
  'shipping-policy': {
    title: 'Shipping Policy',
    updated: 'October 2026',
    sections: [
      ['Delivery Coverage', 'We deliver to over 19,000 pin codes across India. Delivery availability is confirmed at checkout based on your pin code.'],
      ['Shipping Charges', 'Shipping is free on orders above ₹999. Orders below ₹999 carry a flat ₹79 standard shipping fee. Express (₹149) and Next-Day (₹299) options are available at checkout.'],
      ['Processing Time', 'Orders are processed within 24 hours on business days. You will receive a confirmation and tracking link once your order has shipped.'],
      ['Estimated Delivery', 'Standard: 4-6 business days. Express: 2-3 business days. Next-Day: next business day for select metro cities. Remote areas may take 2-3 additional days.'],
      ['Damaged or Missing Parcels', 'If your package arrives damaged or incomplete, contact support within 48 hours with photos and we will arrange a replacement or refund.'],
    ],
  },
  'return-policy': {
    title: 'Return & Refund Policy',
    updated: 'October 2026',
    sections: [
      ['7-Day Easy Returns', 'You can return most products within 7 days of delivery if they are unused, unwashed and in their original packaging with all tags attached.'],
      ['Non-returnable Items', 'For hygiene reasons, helmets with broken seals, used gloves and opened care products cannot be returned unless defective.'],
      ['How to Return', 'Go to My Orders, choose the item, select a reason and schedule a pickup. Our courier will collect the parcel from your address.'],
      ['Refunds', 'Refunds are issued to your original payment method within 5-7 business days after the returned item passes quality inspection. COD refunds are made via bank transfer.'],
      ['Exchanges', 'Need a different size? Select Exchange while raising the return and we will ship the replacement as soon as the pickup is completed.'],
    ],
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    updated: 'October 2026',
    sections: [
      ['Information We Collect', 'We collect information you provide - such as name, email, phone number, shipping address - and technical data such as device type and pages visited.'],
      ['How We Use Information', 'We use your information to process orders, provide support, personalise recommendations and send updates you have opted into.'],
      ['Sharing', 'We share data only with logistics partners, payment processors and service providers who need it to fulfil your order. We never sell personal data.'],
      ['Cookies', 'We use cookies to keep your cart, remember preferences and measure site performance. You can manage cookies in your browser settings.'],
      ['Your Rights', 'You can access, correct or delete your personal data at any time from your account or by contacting support@motogear.in.'],
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    updated: 'October 2026',
    sections: [
      ['Acceptance of Terms', 'By accessing or purchasing from MotoGear you agree to these terms. If you do not agree, please do not use the site.'],
      ['Products & Pricing', 'We make every effort to display accurate descriptions and prices. In case of an error we reserve the right to cancel the order and issue a full refund.'],
      ['Orders & Payment', 'An order is confirmed only after successful payment authorisation or verification for Cash on Delivery orders.'],
      ['Safety Disclaimer', 'Protective gear reduces but does not eliminate the risk of injury. Always ride responsibly and follow local traffic laws.'],
      ['Limitation of Liability', 'To the extent permitted by law, MotoGear is not liable for indirect or consequential damages arising from use of the site or products.'],
    ],
  },
}
