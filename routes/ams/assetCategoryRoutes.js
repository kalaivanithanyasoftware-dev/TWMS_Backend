import express from "express"
import { performAssetCategoryAction } from "../../controller/ams/assetCategoryController.js"; 

const assetCategoryRoutes = express.Router();

assetCategoryRoutes.post('/performAssetCategoryAction', performAssetCategoryAction)

export default assetCategoryRoutes