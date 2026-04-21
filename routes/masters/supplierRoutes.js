import express from "express"
import { performSupplierAction } from "../../controller/masters/supplierController.js";
const supplierRoutes = express.Router();

supplierRoutes.post('/perform-supplier-action', performSupplierAction)

export default supplierRoutes