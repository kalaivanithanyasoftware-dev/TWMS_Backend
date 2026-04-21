import express from "express"
import rolesRoutes from "./rolesRoutes.js";
import departmentRoutes from "./departmentRoutes.js";
import userRoutes from "./usersRoutes.js";
import screenlistRoutes from "./screenlistRoutes.js";
import plantRoutes from "./plantRoutes.js";
import usersProfileRoutes from "./usersProfileRoutes.js";
import shiftRoutes from "./shiftRoutes.js";
import storageLocationRoutes from "./storageLocationRoutes.js";

const router = express.Router();

// Masters
router.use('/screenlist', screenlistRoutes)
router.use('/shifts', shiftRoutes)
router.use('/users', userRoutes)
router.use('/userProfile', usersProfileRoutes)
router.use('/roles', rolesRoutes)
router.use('/department', departmentRoutes)
router.use('/plants', plantRoutes)
router.use('/storageLocation', storageLocationRoutes)

export default router