import express from "express"
import { performScreenListAction, performScreenMenusAction } from "../../controller/settings/screenlistController.js";
const screenlistRoutes = express.Router();

screenlistRoutes.post('/performScreenListAction', performScreenListAction)
screenlistRoutes.post('/performScreenMenusAction', performScreenMenusAction)
export default screenlistRoutes