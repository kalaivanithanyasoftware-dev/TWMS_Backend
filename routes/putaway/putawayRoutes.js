import express from "express"
import { performPutawayAction } from "../../controller/putaway/putawayController.js";
const putawayRoutes = express.Router();

putawayRoutes.post('/performPutawayAction', performPutawayAction)

export default putawayRoutes