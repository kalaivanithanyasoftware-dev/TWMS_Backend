import express from "express"
import { performLabelSplitActions } from "../../controller/labeloperations/labelSplitupController.js";
const labelSplitupRoutes = express.Router();

labelSplitupRoutes.post('/performLabelSplitActions', performLabelSplitActions)

export default labelSplitupRoutes