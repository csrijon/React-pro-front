// Typographic brand marks are used instead of real logos. Replace `logo` with image URLs from your backend.
export const brands = [
  { slug: 'axor', name: 'Axor', country: 'India', founded: 2007, style: 'italic', tagline: 'Aggressive helmets with race-bred graphics.',
    about: 'Axor builds performance helmets and riding gear with bold graphics, ISI-certified shells and aero-tuned designs for Indian riders.' },
  { slug: 'studds', name: 'STUDDS', country: 'India', founded: 1975, style: 'bold', tagline: 'India’s most trusted helmet maker.',
    about: 'A household name in Indian two-wheeler safety, STUDDS offers value-packed helmets, gloves and accessories for daily riders.' },
  { slug: 'smk', name: 'SMK', country: 'India', founded: 1990, style: 'wide', tagline: 'Premium shells, everyday prices.',
    about: 'SMK helmets combine thermoplastic engineering with premium finishes, popular with sport and touring riders.' },
  { slug: 'ls2', name: 'LS2', country: 'Spain', founded: 1990, style: 'bold', tagline: 'Global racing pedigree.',
    about: 'LS2 helmets are worn on race tracks and city streets worldwide, known for lightweight polycarbonate and fibreglass shells.' },
  { slug: 'raida', name: 'Raida', country: 'India', founded: 2012, style: 'italic', tagline: 'Armoured gear for serious riders.',
    about: 'Raida designs CE-armoured jackets, gloves and boots that blend safety with street-ready styling.' },
  { slug: 'vega', name: 'VEGA', country: 'India', founded: 1982, style: 'wide', tagline: 'Safety you can afford.',
    about: 'VEGA offers a wide helmet range, from flip-ups to open-face designs, with dependable quality and fresh graphics.' },
  { slug: 'rynox', name: 'Rynox', country: 'India', founded: 2005, style: 'bold', tagline: 'Adventure gear, built to last.',
    about: 'Rynox is loved by touring riders for rugged jackets, boots and waterproof luggage tested across the Himalayas.' },
  { slug: 'bajaj', name: 'Bajaj', country: 'India', founded: 1945, style: 'wide', tagline: 'Genuine accessories for Bajaj riders.',
    about: 'Genuine covers, luggage and utility accessories engineered for a perfect factory fit.' },
  { slug: 'steelbird', name: 'Steelbird', country: 'India', founded: 1964, style: 'italic', tagline: 'Helmets with a flying start.',
    about: 'Steelbird has protected Indian riders for decades with high-impact shells and vibrant graphics.' },
  { slug: 'guardian', name: 'Guardian', country: 'India', founded: 2010, style: 'bold', tagline: 'All-weather riding protection.',
    about: 'Guardian focuses on weatherproof jackets, boots and safety accessories for every season.' },
]

export const getBrand = (slug) => brands.find((b) => b.slug === slug)
