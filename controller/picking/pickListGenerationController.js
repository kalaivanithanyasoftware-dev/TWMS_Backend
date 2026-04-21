import { sendMail } from "../../config/auth.js";
import { sql } from "../../config/db.js";
import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";



const performPicklistGenerationAction = async (req, res) => {
    const { action, method } = req.body;

    try {
        const response = await executeSP({
            spName: 'PicklistGeneration',
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

        if (['Delete', 'UpdatePrintCount', 'ReAllocate'].includes(action)) {
            if (error) {
                return res.status(201).send({
                    notify: true,
                    success: false,
                    error: true,
                    message: error,
                    action,
                    method,
                });
            }
            if (action === 'ReAllocate') {
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
                            secure: true,
                            subject: '📢 A plan is assigned to you to pick materials',
                            from: 'noreply@aafees.com',
                            to: emailid,
                            port: 587,
                            // cc: '',
                            html
                        })
                    } catch (error) {
                        console.log(error);

                    }
                }
            }
            return res.status(201).send({ notify: false, success, message: 'success', action, method });
        }
        if (action === 'PicklistPrint') {
            return res.status(201).send({
                notify: false, success,
                data,
                tpnWiseQty: results[1] || [],
                doDetails: results?.[2]?.[0] || {},
                errorMessages: results?.[3] || [],
                action,
                method
            });
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

export { performPicklistGenerationAction }