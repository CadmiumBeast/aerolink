// Simple in-memory fares dataset for local search during UI development
export const sampleFares = [
  {
    id: 'F001',
    origin: 'DXB',
    destination: 'NBO',
    date: '2026-06-10',
    airline: 'AeroLink Express',
    cabin: 'Economy',
    price: 420,
    currency: 'USD',
  },
  {
    id: 'F002',
    origin: 'DXB',
    destination: 'NBO',
    date: '2026-06-11',
    airline: 'AeroLink Express',
    cabin: 'Business',
    price: 980,
    currency: 'USD',
  },
  {
    id: 'F003',
    origin: 'LHR',
    destination: 'DXB',
    date: '2026-06-10',
    airline: 'AeroLink International',
    cabin: 'Economy',
    price: 560,
    currency: 'USD',
  },
  {
    id: 'F004',
    origin: 'NBO',
    destination: 'DXB',
    date: '2026-06-10',
    airline: 'AeroLink Express',
    cabin: 'Economy',
    price: 430,
    currency: 'USD',
  },
];

export function findFares({ origin, destination, date }) {
  if (!origin || !destination || !date) return [];
  const o = origin.trim().toUpperCase();
  const d = destination.trim().toUpperCase();
  const dt = date.trim();
  return sampleFares.filter(
    (f) => f.origin === o && f.destination === d && f.date === dt
  );
}
