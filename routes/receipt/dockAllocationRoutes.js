import express from "express"
import {   performDockAllocationActions  } from "../../controller/receipt/dockAllocationController.js";
const dockAllocationRoutes = express.Router();

dockAllocationRoutes.post('/performDockAllocationActions', performDockAllocationActions) 

export default dockAllocationRoutes