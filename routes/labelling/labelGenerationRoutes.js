import express from "express"
import { performLabelGenerationActions } from "../../controller/labelling/labelGenerationController.js";
const labelGenerationRoutes = express.Router();

labelGenerationRoutes.post('/performLabelGenerationActions', performLabelGenerationActions)

export default labelGenerationRoutes