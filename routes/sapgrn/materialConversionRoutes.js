import express from "express"
import { performMaterialConversionAction } from "../../controller/sapgrn/materialConversionController.js";
const materialConversionRoutes = express.Router();

materialConversionRoutes.post('/performMaterialConversionAction', performMaterialConversionAction)

export default materialConversionRoutes