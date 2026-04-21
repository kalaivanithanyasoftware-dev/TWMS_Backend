import express from "express"
import { performBrandMasterAction } from "../../controller/ams/brandMasterController.js";


const brandMasterRoutes = express.Router();

brandMasterRoutes.post('/getBrandMasters', performBrandMasterAction)

export default brandMasterRoutes