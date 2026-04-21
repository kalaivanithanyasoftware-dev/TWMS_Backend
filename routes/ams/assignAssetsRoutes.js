import express from "express";
import {
    performAssignAssetsAction
} from "../../controller/ams/AssignAssetsController.js";

const assignAssetsRoutes = express.Router();

assignAssetsRoutes.post('/performAssignAssetsAction', performAssignAssetsAction);

export default assignAssetsRoutes;