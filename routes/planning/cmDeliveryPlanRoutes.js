import express from "express"
import { performCMDeliveryPlanAction, performCMvsSAP, performSAPvsInventory } from "../../controller/planning/cmDeliveryPlanController.js";
const cmDeliveryPlanRoutes = express.Router();

cmDeliveryPlanRoutes.post('/cm-delivery-plan', performCMDeliveryPlanAction)
cmDeliveryPlanRoutes.post('/cmvssap', performCMvsSAP)
cmDeliveryPlanRoutes.post('/sap-vs-inventory', performSAPvsInventory)

export default cmDeliveryPlanRoutes