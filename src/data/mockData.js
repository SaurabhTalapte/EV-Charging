// Mock data for the entire EV ChargeHub application

export const STATIONS = [
  {
    id: 'st-001',
    name: 'GreenVolt SuperHub',
    address: '12 MG Road, Bangalore 560001',
    lat: 12.9716,
    lng: 77.5946,
    distance: 1.2,
    status: 'available',
    connectors: [
      { type: 'CCS2', power: 50, price: 14, available: 3, total: 4 },
      { type: 'Type 2', power: 22, price: 10, available: 2, total: 2 },
    ],
    rating: 4.6,
    totalReviews: 128,
    amenities: ['Wi-Fi', 'Restroom', 'Café', 'Parking'],
    operatingHours: '24/7',
    image: null,
    reviews: [
      { id: 'r1', user: 'Anika S.', rating: 5, tags: ['Fast Speed', 'Clean Area'], text: 'Super fast charging! My Nexon EV charged from 20% to 80% in just 35 minutes.', date: '2026-07-28' },
      { id: 'r2', user: 'Rahul K.', rating: 4, tags: ['Good Location'], text: 'Convenient location near the metro. The café next door is a nice bonus.', date: '2026-07-25' },
    ],
  },
  {
    id: 'st-002',
    name: 'ChargeZone Express',
    address: '45 Koramangala 4th Block, Bangalore 560034',
    lat: 12.9352,
    lng: 77.6245,
    distance: 3.8,
    status: 'available',
    connectors: [
      { type: 'CCS2', power: 150, price: 18, available: 1, total: 2 },
      { type: 'CHAdeMO', power: 50, price: 15, available: 0, total: 1 },
      { type: 'Type 2', power: 7.4, price: 8, available: 4, total: 4 },
    ],
    rating: 4.2,
    totalReviews: 87,
    amenities: ['Parking', 'Security', 'Lighting'],
    operatingHours: '06:00 – 23:00',
    image: null,
    reviews: [
      { id: 'r3', user: 'Priya M.', rating: 4, tags: ['Good Price'], text: 'Affordable AC charging. I leave my car here while shopping at the nearby mall.', date: '2026-07-30' },
    ],
  },
  {
    id: 'st-003',
    name: 'Tata Power EZ Charge',
    address: '78 Indiranagar, Bangalore 560038',
    lat: 12.9784,
    lng: 77.6408,
    distance: 5.1,
    status: 'occupied',
    connectors: [
      { type: 'CCS2', power: 60, price: 16, available: 0, total: 3 },
      { type: 'Type 2', power: 22, price: 11, available: 0, total: 2 },
    ],
    rating: 4.8,
    totalReviews: 245,
    amenities: ['Wi-Fi', 'Restroom', 'Lounge', 'Parking', 'Vending Machine'],
    operatingHours: '24/7',
    image: null,
    reviews: [
      { id: 'r4', user: 'Vikram T.', rating: 5, tags: ['Fast Speed', 'Great Amenities', 'Clean Area'], text: 'Best charging station in Bangalore. The lounge is comfortable and well-maintained.', date: '2026-08-01' },
      { id: 'r5', user: 'Sneha D.', rating: 5, tags: ['Fast Speed'], text: 'Always my go-to station. Reliable and fast!', date: '2026-07-29' },
    ],
  },
  {
    id: 'st-004',
    name: 'EESL Rapid Station',
    address: '23 Whitefield Main Road, Bangalore 560066',
    lat: 12.9698,
    lng: 77.7500,
    distance: 12.4,
    status: 'available',
    connectors: [
      { type: 'CCS2', power: 100, price: 17, available: 2, total: 2 },
      { type: 'CHAdeMO', power: 50, price: 14, available: 1, total: 1 },
    ],
    rating: 3.9,
    totalReviews: 54,
    amenities: ['Parking', 'Lighting'],
    operatingHours: '08:00 – 22:00',
    image: null,
    reviews: [
      { id: 'r6', user: 'Karthik R.', rating: 3, tags: ['Broken Plug'], text: 'One of the CHAdeMO plugs was not working last time I visited.', date: '2026-07-20' },
    ],
  },
  {
    id: 'st-005',
    name: 'Ather Grid Point',
    address: '9 HSR Layout, Bangalore 560102',
    lat: 12.9121,
    lng: 77.6446,
    distance: 6.7,
    status: 'out_of_service',
    connectors: [
      { type: 'Type 2', power: 7.4, price: 7, available: 0, total: 3 },
    ],
    rating: 4.0,
    totalReviews: 32,
    amenities: ['Parking'],
    operatingHours: '24/7',
    image: null,
    reviews: [],
  },
  {
    id: 'st-006',
    name: 'ElectriFi Premium Hub',
    address: '56 Jayanagar 9th Block, Bangalore 560041',
    lat: 12.9250,
    lng: 77.5838,
    distance: 4.3,
    status: 'available',
    connectors: [
      { type: 'CCS2', power: 350, price: 22, available: 1, total: 1 },
      { type: 'CCS2', power: 150, price: 18, available: 2, total: 3 },
      { type: 'Type 2', power: 22, price: 12, available: 3, total: 3 },
    ],
    rating: 4.9,
    totalReviews: 312,
    amenities: ['Wi-Fi', 'Restroom', 'Premium Lounge', 'Café', 'Kids Play Area', 'Parking'],
    operatingHours: '24/7',
    image: null,
    reviews: [
      { id: 'r7', user: 'Meera J.', rating: 5, tags: ['Ultra Fast', 'Great Amenities', 'Clean Area'], text: '350kW charger is insane! My car went from 10% to 80% in 18 minutes.', date: '2026-08-02' },
      { id: 'r8', user: 'Arjun P.', rating: 5, tags: ['Fast Speed', 'Clean Area'], text: 'Premium experience. The lounge is like a co-working space. Highly recommended!', date: '2026-07-31' },
      { id: 'r9', user: 'Divya N.', rating: 4, tags: ['Good Price', 'Clean Area'], text: 'A bit pricey but the amenities make it worth it. Great for long charging sessions.', date: '2026-07-27' },
    ],
  },
];

