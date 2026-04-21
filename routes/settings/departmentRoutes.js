import express from "express"
import { performDepartmentAction } from "../../controller/settings/departmentController.js";
const departmentRoutes = express.Router();

departmentRoutes.post('/performDepartmentAction', performDepartmentAction)
// departmentRoutes.post('/get-departments-list', getDepartmentsList)
// departmentRoutes.post('/add-department', addDepartment)
// departmentRoutes.post('/update-department', updateDepartment)
// departmentRoutes.post('/update-department-status', updateDepartmentStatus)
// departmentRoutes.post('/delete-department', deleteDepartment)

export default departmentRoutes