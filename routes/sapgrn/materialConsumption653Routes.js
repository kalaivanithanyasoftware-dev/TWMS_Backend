import express from "express"
import { performMaterialConsumption653Action } from "../../controller/sapgrn/materialConsumption653Controller.js";
const materialConsumption653Routes = express.Router();

materialConsumption653Routes.post('/performMaterialConsumption653Action', performMaterialConsumption653Action)

export default materialConsumption653Routes