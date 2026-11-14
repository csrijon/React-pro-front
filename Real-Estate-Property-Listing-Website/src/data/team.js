import { avatar } from './images.js'

export const team = [
  { id: 'tm1', name: 'Arindam Sen', role: 'Founder', photo: avatar('men', 32), email: 'arindam@estatehub.com', phone: '+91 98765 43210', bio: 'Arindam started the company in 2016 and still shows many of the properties himself.', visible: true, order: 0 },
  { id: 'tm2', name: 'Pallavi Roy', role: 'Sales Manager', photo: avatar('women', 44), email: 'pallavi@estatehub.com', phone: '+91 98310 22110', bio: 'Pallavi leads the sales team and looks after every buyer from first visit to registration.', visible: true, order: 1 },
  { id: 'tm3', name: 'Rohit Ghosh', role: 'Property Consultant', photo: avatar('men', 75), email: 'rohit@estatehub.com', phone: '+91 97488 33221', bio: 'Rohit advises on commercial spaces and investment properties.', visible: true, order: 2 },
  { id: 'tm4', name: 'Sayantani Das', role: 'Customer Support', photo: avatar('women', 68), email: 'support@estatehub.com', phone: '+91 98300 55667', bio: 'Sayantani answers your questions and arranges site visits.', visible: true, order: 3 },
]
