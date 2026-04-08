import { Router } from 'express';
import studentController from '../controllers/student.controller.js';
import {
	validateStudentPay,
	validateStudentRegistrationQuery,
	validateStudentUserQuery
} from '../validators/student.validator.js';

const router = Router();

router.get('/profile', validateStudentUserQuery, studentController.getProfile);
router.get('/invoices', validateStudentUserQuery, studentController.getInvoices);
router.get('/transactions', validateStudentUserQuery, studentController.getTransactions);
router.get('/registrations', validateStudentRegistrationQuery, studentController.getRegistrations);
router.post('/pay', validateStudentPay, studentController.pay);
router.post('/momo/ipn', studentController.momoIpn);

export default router;