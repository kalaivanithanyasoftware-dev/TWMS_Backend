import express from "express";

import { performSupportTicketAction } from "../../controller/ams/supportTicketController.js";

const supportTicketRoutes = express.Router();


supportTicketRoutes.post('/perform-supportticket-action', performSupportTicketAction);

export default supportTicketRoutes;