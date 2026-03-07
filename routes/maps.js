const { Router } = require( 'express');
const {
  geocodeAddress,
  reverseGeocode,
  getNearbyHousesMap,
  calculateDistance,
} = require( '../controllers/mapsController.js');

const router = Router();

router.get('/geocode', geocodeAddress);
router.get('/reverse-geocode', reverseGeocode);
router.get('/nearby-houses', getNearbyHousesMap);
router.get('/distance', calculateDistance);

module.exports = router;
