const u = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export const IMG = {
  livingA: '1618221195710-dd6b41faaea6',
  livingB: '1600210492486-724fe5c67fb0',
  livingC: '1586023492125-27b2c045efd7',
  livingD: '1616486338812-3dadae4b4ace',
  livingE: '1600607687939-ce8a6c25118c',
  livingF: '1600585154340-be6161a56a0c',
  bedroomA: '1618219908412-a29a1bb7b86e',
  bedroomB: '1631679706909-1844bbd07221',
  kitchenA: '1556228453-efd6c1ff04f6',
  dining: '1524758631624-e2822e304c36',
  officeA: '1497366216548-37526070297c',
  officeB: '1497366811353-6870744d04b2',
  hotelA: '1566073771259-6a8506099945',
  hotelB: '1551882547-ff40c63fe5fa',
  retail: '1441986300917-64674bd600d8',
  interiorA: '1600566753190-17f0baa2a6c3',
  interiorB: '1560448204-e02f11c3d0e2',
  interiorC: '1493663284031-b7e3aefcae8e',
  interiorD: '1505693416388-ac5ce068fe85',
  interiorE: '1540518614846-7eded433c457',
  interiorF: '1502672260266-1c1ef2d93688',
  interiorG: '1484101403633-562f891dc89a',
  architecture: '1487958449943-2429e8be8625',
  lamp: '1513694203232-719a280e022f',
  chair: '1567538096630-e0c55bd6374c',
  person1: '1560250097-0b93528c311a',
  person2: '1573496359142-b8d87734a5a2',
  person3: '1507003211169-0a1dd7228f2d',
  person4: '1494790108377-be9c29b29330',
};

export const img = (key, w) => u(IMG[key], w);
export const unsplash = u;
