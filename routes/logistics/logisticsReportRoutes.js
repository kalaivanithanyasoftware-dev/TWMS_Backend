import express from "express"
import { performLogisticsReportActions } from "../../controller/logistics/logisticsReportController.js";
const logisticsReportRoutes = express.Router();

logisticsReportRoutes.post('/performLogisticsReportActions', performLogisticsReportActions)

export default logisticsReportRoutes