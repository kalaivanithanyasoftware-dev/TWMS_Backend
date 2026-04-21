import express from "express"
import fs from "fs"
import settingsRoutes from "./settings/index.js"
import masterRoutes from "./masters/index.js";
import binningRoutes from "./binning/index.js";
import inwardRoutes from "./receipt/index.js";
import outwardsRoutes from "./outward/index.js";
import labelOperationsRoutes from "./labeloperations/index.js";
import dashboardRoutes from "./dashboards/index.js";

import { getCSVData } from "../controller/settings/userController.js";
import pickingRoutes from "./picking/index.js";
import planningRoutes from "./planning/index.js";
import fqaRoutes from "./fqa/index.js";
import shippingRoutes from "./shipping/index.js";
import shipOutRoutes from "./shipout/index.js";
import iqaRoutes from "./iqa/index.js";
import AMSRoutes from "./ams/index.js";
import putawayRoutes from "./putaway/index.js";
import VMSRoutes from "./vms/index.js";
import logisticsRoutes from "./logistics/index.js";
import reportsRoutes from "./reports/index.js";
import labellingRoutes from "./labelling/index.js";
import sapGRNRoutes from "./sapgrn/index.js";
import cycleCountRoutes from "./cyclecount/index.js";
import quarantineRoutes from "./quarantine/index.js";
const router = express.Router();

// Masters
router.use('/settings', settingsRoutes)
router.use('/masters', masterRoutes)
router.use('/putaway', putawayRoutes)
router.use('/binning', binningRoutes)
router.use('/quarantine', quarantineRoutes)
router.use('/receipt', inwardRoutes)
router.use('/sapgrn', sapGRNRoutes)
router.use('/iqa', iqaRoutes)
router.use('/labelling', labellingRoutes)
router.use('/labelOperations', labelOperationsRoutes)
router.use('/cycleCount', cycleCountRoutes)
router.use('/AMS', AMSRoutes);
router.use('/VMS', VMSRoutes)

router.use('/planning', planningRoutes)
router.use('/picking', pickingRoutes)
router.use('/fqa', fqaRoutes)
router.use('/shipping', shippingRoutes)
router.use('/ship-out', shipOutRoutes)
router.use('/logistics', logisticsRoutes)

router.use('/outwards', outwardsRoutes)
router.use('/dashboards', dashboardRoutes)
router.use('/reports', reportsRoutes)
router.use('/export/csv', getCSVData)

export default router