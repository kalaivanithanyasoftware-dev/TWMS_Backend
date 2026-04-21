import express from "express"
import outwardDashboardRoutes from "./outwardInternalDashboardRoutes.js";
import dashboardsRoutes from "./dashboardsRoutes.js";
import globalTPNSearchRoutes from "./globalTPNSearchRoutes.js";
const dashboardRoutes = express.Router();

dashboardRoutes.use('/outward-dashboard', outwardDashboardRoutes)
dashboardRoutes.use('/dashboards', dashboardsRoutes)
dashboardRoutes.use('/globalTPNSearch', globalTPNSearchRoutes)

export default dashboardRoutes