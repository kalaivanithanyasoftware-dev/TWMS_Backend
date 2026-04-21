import express from "express"
import { performCycleCountActions } from "../../controller/binning/cycleCountController.js";
const cycleCountRoutes = express.Router();

cycleCountRoutes.post('/performCycleCountActions', performCycleCountActions)

export default cycleCountRoutes