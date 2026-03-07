const { Router } = require( 'express');
const {
  chatWithAI,
  recommendHouses,
  analyzeRent,
  explainPrice,
} = require( '../controllers/aiController.js');

const router = Router();

router.post('/chat', chatWithAI);
router.post('/recommendations', recommendHouses);
router.post('/rent-analysis', analyzeRent);
router.post('/price-explanation', explainPrice);

module.exports =  router;
