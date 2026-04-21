import express from "express"
import { performStorageLocationAction } from "../../controller/settings/storageLocationController.js";


const storageLocationRoutes = express.Router();

storageLocationRoutes.post('/StorageLocation', performStorageLocationAction)

export default storageLocationRoutes
