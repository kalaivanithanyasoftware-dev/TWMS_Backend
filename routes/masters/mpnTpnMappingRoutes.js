import express from "express"
import { performMpnTpnMappingAction } from "../../controller/masters/mpnTpnMappingController.js";
const mpnTpnMappingRoutes = express.Router();

mpnTpnMappingRoutes.post('/performMpnTpnMappingAction', performMpnTpnMappingAction)

export default mpnTpnMappingRoutes