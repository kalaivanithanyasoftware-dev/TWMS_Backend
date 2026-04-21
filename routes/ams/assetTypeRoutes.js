import express from "express"
import { performAssetTypeAction } from "../../controller/ams/assetTypeController.js";

const assetTypeRoutes = express.Router();

assetTypeRoutes.post('/AssetType', performAssetTypeAction)

export default assetTypeRoutes
