import express from "express"
import { performUpdateGRNAction } from "../../controller/sapgrn/updateGRNController.js";
const updateGRNRoutes = express.Router();

updateGRNRoutes.post('/performUpdateGRNAction', performUpdateGRNAction)

export default updateGRNRoutes