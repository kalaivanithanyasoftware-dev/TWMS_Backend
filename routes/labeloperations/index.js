import express from "express"
import labelSplitupRoutes from "./labelSplitupRoutes.js";
import labelEditRoutes from "./labelEditRoutes.js";

const labelOperationsRoutes = express.Router();

// Label Operations 
labelOperationsRoutes.use('/labelSplit', labelSplitupRoutes)
labelOperationsRoutes.use('/labelEdit', labelEditRoutes)

export default labelOperationsRoutes