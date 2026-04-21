import express from "express"
import { performPartAction } from "../../controller/masters/partController.js";
const partRoutes = express.Router();

partRoutes.post('/performPartAction', performPartAction)


export default partRoutes