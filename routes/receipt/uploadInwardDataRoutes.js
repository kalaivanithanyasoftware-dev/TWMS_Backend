import express from "express"
import { performInwardDataActions } from "../../controller/receipt/uploadInwardDataController.js";
const uploadInwardDataRoutes = express.Router();

uploadInwardDataRoutes.post('/performInwardDataActions', performInwardDataActions)

export default uploadInwardDataRoutes