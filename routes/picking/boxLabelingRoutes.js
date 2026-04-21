import express from "express"
import { performBoxLabellingActions } from "../../controller/picking/boxLabellingController.js";
const boxLabelingRoutes = express.Router();

boxLabelingRoutes.post('/performBoxLabellingActions', performBoxLabellingActions)

export default boxLabelingRoutes