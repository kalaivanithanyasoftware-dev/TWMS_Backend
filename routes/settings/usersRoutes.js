import express from "express"
import { performUserAction, updateProfile } from "../../controller/settings/userController.js";
import { performUsersActivityAction } from "../../controller/settings/userActivityController.js";
const userRoutes = express.Router();

userRoutes.post('/users', performUserAction)
userRoutes.post('/performUsersActivityAction', performUsersActivityAction)
userRoutes.post('/update-user-profile', updateProfile)

export default userRoutes