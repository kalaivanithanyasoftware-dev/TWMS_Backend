import express from "express"
import outwardVerificationRoutes from "./outwardVerificationRoutes.js";
import stockTransferOrderRoutes from "./stockTransferOrderRoutes.js";
import loadingConfirmationRoutes from "./loadingConfirmationRoutes.js";
import shipoutRoutes from "./shipoutRoutes.js";
import shippingReportRoutes from "./shippingReportRoutes.js";
import outboundDocumentationRoutes from "./outboundDocumentationRoutes.js";
import orderTrackingRoutes from "./orderTrackingRoutes.js";
import packingListRoutes from "./packingListRoutes.js";
import obd542ReversalRoutes from "./obd542ReversalRoutes.js";

const shippingRoutes = express.Router();

// Shipping  
shippingRoutes.use('/outwardVerification', outwardVerificationRoutes)
shippingRoutes.use('/stockTransferOrder', stockTransferOrderRoutes)
shippingRoutes.use('/loadingConfirmation', loadingConfirmationRoutes)
shippingRoutes.use('/outboundDocumentation', outboundDocumentationRoutes)
shippingRoutes.use('/shipout', shipoutRoutes)
shippingRoutes.use('/shippingReport', shippingReportRoutes)
shippingRoutes.use('/orderTracking', orderTrackingRoutes)
shippingRoutes.use('/packingList', packingListRoutes)
shippingRoutes.use('/obd542Reversal', obd542ReversalRoutes)

export default shippingRoutes