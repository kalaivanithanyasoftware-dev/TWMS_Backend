import express from "express"
import shelfLifeExpiryRoutes from "./shelfLifeExpiryRoutes.js";
import dailyStatusReportRoutes from "./dailyStatusReportRoutes.js";
import sapAuditReportRoutes from "./sapAuditReportRoutes.js";
import auditLogsRoutes from "./auditLogsRoutes.js";
const reportsRoutes = express.Router();

reportsRoutes.use('/shelfLifeExpiry', shelfLifeExpiryRoutes)
reportsRoutes.use('/dailyStatusReport', dailyStatusReportRoutes)
reportsRoutes.use('/sapAuditReport', sapAuditReportRoutes)
reportsRoutes.use('/auditLogs', auditLogsRoutes)

export default reportsRoutes