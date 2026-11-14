import { img } from './images.js';

export const seedDesigners = [
  { id: 'd1', slug: 'arjun-sen', name: 'Arjun Sen', designation: 'Principal Designer', photo: img('person1', 800),
    bio: 'Arjun founded Domus Studio after a decade in architecture practice. He leads our residential work and believes the best homes feel inevitable.',
    expertise: ['Residential', 'Space Planning', 'Materiality'], linkedin: 'https://linkedin.com', instagram: 'https://instagram.com' },
  { id: 'd2', slug: 'megha-das', name: 'Megha Das', designation: 'Interior Designer', photo: img('person2', 800),
    bio: 'Megha shapes warm, layered interiors with a deep respect for craft and local artisans.',
    expertise: ['Hospitality', 'Textiles', 'Styling'], linkedin: 'https://linkedin.com', instagram: 'https://instagram.com' },
  { id: 'd3', slug: 'rohit-pal', name: 'Rohit Pal', designation: 'Design Lead', photo: img('person3', 800),
    bio: 'Rohit runs our commercial portfolio, translating brand into space for offices and retail.',
    expertise: ['Commercial', 'Workplace', 'Lighting'], linkedin: 'https://linkedin.com', instagram: 'https://instagram.com' },
  { id: 'd4', slug: 'ishita-roy', name: 'Ishita Roy', designation: 'Spatial Designer', photo: img('person4', 800),
    bio: 'Ishita designs furniture and joinery, and keeps every drawing honest to how it will be built.',
    expertise: ['Furniture', 'Joinery', '3D Visualisation'], linkedin: 'https://linkedin.com', instagram: 'https://instagram.com' },
];
