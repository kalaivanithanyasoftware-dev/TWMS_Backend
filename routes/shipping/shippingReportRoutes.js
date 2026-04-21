import express from "express"
import { performShippingReportActions } from "../../controller/shipping/shippingReportController.js";
const shippingReportRoutes = express.Router();

shippingReportRoutes.post('/performShippingReportActions', performShippingReportActions)

export default shippingReportRoutes