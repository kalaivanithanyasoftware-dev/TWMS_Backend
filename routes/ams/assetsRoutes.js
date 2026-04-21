import express from "express";
import {
    performAssetsAction
} from "../../controller/ams/assetsController.js";

const assetsRoutes = express.Router();

assetsRoutes.post('/Assets', performAssetsAction);

export default assetsRoutes;
