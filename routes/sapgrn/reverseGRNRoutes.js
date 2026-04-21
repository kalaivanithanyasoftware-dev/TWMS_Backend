import express from "express"
import { performReverseGRNAction } from "../../controller/sapgrn/reverseGRNController.js";
const reverseGRNRoutes = express.Router();

reverseGRNRoutes.post('/performReverseGRNAction', performReverseGRNAction)

export default reverseGRNRoutes