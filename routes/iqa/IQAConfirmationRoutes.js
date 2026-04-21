import express from "express"
import { performIQAConfirmationActions } from "../../controller/iqa/IQAConfirmationController.js";
const IQAConfirmationRoutes = express.Router();

IQAConfirmationRoutes.post('/performIQAConfirmationActions', performIQAConfirmationActions)

export default IQAConfirmationRoutes;