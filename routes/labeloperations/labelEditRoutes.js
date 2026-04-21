import express from "express"
import { performLabelEditActions } from "../../controller/labeloperations/labelEditController.js";
const labelEditRoutes = express.Router();

labelEditRoutes.post('/performLabelEditActions', performLabelEditActions)

export default labelEditRoutes