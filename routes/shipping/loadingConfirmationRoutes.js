import express from "express" 
import { performLoadingConfirmationActions } from "../../controller/shipping/loadingConfirmationController.js";
const loadingConfirmationRoutes = express.Router();

loadingConfirmationRoutes.post('/performLoadingConfirmationActions', performLoadingConfirmationActions)

export default loadingConfirmationRoutes