import express from "express"
import { performBoxDenominationActions } from "../../controller/picking/boxDenominationController.js";
const boxDenominationRoutes = express.Router();

boxDenominationRoutes.post('/performBoxDenominationActions', performBoxDenominationActions)


export default boxDenominationRoutes