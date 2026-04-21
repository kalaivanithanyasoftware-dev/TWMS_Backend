import express from "express"
import { performOrderTrackingActions } from "../../controller/shipping/orderTrackingController.js";
const orderTrackingReportRoutes = express.Router();

orderTrackingReportRoutes.post('/performOrderTrackingActions', performOrderTrackingActions)

export default orderTrackingReportRoutes