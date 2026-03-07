const escrowService = require('../services/escrowService.js');




const createEscrow = (req, res) => {

}

const getEscrowById = (req,res)=>{

}

const getMyEscrows = (req, res) => {
  
}

const acceptEscrow = (req, res) => {
  
}

const releaseEscrow = (req,res)=>{
  
}


const refundEscrow  = async (req, res, next) => {
    try {
      const { escrowId } = req.params;
  
      const result = await escrowService.refundEscrow({
        escrowId,
        refundedBy: req.user?.id || 'system',
      });
  
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
    


module.exports = {
  createEscrow,
  getEscrowById,
  getMyEscrows,
  acceptEscrow,
  releaseEscrow,
  refundEscrow,
}