import express from "express"
import { performCheckpointReportActions } from "../../controller/iqa/checkpointReportController.js";
const CheckpointReportRoutes = express.Router();

CheckpointReportRoutes.post('/performCheckpointReportActions', performCheckpointReportActions)

export default CheckpointReportRoutes;