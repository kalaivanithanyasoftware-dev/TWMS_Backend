import express from "express"
import { performlocationTransferActions } from "../../controller/binning/locationTransferController.js";
const locationTransferRoutes = express.Router();

locationTransferRoutes.post('/performlocationTransferActions', performlocationTransferActions)

export default locationTransferRoutes