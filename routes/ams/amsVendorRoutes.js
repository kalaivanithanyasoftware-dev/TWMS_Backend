import express from "express"

import { performAmsVendorAction } from "../../controller/ams/amsVendorController.js";
const AmsvendorRoutes = express.Router();

AmsvendorRoutes.post('/perform-amsvendor-action', performAmsVendorAction)

export default AmsvendorRoutes