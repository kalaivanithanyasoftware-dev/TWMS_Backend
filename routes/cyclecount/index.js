import express from "express"
import auditingRoutes from "./auditingRoutes.js";
import auditingReportRoutes from "./auditingReportRoutes.js";

const cycleCountRoutes = express.Router();

// Label Operations 
cycleCountRoutes.use('/auditing', auditingRoutes)
cycleCountRoutes.use('/auditingReport', auditingReportRoutes)

export default cycleCountRoutes