import express from "express"
import { addMixedTPN, checkValidMpnTpn, deleteMixedTPN, getMixedTPNs } from "../../controller/binning/mixedTPNController.js";
const mixedTPNRoutes = express.Router();

mixedTPNRoutes.post('/get-mixed-tpns', getMixedTPNs)
mixedTPNRoutes.post('/check-valid-mpn-tpn', checkValidMpnTpn)
mixedTPNRoutes.post('/add-mixed-tpn', addMixedTPN)
mixedTPNRoutes.post('/delete-mixed-tpn', deleteMixedTPN)


export default mixedTPNRoutes