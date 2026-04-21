import express from "express"
import { performOutwardVerificationActions } from "../../controller/shipping/outwardVerificationController.js";
const outwardVerificationRoutes = express.Router();

outwardVerificationRoutes.post('/performOutwardVerificationActions', performOutwardVerificationActions)

export default outwardVerificationRoutes