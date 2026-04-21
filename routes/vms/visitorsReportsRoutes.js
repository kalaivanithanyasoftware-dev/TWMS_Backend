import express from "express";
import { performVisitorReportAction } from "../../controller/vms/visitorsReportsController.js";

const visitorsReportsRoutes = express.Router();


visitorsReportsRoutes.post('/performVisitorReportAction', performVisitorReportAction);

export default visitorsReportsRoutes;