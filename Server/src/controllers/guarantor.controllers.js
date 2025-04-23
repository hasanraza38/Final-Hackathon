import guarantorModels from "../models/guarantor.models.js";

 const getGuarantorsByLoanId = async (req, res) => {
  try {
    const guarantors = await guarantorModels.find({ loanId: req.params.loanId });

    if (!guarantors || guarantors.length === 0) {
      return res.status(404).json({ message: 'No guarantors found for this loan' });
    }

    res.status(200).json({
      message: 'Guarantors retrieved successfully',
      count: guarantors.length,
      guarantors
    });
  } catch (error) {
    console.error('Get Guarantors Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid loan ID' });
    }
    res.status(500).json({ error: 'Failed to retrieve guarantors' });
  }
};

export { getGuarantorsByLoanId };