import express from "express"
import {
   performModeOfTransportAction
} from "../../controller/masters/ModeOfTransportController.js";
const ModeOfTransportRoutes = express.Router();

ModeOfTransportRoutes.post('/getMode', performModeOfTransportAction)



export default ModeOfTransportRoutes