import express from "express"
import deliveryChellanRoutes from "./deliveryChellanRoutes.js";
import stoInvoiceRoutes from "./stoInvoiceRoutes.js";
import ewayBillRoutes from "./ewayBillRoutes.js";
import logisticsReportRoutes from "./logisticsReportRoutes.js";

const logisticsRoutes = express.Router();

// Shipping  
logisticsRoutes.use('/deliveryChellan', deliveryChellanRoutes)
logisticsRoutes.use('/stoInvoice', stoInvoiceRoutes)
logisticsRoutes.use('/logisticsReport', logisticsReportRoutes)
logisticsRoutes.use('/ewayBill', ewayBillRoutes)

export default logisticsRoutes