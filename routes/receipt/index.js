import express from "express"
import uploadInwardDataRoutes from "./uploadInwardDataRoutes.js";
import physicalVerificationRoutes from "./physicalVerificationRoutes.js";
import dockAllocationRoutes from "./dockAllocationRoutes.js";
import gateEntryRoutes from "./gateEntryRoutes.js";
import inwardReportRoutes from "./inwardReportRoutes.js";
const inwardRoutes = express.Router();

// Inward  
inwardRoutes.use('/gate-entry', gateEntryRoutes)
inwardRoutes.use('/docks-allocation', dockAllocationRoutes)
inwardRoutes.use('/upload-inward', uploadInwardDataRoutes)
inwardRoutes.use('/physical-verification', physicalVerificationRoutes)
inwardRoutes.use('/inwardReport', inwardReportRoutes)
export default inwardRoutes