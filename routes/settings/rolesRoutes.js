import express from "express"
import { performRolesAction } from "../../controller/settings/rolesController.js";
const rolesRoutes = express.Router();

rolesRoutes.post('/performRolesAction', performRolesAction)


export default rolesRoutes