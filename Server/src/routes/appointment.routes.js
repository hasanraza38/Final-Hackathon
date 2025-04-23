import express from 'express';      
import { getAllAppointments, getSingleAppointment } from '../controllers/appointment.controllers.js';
import { authenticateToken } from '../middleware/auth.middleware.js';


const router = express.Router();

router.get('/allappointments',authenticateToken, getAllAppointments);
router.get('/singleappointment/:id',authenticateToken, getSingleAppointment);

export default router;        