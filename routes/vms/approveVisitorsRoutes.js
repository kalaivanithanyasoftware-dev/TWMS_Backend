import express from "express";
import { performApproveVisitorAction } from "../../controller/vms/approveVisitorsController.js";

const approveVisitorsRoutes = express.Router();


approveVisitorsRoutes.post('/performApproveVisitorAction', performApproveVisitorAction);

export default approveVisitorsRoutes;