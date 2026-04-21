import express from "express" 
import { performShipOutActions } from "../../controller/shipping/shipoutController.js";
const shipoutRoutes = express.Router();

shipoutRoutes.post('/performShipOutActions', performShipOutActions)

export default shipoutRoutes