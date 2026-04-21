import express from "express"
import quarantineInventoryRoutes from "./quarantineInventoryRoutes.js";
import quarantineAuditRoutes from "./quarantineAuditRoutes.js";
const quarantineRoutes = express.Router();

quarantineRoutes.use('/quarantineInventory', quarantineInventoryRoutes)
quarantineRoutes.use('/quarantineAudit', quarantineAuditRoutes)

export default quarantineRoutes