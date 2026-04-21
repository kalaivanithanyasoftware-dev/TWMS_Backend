import express from "express"
import { performOBD542ReversalAction } from "../../controller/shipping/obd542ReversalController.js";
const obd542ReversalRoutes = express.Router();

obd542ReversalRoutes.post('/performOBD542ReversalAction', performOBD542ReversalAction)

export default obd542ReversalRoutes