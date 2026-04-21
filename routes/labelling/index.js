import express from "express"
import labelGenerationRoutes from "./labelGenerationRoutes.js";
import labelPrintRoutes from "./labelPrintRoutes.js";
import boxNumbersRoutes from "./boxNumbersRoutes.js";

const labellingRoutes = express.Router();

// Labelling  
labellingRoutes.use('/labelGeneration', labelGenerationRoutes)
labellingRoutes.use('/labelPrint', labelPrintRoutes)
labellingRoutes.use('/boxNumbers', boxNumbersRoutes)

export default labellingRoutes