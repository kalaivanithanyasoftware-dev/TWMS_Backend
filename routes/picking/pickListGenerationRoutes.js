import express from "express"
import { performPicklistGenerationAction } from "../../controller/picking/pickListGenerationController.js";
const pickListGenerationRoutes = express.Router();

pickListGenerationRoutes.post('/performPicklistGenerationAction', performPicklistGenerationAction)

export default pickListGenerationRoutes