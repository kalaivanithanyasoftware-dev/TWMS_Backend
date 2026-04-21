import express from "express"

import { performAmsSupplierAction } from "../../controller/ams/amsSupplierController.js";
const AmssupplierRoutes = express.Router();

AmssupplierRoutes.post('/perform-amssupplier-action', performAmsSupplierAction)

export default AmssupplierRoutes