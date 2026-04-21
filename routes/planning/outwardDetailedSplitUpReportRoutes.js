import express from "express"
import { performOutwardDetailedSplitUpReportActions } from "../../controller/planning/outwardDetailedSplitUpReportController.js";
const outwardDetailedSplitUpReportRoutes = express.Router();

outwardDetailedSplitUpReportRoutes.post('/performOutwardDetailedSplitUpReportActions', performOutwardDetailedSplitUpReportActions)

export default outwardDetailedSplitUpReportRoutes