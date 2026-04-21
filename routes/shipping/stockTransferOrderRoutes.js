import express from "express"
import { performStockTransferOrderActions } from "../../controller/shipping/stockTransferOrderController.js";
const stockTransferOrderRoutes = express.Router();

stockTransferOrderRoutes.post('/performStockTransferOrderActions', performStockTransferOrderActions)


export default stockTransferOrderRoutes