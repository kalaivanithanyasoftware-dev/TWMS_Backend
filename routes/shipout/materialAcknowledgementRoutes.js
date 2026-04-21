import express from "express"
import { performMaterialAcknowledgementActions } from "../../controller/shipout/materialAcknowledgementController.js";
const materialAcknowledgementRoutes = express.Router();

materialAcknowledgementRoutes.post('/performMaterialAcknowledgementActions', performMaterialAcknowledgementActions)

export default materialAcknowledgementRoutes