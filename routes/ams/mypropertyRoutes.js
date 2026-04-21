import express from "express";

import { performMyPropertyAction } from "../../controller/ams/myPropertyController.js";

const mypropertyRoutes = express.Router();


mypropertyRoutes.post('/perform-myproperty-action', performMyPropertyAction);

export default mypropertyRoutes;