import express from "express"
import { performChecklistAction } from "../../controller/masters/checklistController.js";

const checklistRoutes = express.Router();

checklistRoutes.post('/performChecklistAction', performChecklistAction)

export default checklistRoutes