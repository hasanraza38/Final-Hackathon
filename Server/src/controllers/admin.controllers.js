import Loan from '../models/loan.models.js';

const getApplications = async (req, res) => {
  const { city, country } = req.query;
  let query = {};
  if (city) query['address.city'] = city;
  if (country) query['address.country'] = country;

  const applications = await Loan.find(query).populate('userId', 'name email').populate('appointment');
  res.json(applications);
};

const updateApplication = async (req, res) => {
  const { id } = req.params;
  const { status, tokenNumber } = req.body;

  await Loan.findByIdAndUpdate(id, { status, tokenNumber });
  res.json({ message: 'Application updated' });
};
                    
export {getApplications, updateApplication}