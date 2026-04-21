import express from "express"
import materialDiscrepancyRoutes from "./materialDiscrepancyRoutes.js";
import materialAcknowledgementRoutes from "./materialAcknowledgementRoutes.js";
import materialAcknowledgementReportRoutes from "./materialAcknowledgementReportRoutes.js";

const shipOutRoutes = express.Router();

// Ship Out  
shipOutRoutes.use('/discrepancy', materialDiscrepancyRoutes)
shipOutRoutes.use('/materialAcknowledgement', materialAcknowledgementRoutes)
shipOutRoutes.use('/materialAcknowledgementReport', materialAcknowledgementReportRoutes)

export default shipOutRoutes