import express from "express"
import { performCommodityAction } from "../../controller/masters/commodityController.js";
const commodityRoutes = express.Router();

commodityRoutes.post('/performCommodityAction', performCommodityAction)

export default commodityRoutes