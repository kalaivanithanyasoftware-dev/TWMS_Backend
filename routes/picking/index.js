import express from "express"

import pickListGenerationRoutes from "./pickListGenerationRoutes.js";
import pickingDenominationRoutes from "./pickingDenominationRoutes.js";
import boxDenominationRoutes from "./boxDenominationRoutes.js";
import boxLabelingRoutes from "./boxLabelingRoutes.js";
import pickingReportRoutes from "./pickingReportRoutes.js";
const pickingRoutes = express.Router();

// Picking  
pickingRoutes.use('/picklistGeneration', pickListGenerationRoutes)
pickingRoutes.use('/pickingDenomination', pickingDenominationRoutes)
pickingRoutes.use('/pickingReport', pickingReportRoutes)
pickingRoutes.use('/boxDenomination', boxDenominationRoutes)
pickingRoutes.use('/boxLabeling', boxLabelingRoutes)

export default pickingRoutes