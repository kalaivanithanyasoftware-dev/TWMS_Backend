import express from "express"
import { performLabelPrintActions } from "../../controller/labelling/labelPrintController.js";
const labelPrintRoutes = express.Router();

labelPrintRoutes.post('/performLabelPrintActions', performLabelPrintActions)

export default labelPrintRoutes