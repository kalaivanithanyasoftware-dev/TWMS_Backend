import express from "express"
import { performMaterialConsumptionReverse642Action } from "../../controller/sapgrn/materialConsumptionReverse642Controller.js";
const materialConsumptionReverse642Routes = express.Router();

materialConsumptionReverse642Routes.post('/performMaterialConsumptionReverse642Action', performMaterialConsumptionReverse642Action)

export default materialConsumptionReverse642Routes