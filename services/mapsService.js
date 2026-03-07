const GOOGLE_MAPS_BASE = 'https://maps.googleapis.com/maps/api';
const {fetchJSON} = require('../utils/fetchJSON');


const geocodeAddress = async (address) => {
  const url = `${GOOGLE_MAPS_BASE}/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  const data = await fetchJSON(url);

  if (!data.results.length) throw new Error('Address not found');

  const { lat, lng } = data.results[0].geometry.location;

  return { latitude: lat, longitude: lng };
};


const reverseGeocode = async (latitude, longitude) => {
  const url = `${GOOGLE_MAPS_BASE}/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  const data = await fetchJSON(url);

  if (!data.results.length) throw new Error('Location not found');

  return {
    formattedAddress: data.results[0].formatted_address,
    components: data.results[0].address_components,
  };
};


const getNearbyHousesMap = async ({
  latitude,
  longitude,
  radius = 5000, // meters
}) => {
  return await House.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: radius,
      },
    },
  }).select('title rent location images');
};


const calculateDistance = (
  lat1,
  lon1,
  lat2,
  lon2,
  unit = 'km'
) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = unit === 'km' ? 6371 : 3958.8;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};



  module.exports = {geocodeAddress,reverseGeocode,
  getNearbyHousesMap,
  calculateDistance,}