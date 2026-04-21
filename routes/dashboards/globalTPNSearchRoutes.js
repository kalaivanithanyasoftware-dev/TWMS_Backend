import express from "express"
import { performGlobalTPNSearchActions } from "../../controller/dashboards/globalTPNSearchController.js";
const globalTPNSearchRoutes = express.Router();

globalTPNSearchRoutes.post('/performGlobalTPNSearchActions', performGlobalTPNSearchActions)

export default globalTPNSearchRoutes