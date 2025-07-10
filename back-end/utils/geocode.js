const fetch = require('node-fetch');

async function getCoordinatesFromAddress(address) {
  const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`);
  const data = await res.json();

  if (data.length === 0) throw new Error("Address not found");

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon)
  };
}

module.exports = getCoordinatesFromAddress;
