import express from "express"
import { performUnplannedVisitorAction } from "../../controller/vms/unplannedVisitorsController.js"; 

const unplannedVisitorsRoutes = express.Router();

unplannedVisitorsRoutes.post('/performUnplannedVisitorAction', performUnplannedVisitorAction)

export default unplannedVisitorsRoutes