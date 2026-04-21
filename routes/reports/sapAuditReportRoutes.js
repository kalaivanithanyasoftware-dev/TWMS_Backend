import express from "express"
import { performSAPAuditReportActions } from "../../controller/reports/sapAuditReportController.js";
const sapAuditReportRoutes = express.Router();

sapAuditReportRoutes.post('/performSAPAuditReportActions', performSAPAuditReportActions)

export default sapAuditReportRoutes