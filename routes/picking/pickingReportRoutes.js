import express from "express"
import { performPickingReportActions } from "../../controller/picking/pickingReportController.js";
const pickingReportRoutes = express.Router();

pickingReportRoutes.post('/performPickingReportActions', performPickingReportActions)


export default pickingReportRoutes