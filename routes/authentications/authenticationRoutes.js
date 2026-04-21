import express from "express";
import { checkAutoLogin, loginSupplier, loginUser, logoutAllUser, logoutDevice, logoutUser, logoutUserAllDevice, registerUser, unlockUserScreen } from "../../controller/authentication/authenticationController.js";

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/logout-device', logoutDevice)
router.post('/logout-all-device', logoutUserAllDevice)
router.post('/logout-all-user-device', logoutAllUser)
router.post('/unlock-user-screen', unlockUserScreen)
router.post('/check-auto-login', checkAutoLogin)
router.post('/login-supplier', loginSupplier)
export default router;