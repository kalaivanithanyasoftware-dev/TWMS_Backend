import express from "express"
import { performAuditLogsActions } from "../../controller/reports/auditLogsController.js";
const auditLogsRoutes = express.Router();

auditLogsRoutes.post('/performAuditLogsActions', performAuditLogsActions)

export default auditLogsRoutes