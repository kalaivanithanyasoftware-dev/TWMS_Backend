import express from "express"
import updateGRNRoutes from "./updateGRNRoutes.js";
import reverseGRNRoutes from "./reverseGRNRoutes.js";
import materialConversionRoutes from "./materialConversionRoutes.js";
import materialConsumptionRoutesRoutes from "./materialConsumptionRoutes.js";
import materialConsumptionReverseRoutes from "./materialConsumptionReverseRoutes.js";

import materialConsumption641Routes from "./materialConsumption641Routes.js";
import materialConsumptionReverse642Routes from "./materialConsumptionReverse642Routes.js";
import materialConsumption653Routes from "./materialConsumption653Routes.js";
import materialConsumptionReverse654Routes from "./materialConsumptionReverse654Routes.js";
const sapGRNRoutes = express.Router();

// Inward   
sapGRNRoutes.use('/updateGRN', updateGRNRoutes)
sapGRNRoutes.use('/reverseGRN', reverseGRNRoutes)
sapGRNRoutes.use('/materialConversion', materialConversionRoutes)
sapGRNRoutes.use('/materialConsumption', materialConsumptionRoutesRoutes)
sapGRNRoutes.use('/materialConsumptionReverse', materialConsumptionReverseRoutes)

sapGRNRoutes.use('/materialConsumption641', materialConsumption641Routes)
sapGRNRoutes.use('/materialConsumptionReverse642', materialConsumptionReverse642Routes)
sapGRNRoutes.use('/materialConsumption653', materialConsumption653Routes)
sapGRNRoutes.use('/materialConsumptionReverse654', materialConsumptionReverse654Routes)

export default sapGRNRoutes