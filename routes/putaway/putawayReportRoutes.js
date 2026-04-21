import express from "express"
import { performPutawayReportActions } from "../../controller/putaway/putawayReportController.js";
const putawayReportRoutes = express.Router();

putawayReportRoutes.post('/performPutawayReportActions', performPutawayReportActions)

export default putawayReportRoutes