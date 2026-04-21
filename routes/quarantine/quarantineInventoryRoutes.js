import express from "express"
import { performQuarantineInventoryAction } from "../../controller/quarantine/quarantineInventoryController.js";

const quarantineInventoryRoutes = express.Router();

quarantineInventoryRoutes.post('/performQuarantineInventoryAction', performQuarantineInventoryAction)

export default quarantineInventoryRoutes