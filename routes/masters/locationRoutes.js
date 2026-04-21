import express from "express"
import { performLocationAction } from "../../controller/masters/locationController.js";
const locationRoutes = express.Router();

locationRoutes.post('/performLocationAction', performLocationAction)

export default locationRoutes