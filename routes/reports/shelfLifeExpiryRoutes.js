import express from "express"
import { performInwardShelfLifeExpiryActions, performShelfLifeExpiryActions } from "../../controller/reports/selfLifeExpiryController.js";
const shelfLifeExpiryRoutes = express.Router();

shelfLifeExpiryRoutes.post('/performShelfLifeExpiryActions', performShelfLifeExpiryActions)
shelfLifeExpiryRoutes.post('/performInwardShelfLifeExpiryActions', performInwardShelfLifeExpiryActions)

export default shelfLifeExpiryRoutes