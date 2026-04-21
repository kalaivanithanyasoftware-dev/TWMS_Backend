import express from "express"
import { performMaterialConsumption641Action } from "../../controller/sapgrn/materialConsumption641Controller.js";
const materialConsumption641Routes = express.Router();

materialConsumption641Routes.post('/performMaterialConsumption641Action', performMaterialConsumption641Action)

export default materialConsumption641Routes