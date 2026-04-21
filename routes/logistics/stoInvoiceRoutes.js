import express from "express"
import { performSTOInvoiceActions } from "../../controller/logistics/stoInvoiceController.js";
const stoInvoiceRoutes = express.Router();

stoInvoiceRoutes.post('/performSTOInvoiceActions', performSTOInvoiceActions)

export default stoInvoiceRoutes