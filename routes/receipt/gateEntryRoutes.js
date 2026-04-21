import express from "express"
import {  performGateEntryAction } from "../../controller/receipt/gateEntryController.js";
const gateEntryRoutes = express.Router();

gateEntryRoutes.post('/performGateEntryAction', performGateEntryAction) 


export default gateEntryRoutes