import express from "express"
import { performFQAChecklistReportActions } from "../../controller/fqa/fqaChecklistReportController.js";
const fqaChecklistReportRoutes = express.Router();

fqaChecklistReportRoutes.post('/performFQAChecklistReportActions', performFQAChecklistReportActions)

export default fqaChecklistReportRoutes

