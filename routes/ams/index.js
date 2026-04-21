import express from "express";
import assetMaintenanceTypeRoutes from "./assetMaintenanceTypeRoutes.js";
import assetCategoryRoutes from "./assetCategoryRoutes.js";
import assetTypeRoutes from "./assetTypeRoutes.js";
import BrandMasterRoutes from "./brandMasterRoutes.js";
import assetsRoutes from "./assetsRoutes.js";
import AmsvendorRoutes from "./amsVendorRoutes.js";

import assetScrapRoutes from "./assetScrapRoutes.js";
import mypropertyRoutes from "./mypropertyRoutes.js";
import approveTicketRoutes from "./approveTicketRoutes.js";
import supportTicketRoutes from "./supportTicketRoutes.js";
import assignAssetsRoutes from "./assignAssetsRoutes.js";


const AMSRoutes = express.Router();
AMSRoutes.use('/assetcategory', assetCategoryRoutes)
AMSRoutes.use('/assettypes', assetTypeRoutes)
AMSRoutes.use('/brandmasters', BrandMasterRoutes)
AMSRoutes.use('/asset-maintenance-type', assetMaintenanceTypeRoutes);
AMSRoutes.use('/Assets', assetsRoutes);
AMSRoutes.use('/amsvendors', AmsvendorRoutes)
AMSRoutes.use('/asset-scrap', assetScrapRoutes);
AMSRoutes.use('/my-property', mypropertyRoutes);
AMSRoutes.use('/approve-ticket', approveTicketRoutes);
AMSRoutes.use('/support-ticket', supportTicketRoutes);
AMSRoutes.use('/assignAssets', assignAssetsRoutes);

export default AMSRoutes;
