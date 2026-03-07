const Escrow = require('../models/Escrow.js');
const createError = require('../utils/createError.js');
const axios = require('axios');

const PAYSTACK_BASE_URL = process.env.PAYSTACK_BASE_URL;
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;


const  createEscrow = async ({ houseId, tenantId, ownerId, amount }) => {
  return Escrow.create({
    house: houseId,
    tenant: tenantId,
    owner: ownerId,
    amount,
  });
};

const fundEscrow = async (escrowId, paystackRef) => {
  const escrow = await Escrow.findById(escrowId);
  if (!escrow) throw createError('Escrow not found', 404);

  escrow.status = 'funded';
  escrow.paystackRef = paystackRef;
  await escrow.save();

  return escrow;
};



const getEscrowById = (escrowId) => {
  return Escrow.findById(escrowId);
};

const getMyEscrows = (userId) => {
  return Escrow.find({
    $or: [{ owner: userId }, { renter: userId }],
  });
};




const releaseEscrow = async (escrowId) => {
  const escrow = await Escrow.findById(escrowId);
  if (!escrow) throw createError('Escrow not found', 404);

  escrow.status = 'released';
  await escrow.save();

  return escrow;
};

const disputeEscrow = async (escrowId) => {
  const escrow = await Escrow.findById(escrowId);
  if (!escrow) throw new AppError('Escrow not found', 404);

  escrow.status = 'disputed';
  await escrow.save();

  return escrow;
};

const refundEscrow = async ({ escrowId, refundedBy = 'system' }) => {
  const escrow = await Escrow.findById(escrowId);

  if (!escrow) {
    throw createError('Escrow not found',404);
  }

  if (!['funded', 'disputed'].includes(escrow.status)) {
    throw createError(`Escrow cannot be refunded in ${escrow.status} state`,401);
  }

  if (!escrow.paystackRef) {
    throw createError('No Paystack reference found for this escrow',404);
  }

  // 1️⃣ Call Paystack refund API
  const response = await axios.post(
    `${PAYSTACK_BASE_URL}/refund`,
    {
      transaction: escrow.paystackRef,
    },
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.data.status) {
    throw createError('Paystack refund failed',500);
  }

  // 2️⃣ Update escrow state
  escrow.status = 'refunded';
  escrow.refundedAt = new Date();
  escrow.refundReference = response.data.data.reference;
  escrow.refundedBy = refundedBy;

  await escrow.save();

  return {
    message: 'Escrow refunded successfully',
    escrowId: escrow._id,
    refundRef: escrow.refundRef,
  };
};



module.exports = {
  createEscrow,
  getEscrowById,
  getMyEscrows,
  releaseEscrow,
  refundEscrow,
  fundEscrow,
  disputeEscrow
}