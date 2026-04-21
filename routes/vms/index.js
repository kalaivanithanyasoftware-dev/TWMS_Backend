import express from "express";
import scheduleVisitorRoutes from "./scheduleVisitorsRoutes.js";
import approveVisitorsRoutes from "./approveVisitorsRoutes.js";
import visitorsReportsRoutes from "./visitorsReportsRoutes.js";
import unplannedVisitorsRoutes from "./unplannedVisitorsRoutes.js";

const VMSRoutes = express.Router();

VMSRoutes.use('/scheduleVisitor', scheduleVisitorRoutes);
VMSRoutes.use('/approve-visitor', approveVisitorsRoutes);
VMSRoutes.use('/visitor-report', visitorsReportsRoutes);
VMSRoutes.use('/unplannedVisitors', unplannedVisitorsRoutes)
export default VMSRoutes;