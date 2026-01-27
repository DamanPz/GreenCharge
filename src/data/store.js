// Shared in-memory data store
const stations = [
    { id: 1, name: 'BTM Layout Station', location: 'BTM Layout, Bengaluru', capacity: '50kW', status: 'Available', lat: 12.9165, lng: 77.6101 },
    { id: 2, name: 'Indiranagar Green Hub', location: 'Indiranagar, Bengaluru', capacity: '75kW', status: 'Occupied', lat: 12.9716, lng: 77.6412 },
    { id: 3, name: 'Whitefield Supercharger', location: 'Whitefield, Bengaluru', capacity: '100kW', status: 'Maintenance', lat: 12.9698, lng: 77.7499 },
    { id: 4, name: 'Jayanagar EcoConnect', location: 'Jayanagar, Bengaluru', capacity: '60kW', status: 'Available', lat: 12.9308, lng: 77.5838 }
];

module.exports = { stations };
