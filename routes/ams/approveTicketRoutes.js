import express from "express";
import { performApproveTicketAction } from "../../controller/ams/approveTicketController.js";

const approveTicketRoutes = express.Router();


approveTicketRoutes.post('/perform-approveticket-action', performApproveTicketAction);

export default approveTicketRoutes;