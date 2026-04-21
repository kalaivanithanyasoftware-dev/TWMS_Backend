import express from "express"
import { performDeliveryChellanActions } from "../../controller/logistics/deliveryChellanController.js";
const deliveryChellanRoutes = express.Router();

deliveryChellanRoutes.post('/performDeliveryChellanActions', performDeliveryChellanActions)

export default deliveryChellanRoutes