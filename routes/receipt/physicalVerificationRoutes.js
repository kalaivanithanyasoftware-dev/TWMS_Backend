import express from "express"
import { performBoxLabelPrintAction, performInwardPrintAction, performPhysicalVerificationAction } from "../../controller/receipt/physicalVerificationController.js";
const physicalVerificationRoutes = express.Router();

physicalVerificationRoutes.post('/performPhysicalVerificationAction', performPhysicalVerificationAction)
physicalVerificationRoutes.post('/performInwardPrintAction', performInwardPrintAction)
physicalVerificationRoutes.post('/performBoxLabelPrintAction', performBoxLabelPrintAction)

export default physicalVerificationRoutes