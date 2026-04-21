import express from "express"
import { performDailyStatusReportActions } from "../../controller/reports/dailyStatusReportController.js";
const dailyStatusReportRoutes = express.Router();

dailyStatusReportRoutes.post('/performDailyStatusReportActions', performDailyStatusReportActions)

export default dailyStatusReportRoutes