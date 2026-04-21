import express from "express"
  
import outwardRoutes from "./outwardRoutes.js";
import materialAckRoutes from "./materialAckRoutes.js";
const outwardsRoutes = express.Router();

// Picking   
outwardsRoutes.use('/outward', outwardRoutes)
outwardsRoutes.use('/material-ack', materialAckRoutes)

export default outwardsRoutes