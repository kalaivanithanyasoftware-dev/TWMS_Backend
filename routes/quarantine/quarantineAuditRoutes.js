import express from "express"
import { performQuarantineAuditAction } from "../../controller/quarantine/quarantineAuditController.js";

const quarantineAuditRoutes = express.Router();

quarantineAuditRoutes.post('/performQuarantineAuditAction', performQuarantineAuditAction)

export default quarantineAuditRoutes