import express from "express";
import { performShiftAction } from "../../controller/settings/shiftController.js"

const shiftRoutes = express.Router();

shiftRoutes.post('/performShiftAction', performShiftAction);


export default shiftRoutes;

