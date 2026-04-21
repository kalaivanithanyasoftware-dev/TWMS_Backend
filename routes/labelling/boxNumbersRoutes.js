import express from "express"
import { performBoxNumbersActions } from "../../controller/labelling/boxNumbersController.js";
const boxNumbersRoutes = express.Router();

boxNumbersRoutes.post('/performBoxNumbersActions', performBoxNumbersActions)

export default boxNumbersRoutes