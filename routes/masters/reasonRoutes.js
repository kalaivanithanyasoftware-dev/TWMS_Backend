import express from "express"
import { performReasonAction } from "../../controller/masters/reasonController.js";
const reasonsRoutes = express.Router();

reasonsRoutes.post('/get-reasons', performReasonAction)


export default reasonsRoutes