import express from "express"

import pickListGenerationRoutes from "./cmDeliveryPlanRoutes.js";
import CMMRRequestRoutes from "./CMMRRequestRoutes.js";
import outwardDetailedReportRoutes from "./outwardDetailedReportRoutes.js";
import outwardDetailedSplitUpReportRoutes from "./outwardDetailedSplitUpReportRoutes.js";
const planningRoutes = express.Router();

// Picking  
planningRoutes.use('/cm-mr-request', CMMRRequestRoutes)
planningRoutes.use('/cm-delivery-plan', pickListGenerationRoutes)
planningRoutes.use('/outwardDetailedReport', outwardDetailedReportRoutes)
planningRoutes.use('/outwardDetailedSplitUpReport', outwardDetailedSplitUpReportRoutes)

export default planningRoutes