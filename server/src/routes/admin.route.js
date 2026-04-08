import { Router } from 'express';
import adminController from '../controllers/admin.controller.js';
import {
    validateAdminQuery,
    validateCatalogBody,
    validateCatalogResource,
    validateCatalogResourceWithId
} from '../validators/admin.validator.js';

const router = Router();

router.get('/overview', validateAdminQuery, adminController.getOverview);

router.get(
    '/catalog/:resource',
    validateCatalogResource,
    validateAdminQuery,
    adminController.listCatalog
);

router.post(
    '/catalog/:resource',
    validateCatalogResource,
    validateCatalogBody,
    adminController.createCatalog
);

router.put(
    '/catalog/:resource/:id',
    validateCatalogResourceWithId,
    validateCatalogBody,
    adminController.updateCatalog
);

router.delete(
    '/catalog/:resource/:id',
    validateCatalogResourceWithId,
    validateAdminQuery,
    adminController.deleteCatalog
);

export default router;
