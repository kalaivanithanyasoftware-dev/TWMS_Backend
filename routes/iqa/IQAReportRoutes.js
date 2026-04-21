import express from "express"
import { performIQAReportActions } from "../../controller/iqa/IQAReportController.js";
const IQAReportRoutes = express.Router();

IQAReportRoutes.post('/performIQAReportActions', performIQAReportActions)

export default IQAReportRoutes;