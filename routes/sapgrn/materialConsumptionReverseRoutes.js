import express from "express"
import { performMaterialConsumptionReverseAction } from "../../controller/sapgrn/materialConsumptionReverseController.js";
const materialConsumptionReverseRoutes = express.Router();

materialConsumptionReverseRoutes.post('/performMaterialConsumptionReverseAction', performMaterialConsumptionReverseAction)

export default materialConsumptionReverseRoutes