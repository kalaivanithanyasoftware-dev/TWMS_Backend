import express from "express"
import { performUserProfileAction } from "../../controller/settings/userProfileController.js";
const usersProfileRoutes = express.Router();

usersProfileRoutes.post('/performUserProfileAction', performUserProfileAction)

export default usersProfileRoutes