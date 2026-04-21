import express from "express"
import { performOutboundDocumentationActions } from "../../controller/shipping/outboundDocumentationController.js";
const outboundDocumentationRoutes = express.Router();

outboundDocumentationRoutes.post('/performOutboundDocumentationActions', performOutboundDocumentationActions)

export default outboundDocumentationRoutes