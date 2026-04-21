import express from "express"
import { performMaterialConsumptionReverse654Action } from "../../controller/sapgrn/materialConsumptionReverse654Controller.js";
const materialConsumptionReverse654Routes = express.Router();

materialConsumptionReverse654Routes.post('/performMaterialConsumptionReverse654Action', performMaterialConsumptionReverse654Action)

export default materialConsumptionReverse654Routes