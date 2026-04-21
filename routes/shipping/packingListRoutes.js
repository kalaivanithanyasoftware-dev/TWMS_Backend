import express from "express" 
import { performPackingListAction } from "../../controller/shipping/packingListController.js";
const packingListRoutes = express.Router();

packingListRoutes.post('/performPackingListAction', performPackingListAction)

export default packingListRoutes