import express from "express"
import { performDashboardsActions } from "../../controller/dashboards/dashboardsController.js";
const dashboardsRoutes = express.Router();

dashboardsRoutes.post('/performDashboardsActions', performDashboardsActions)

export default dashboardsRoutes