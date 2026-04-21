import express from "express"
import { performPreInspectionActions } from "../../controller/fqa/fqaPreInspectionController.js";
const fqaPreInspectionRoutes = express.Router();

fqaPreInspectionRoutes.post('/performPreInspectionActions', performPreInspectionActions)

export default fqaPreInspectionRoutes