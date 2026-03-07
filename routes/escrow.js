const { Router } = require( 'express');
const {
  createEscrow,
  getEscrowById,
  getMyEscrows,
  acceptEscrow,
  releaseEscrow,
  refundEscrow,
} = require( '../controllers/escrowController.js');

const router = Router();

router.post('/', createEscrow);
router.get('/me', getMyEscrows);
router.get('/:escrowId', getEscrowById);

router.post('/:escrowId/accept', acceptEscrow);
router.post('/:escrowId/release', releaseEscrow);
router.post('/:escrowId/refund', refundEscrow);

module.exports = router;
