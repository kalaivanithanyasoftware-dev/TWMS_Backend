import express from "express"
import supplierRoutes from "./supplierRoutes.js";
import partRoutes from "./partRoutes.js";
import locationRoutes from "./locationRoutes.js";
import mpnTpnMappingRoutes from "./mpnTpnMappingRoutes.js";
import docksRoutes from "./docksRoutes.js";
import ModeOfTransportRoutes from "./ModeOfTransportRoutes.js";
import InwardDocTypeRoutes from "./InwardDocTypeRoutes.js";
import reasonsRoutes from "./reasonRoutes.js";
import commodityRoutes from "./commodityRoutes.js";
import checklistRoutes from "./checklistRoutes.js";
const masterRoutes = express.Router();

// Masters   
masterRoutes.use('/suppliers', supplierRoutes)
masterRoutes.use('/part', partRoutes)
masterRoutes.use('/location', locationRoutes)
masterRoutes.use('/mpn-tpn-mapping', mpnTpnMappingRoutes)
masterRoutes.use('/docks', docksRoutes)
masterRoutes.use('/mode-of-transport', ModeOfTransportRoutes)
masterRoutes.use('/inwardDocType', InwardDocTypeRoutes)
masterRoutes.use('/reasons', reasonsRoutes)
masterRoutes.use('/commodity', commodityRoutes)
masterRoutes.use('/checklist', checklistRoutes);

export default masterRoutes