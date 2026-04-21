import express from "express"
import { performOutwardDetailedReportActions } from "../../controller/planning/outwardDetailedReportController.js";
const outwardDetailedReportRoutes = express.Router();

outwardDetailedReportRoutes.post('/performOutwardDetailedReportActions', performOutwardDetailedReportActions)

export default outwardDetailedReportRoutes