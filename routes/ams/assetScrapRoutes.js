import express from "express";
import { performAssetScrapAction } from "../../controller/ams/assetScrapController.js";

const assetScrapRoutes = express.Router();


assetScrapRoutes.post('/perform-assetscrap-action', performAssetScrapAction);

export default assetScrapRoutes;