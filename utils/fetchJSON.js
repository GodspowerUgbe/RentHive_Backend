
const fetchJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Google Maps API error');
  return res.json();
};

module.exports = {
  fetchJSON,
};