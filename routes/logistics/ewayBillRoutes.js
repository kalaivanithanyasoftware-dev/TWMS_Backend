import express from "express"
import { performEWayBillActions } from "../../controller/logistics/ewayBillController.js";
const ewayBillRoutes = express.Router();

ewayBillRoutes.post('/performEWayBillActions', performEWayBillActions)

export default ewayBillRoutes