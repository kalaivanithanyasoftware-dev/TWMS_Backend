import express from "express"
import { performFQAQuarantineReportActions, performFQARejectionReportActions, performFQAReportActions } from "../../controller/fqa/fqaReportController.js";
const fqaReportRoutes = express.Router();

fqaReportRoutes.post('/performFQAReportActions', performFQAReportActions)
fqaReportRoutes.post('/performFQAQuarantineReportActions', performFQAQuarantineReportActions)
fqaReportRoutes.post('/performFQARejectionReportActions', performFQARejectionReportActions)

export default fqaReportRoutes