import express from "express"
import { performFQAConfirmationActions } from "../../controller/fqa/fqaConfirmationController.js";
const qaConfirmationRoutes = express.Router();

qaConfirmationRoutes.post('/performFQAConfirmationActions', performFQAConfirmationActions)


export default qaConfirmationRoutes