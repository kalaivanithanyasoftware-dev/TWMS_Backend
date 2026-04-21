import express from "express"
import sapStockListRoutes from "./sapStockListRoutes.js";
import inventoryRoutes from "./inventoryRoutes.js";
import mixedTPNRoutes from "./mixedTPNRoutes.js";
import locationTransferRoutes from "./locationTransferRoutes.js";
import cycleCountRoutes from "./cycleCountRoutes.js";
import SAPStockRoutes from "./SAPStockRoutes.js";

const binningRoutes = express.Router();

// Binning 
binningRoutes.use('/sapstocklist', sapStockListRoutes)
binningRoutes.use('/inventory', inventoryRoutes)
binningRoutes.use('/cycleCount', cycleCountRoutes)
binningRoutes.use('/mixed-tpn', mixedTPNRoutes)
binningRoutes.use('/locationTransfer', locationTransferRoutes)
binningRoutes.use('/sap-stock', SAPStockRoutes)

export default binningRoutes