export const EV_MAKES = [
  {
    make: 'Tesla',
    models: [
      { model: 'Model 3', battery: 60, plugType: 'CCS2' },
      { model: 'Model Y', battery: 75, plugType: 'CCS2' },
      { model: 'Model S', battery: 100, plugType: 'CCS2' },
    ],
  },
  {
    make: 'Tata',
    models: [
      { model: 'Nexon EV', battery: 40.5, plugType: 'CCS2' },
      { model: 'Nexon EV Max', battery: 40.5, plugType: 'CCS2' },
      { model: 'Tiago EV', battery: 24, plugType: 'CCS2' },
      { model: 'Punch EV', battery: 35, plugType: 'CCS2' },
    ],
  },
  {
    make: 'Hyundai',
    models: [
      { model: 'Ioniq 5', battery: 72.6, plugType: 'CCS2' },
      { model: 'Kona Electric', battery: 39.2, plugType: 'CCS2' },
    ],
  },
  {
    make: 'MG',
    models: [
      { model: 'ZS EV', battery: 50.3, plugType: 'CCS2' },
      { model: 'Comet EV', battery: 17.3, plugType: 'Type 2' },
    ],
  },
  {
    make: 'Mahindra',
    models: [
      { model: 'XUV400', battery: 39.4, plugType: 'CCS2' },
      { model: 'BE 6', battery: 79, plugType: 'CCS2' },
    ],
  },
  {
    make: 'BMW',
    models: [
      { model: 'iX1', battery: 64.7, plugType: 'CCS2' },
      { model: 'i4', battery: 83.9, plugType: 'CCS2' },
      { model: 'iX', battery: 76.6, plugType: 'CCS2' },
    ],
  },
  {
    make: 'BYD',
    models: [
      { model: 'Atto 3', battery: 60.48, plugType: 'CCS2' },
      { model: 'Seal', battery: 82.56, plugType: 'CCS2' },
      { model: 'e6', battery: 71.7, plugType: 'CCS2' },
    ],
  },
];

export const FEEDBACK_TAGS = [
  'Fast Speed', 'Ultra Fast', 'Clean Area', 'Good Price',
  'Great Amenities', 'Good Location', 'Friendly Staff',
  'Broken Plug', 'Slow Charging', 'Dirty Area', 'Long Wait',
];

export const SLOT_DURATIONS = [
  { label: '15 min', minutes: 15 },
  { label: '30 min', minutes: 30 },
  { label: '45 min', minutes: 45 },
  { label: '1 hour', minutes: 60 },
  { label: '1.5 hours', minutes: 90 },
  { label: '2 hours', minutes: 120 },
];

export const TIME_SLOTS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30', '23:00',
];
