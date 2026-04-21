import express from "express"
import { performMaterialAcknowledgementReportActions } from "../../controller/shipout/materialAcknowledgementReportController.js";
const materialAcknowledgementReportRoutes = express.Router();

materialAcknowledgementReportRoutes.post('/performMaterialAcknowledgementReportActions', performMaterialAcknowledgementReportActions)

export default materialAcknowledgementReportRoutes