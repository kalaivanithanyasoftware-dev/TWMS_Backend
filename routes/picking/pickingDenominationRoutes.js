import express from "express"
import { performPickingDenominationActions } from "../../controller/picking/pickingDenominationController.js";
const pickingDenominationRoutes = express.Router();

pickingDenominationRoutes.post('/performPickingDenominationActions', performPickingDenominationActions)


export default pickingDenominationRoutes