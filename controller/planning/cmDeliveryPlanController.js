import { sendMail } from "../../config/auth.js";
import { sql } from "../../config/db.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";

const performCMDeliveryPlanAction = async (req, res) => {
    const { action, method } = req.body;
    try {
        const response = await executeSP({
            spName: 'CMDeliveryPlan',
            userDetails: req.userDetails,
            headers: req.headers,
            body: req.body
        });
        const { success, error, results } = response || {};
        const [data = []] = results || [];
        if (action === 'Allocate')
            console.log(results);
        if (!success) {
            return res.status(401).send({
                notify: true,
                success,
                message: errorMessages.somethingWentWrong,
                errorMessage: `${error}`,
                data,
                action,
                method,
            });
        }

        if (['Allocate'].includes(action)) {
            if (error) {
                return res.status(201).send({
                    notify: true,
                    success: false,
                    error: true,
                    message: error,
                    data,
                    action,
                    method,
                });
            }
            if (data.length) {
                try {
                    let htmlBody = ``
                    const emailid = data[0]?.emailid;
                    const pickUserName = data[0]?.pickUserName;
                    for (const obj of data) {
                        htmlBody += `<tr>
                        <td>${obj.mr}</td>  
                        <td>${obj.planno}</td>
                        <td>${obj.tpn}</td> 
                        <td>${obj.assigned_qty}</td> 
                    </tr>`
                    }


                    const html = `<html>

                <head>
                    <style>
                        body {
                            width: 50%;
                            margin-left: auto;
                            margin-right: auto;
                            background-color: #f8f8f8;
                            margin-top: 4rem;
                            margin-bottom: 4rem;
                        }

                        .main {
                            box-shadow: 0 4px 18px rgba(47, 43, 61, .1), 0 0 transparent, 0 0 transparent;
                            border-radius: 5px;
                            background-color: #ffffff;
                            padding: 2rem;
                            display: flex;
                            height: -webkit-fill-available;
                        }

                        .content {
                            position: relative;
                        }

                        .image {
                            text-align: center;
                        }

                        .d-flex {
                            display: flex;
                            justify-content: center;
                        }

                        .container {
                            width: 100%;
                        }

                        .table {
                            width: 100%;
                            border-collapse: collapse;
                        }

                        .table thead th,
                        .table tbody td {
                            padding: 0.6rem 1rem;
                            border: 1px solid;
                            text-align: center;
                        }

                        .mb-0 {
                            margin-bottom: 0;
                        }

                        footer {
                            position: absolute;
                            bottom: 0;
                        }
                    </style>
                </head>

                <body>
                    <div class="main">
                        <div class="content">
                            <header> 
                                <h3>📦 A plan has been assigned for material picking</h3> 
                            </header>
                            <p>Dear ${pickUserName || 'User'},</p>
                            <p>
                                A plan has been assigned to you for picking materials.  
                            </p>
                            <div class="d-flex">
                                <div class="container">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>PO /Order #</th>
                                                <th>Delivery #</th>
                                                <th>Requested TPN</th>
                                                <th>Assigned Qty</th> 
                                            </tr>
                                        </thead>
                                        <tbody>${htmlBody}</tbody>
                                    </table>
                                </div>
                            </div>
                            <footer>
                                <p class="mb-0">Tejas Networks</p>
                            </footer>
                        </div>
                    </div>
                </body>

                </html>`

                    await sendMail({
                        host: '192.168.0.174',
                        secure: false,
                        subject: '📢 A plan is assigned to you to pick materials',
                        from: 'noreply@aafees.com',
                        to: emailid,
                        port: 25,
                        // cc: '',
                        html
                    })
                } catch (error) {
                    console.log(error);
                }
            }
            return res.status(201).send({ notify: false, success, message: 'success', action, method });
        }
        if (['GetCMRequestSuppliers', 'UsersList'].includes(action)) {
            return res.status(201).send({ notify: false, success, data, action, method });
        }
        if (['Fetch'].includes(action)) {
            const paginate = results[1][0] || {};
            return res.status(201).send({ success, data, paginate, action, method });
        }

        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
};


const performCMvsSAP = async (req, res) => {
    const { action, method, } = req.body;

    try {
        const response = await executeSP({
            spName: 'CMvsSAP',
            userDetails: req.userDetails,
            headers: req.headers,
            body: req.body
        });
        const { success, error, results } = response

        const [data = []] = results

        if (!success) {
            return res.status(401).send({
                notify: true,
                success,
                message: errorMessages.somethingWentWrong,
                errorMessage: `${error}`,
                action,
                method,
            });
        }

        if (['Fetch'].includes(action)) {
            const paginate = results[1][0] || {};
            return res.status(201).send({ success, data, paginate, action, method });
        }

        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
};


const performSAPvsInventory = async (req, res) => {
    const { globalPlant, plantid: userPlantid } = req.userDetails.user;
    const {
        globalPlantId,
        plantid,
        totalentry: limit,
        pageNo,
        search = '',
        action,
        method,
    } = req.body;

    const offSet = (pageNo - 1) * limit;

    try {
        const { success, error, results: [data = [], [{ count: totalRecords = 0 } = {}] = []] } = await executeSP([
            {
                sp: `SAPvsInventory`,
                params: [
                    { name: 'search', type: sql.NVarChar, value: '%' + search?.trim() + '%' },
                    { name: 'offset', type: sql.Int, value: offSet },
                    { name: 'limit', type: sql.Int, value: limit },
                    { name: 'globalPlantId', type: sql.Int, value: globalPlantId },
                    { name: 'plantid', type: sql.Int, value: globalPlant ? plantid : userPlantid },
                    { name: 'action', type: sql.NVarChar, value: action }
                ],
            },
        ]);

        if (!success) {
            return res.status(401).send({
                notify: true,
                success,
                message: errorMessages.somethingWentWrong,
                errorMessage: `${error}`,
                action,
                method,
            });
        }

        if (['Fetch'].includes(action)) {
            const totalPage = Math.ceil(totalRecords / limit);
            return res.status(201).send({ success, data, paginate: { totalPage, totalRecords }, action, method });
        }

        return res.status(201).send({ notify: false, success, message: 'Invalid Type', action, method });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` });
    }
};

export {
    performCMDeliveryPlanAction,
    performCMvsSAP,
    performSAPvsInventory
}