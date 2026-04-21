import express from "express"
import { performMaterialConsumptionAction } from "../../controller/sapgrn/materialConsumptionController.js";
const materialConsumptionRoutes = express.Router();

materialConsumptionRoutes.post('/performMaterialConsumptionAction', performMaterialConsumptionAction)

export default materialConsumptionRoutes