import express from "express"
import { performInwardReportActions } from "../../controller/receipt/inwardReportController.js";
const inwardReportRoutes = express.Router();

inwardReportRoutes.post('/performInwardReportActions', performInwardReportActions)

export default inwardReportRoutes