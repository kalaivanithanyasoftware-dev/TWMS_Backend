import express from "express"
import { performIQAPreInspectionActions } from "../../controller/iqa/iqaPreInspectionController.js";
const IQAPreInspectionRoutes = express.Router();

IQAPreInspectionRoutes.post('/performIQAPreInspectionActions', performIQAPreInspectionActions)

export default IQAPreInspectionRoutes;