import express from "express"
import IQAPreInspectionRoutes from "./IQAPreInspectionRoutes.js";
import IQAConfirmationRoutes from "./IQAConfirmationRoutes.js";
import IQAReportRoutes from "./IQAReportRoutes.js";
import CheckpointReportRoutes from "./CheckpointReportRoutes.js";

const iqaRoutes = express.Router();

// IQA   
iqaRoutes.use('/IQAReport', IQAReportRoutes)
iqaRoutes.use('/IQAConfirmation', IQAConfirmationRoutes)
iqaRoutes.use('/IQAPreInspection', IQAPreInspectionRoutes)
iqaRoutes.use('/CheckpointReport', CheckpointReportRoutes)

export default iqaRoutes