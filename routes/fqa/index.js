import express from "express"
import qaConfirmationRoutes from "./fqaConfirmationRoutes.js";
import fqaPreInspectionRoutes from "./fqaPreInspectionRoutes.js";
import fqaReportRoutes from "./fqaReportRoutes.js";
import fqaChecklistReportRoutes from "./fqaChecklistRoutes.js";

const fqaRoutes = express.Router();

// FQA  
fqaRoutes.use('/fqaConfirmation', qaConfirmationRoutes)
fqaRoutes.use('/fqaPreInspection', fqaPreInspectionRoutes)
fqaRoutes.use('/fqaReport', fqaReportRoutes)
fqaRoutes.use('/fqaChecklistReport', fqaChecklistReportRoutes)

export default fqaRoutes