import express from "express"
import putawayRoutes from "./putawayRoutes.js";
import putawayReportRoutes from "./putawayReportRoutes.js";
import inventoryPickedReportRoutes from "./inventoryPickedReportRoutes.js";

const putawayRouters = express.Router();

// Putaway  
putawayRouters.use('/putaway', putawayRoutes)
putawayRouters.use('/putaway-report', putawayReportRoutes)
putawayRouters.use('/inventory-picked-report', inventoryPickedReportRoutes)

export default putawayRouters