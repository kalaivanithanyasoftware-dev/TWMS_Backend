import express from "express"
import { getOutwardTATHours } from "../../controller/dashboards/outwardInternalDashboardController.js";
const outwardDashboardRoutes = express.Router();

outwardDashboardRoutes.post('/get-outward-tat-hours', getOutwardTATHours)

export default outwardDashboardRoutes