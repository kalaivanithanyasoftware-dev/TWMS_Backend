import express from "express";
import {
    performanPlantAction
} from "../../controller/settings/PlantController.js";

const plantRoutes = express.Router();

plantRoutes.post('/performanPlantAction', performanPlantAction);


export default plantRoutes;