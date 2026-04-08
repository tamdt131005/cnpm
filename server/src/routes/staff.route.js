import { Router } from 'express';
import staffController from '../controllers/staff.controller.js';
import {
    validateCreateFeeRate,
    validateExportReportQuery,
    validateGenerateInvoices,
    validateInvoicesQuery,
    validatePaymentHistoryQuery,
    validateRecordPayment,
    validateRegistrationsQuery,
    validateReportSummaryQuery,
    validateUpdateInvoiceDiscount,
    validateStaffUserQuery
} from '../validators/staff.validator.js';

const router = Router();

router.post('/fee-rates', validateCreateFeeRate, staffController.createFeeRate);
router.get('/fee-rates', validateStaffUserQuery, staffController.getFeeRates);
router.get('/debts', validateStaffUserQuery, staffController.getDebts);
router.get('/registrations', validateRegistrationsQuery, staffController.getRegistrations);
router.get('/invoices', validateInvoicesQuery, staffController.getInvoices);
router.patch('/invoices/:maHoaDon/discount', validateUpdateInvoiceDiscount, staffController.updateInvoiceDiscount);
router.post('/payments', validateRecordPayment, staffController.recordPayment);
router.get('/payments/history', validatePaymentHistoryQuery, staffController.getPaymentHistory);
router.get('/reports/summary', validateReportSummaryQuery, staffController.getReportSummary);
router.get('/reports/debt-org', validateStaffUserQuery, staffController.getDebtByOrganization);
router.get('/reports/export', validateExportReportQuery, staffController.exportReport);
router.post('/generate-invoices', validateGenerateInvoices, staffController.generateInvoices);

export default router;