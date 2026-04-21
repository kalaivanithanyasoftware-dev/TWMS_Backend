import express from "express"
import { performScheduleVisitorAction } from "../../controller/vms/scheduleVisitorController.js"; 

const scheduleVisitorsRoutes = express.Router();

scheduleVisitorsRoutes.post('/performScheduleVisitorAction', performScheduleVisitorAction)

export default scheduleVisitorsRoutes