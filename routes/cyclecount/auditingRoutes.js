import express from "express"
import { performAuditingActions } from "../../controller/cyclecount/auditingController.js";
const auditingRoutes = express.Router();

auditingRoutes.post('/performAuditingActions', performAuditingActions)

export default auditingRoutes