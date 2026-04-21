import express from "express";
import { performInwardDocTypeAction } from "../../controller/masters/inwardDocTypeController.js";

const InwardDocTypeRoutes = express.Router();

InwardDocTypeRoutes.post('/performInwardDocTypeAction', performInwardDocTypeAction);

export default InwardDocTypeRoutes;
