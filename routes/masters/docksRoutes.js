import express from "express"
import { performDockAction } from "../../controller/masters/docksController.js";
const docksRoutes = express.Router();

docksRoutes.post('/performDockAction', performDockAction)

export default docksRoutes