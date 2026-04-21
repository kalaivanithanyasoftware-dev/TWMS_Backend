import express from "express"
import { performSAPaction } from "../../controller/binning/SAPStockController.js";
const SAPStockRoutes = express.Router();

SAPStockRoutes.post('/perform-sap', performSAPaction)

export default SAPStockRoutes