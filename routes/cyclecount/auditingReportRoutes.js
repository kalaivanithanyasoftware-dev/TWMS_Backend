import express from "express"
import { performAuditingReportActions } from "../../controller/cyclecount/auditingReportController.js";
const auditingReportRoutes = express.Router();

auditingReportRoutes.post('/performAuditingReportActions', performAuditingReportActions)

export default auditingReportRoutes