import express from "express"
import { performCMRequestAction } from "../../controller/planning/CMMRRequestController.js";
const CMMRRequestRoutes = express.Router();

CMMRRequestRoutes.post('/perform-cm-request', performCMRequestAction)

export default CMMRRequestRoutes