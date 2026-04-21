import express from "express"
import { getSapStockLists, addSapStockList, uploadSapStockList, updateSapStockList, updateSapStockListStatus, deleteSapStockList } from "../../controller/binning/sapStocklistController.js";
const sapStockListRoutes = express.Router();

sapStockListRoutes.post('/get-sapstocklists', getSapStockLists)
sapStockListRoutes.post('/add-sapstocklist', addSapStockList)
sapStockListRoutes.post('/upload-sapstocklist', uploadSapStockList)
sapStockListRoutes.post('/update-sapstocklist', updateSapStockList)
sapStockListRoutes.post('/update-sapstocklist-status', updateSapStockListStatus)
sapStockListRoutes.post('/delete-sapstocklist', deleteSapStockList)

export default sapStockListRoutes