import { executeSP } from "../../custom/mssqlExecution.js";
import { errorMessages } from "../constant.js";

const performShipOutActions = async (req, res) => {
    const { action, method } = req.body;

    try {
        let PODDocumentName = null
        if (req.files) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            const PODDocument = req.files.PODDocument || ''
            PODDocumentName = 'docs/invoice/' + uniqueSuffix + PODDocument.name
            PODDocument.mv('./assets/docs/invoice/' + uniqueSuffix + PODDocument.name)
        }
        let plannoArr = []
        if (req.body.plannoArr) {
            plannoArr = JSON.parse(req.body.plannoArr)
        }
        const response = await executeSP({
            spName: 'ShipOut',
            userDetails: req.userDetails,
            headers: req.headers,
            body: { ...req.body, plannoArr, PODDocument: PODDocumentName }
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
        if (['Update'].includes(action)) {
            if (error) return res.status(201).send({
                notify: true,
                success: false,
                error: true,
                message: error,
                action, method
            })

            //         const html = `<html>

            // <head>
            //     <style>
            //         body {
            //             width: 50%;
            //             margin-left: auto;
            //             margin-right: auto;
            //             background-color: #f8f8f8;
            //             margin-top: 4rem;
            //             margin-bottom: 4rem;
            //         }

            //         .main {
            //             box-shadow: 0 4px 18px rgba(47, 43, 61, .1), 0 0 transparent, 0 0 transparent;
            //             border-radius: 5px;
            //             background-color: #ffffff;
            //             padding: 2rem;
            //             display: flex;
            //             height: -webkit-fill-available;
            //         }

            //         .content {
            //             position: relative;
            //         }

            //         .image {
            //             text-align: center;
            //         }

            //         .d-flex {
            //             display: flex;
            //             justify-content: center;
            //         }

            //         .container {
            //             width: 100%;
            //         }

            //         .table {
            //             width: 100%;
            //             border-collapse: collapse;
            //         }

            //         .table thead th,
            //         .table tbody td {
            //             padding: 0.6rem 1rem;
            //             border: 1px solid;
            //             text-align: center;
            //         }

            //         .mb-0 {
            //             margin-bottom: 0;
            //         }

            //         footer {
            //             position: absolute;
            //             bottom: 0;
            //         }
            //     </style>
            // </head>

            // <body>
            //     <div class="main">
            //         <div class="content">
            //             <header> 
            //                 <h4 class="text-h4 mb-1">Material Acknowledged ✉️ </h4> 
            //             </header>
            //             <div class="d-flex">
            //                 <div class="container">
            //                     <table class="table">
            //                         <thead>
            //                             <tr>
            //                                 <th>PO /Order #</th>
            //                                 <th>Delivery #</th>
            //                                 <th>Requested TPN</th>
            //                                 <th>Requested Qty</th>
            //                                 <th>Issued Qty</th>
            //                             </tr>
            //                         </thead>
            //                         <tbody>
            //                             <tr>
            //                                 <td>${po}</td>
            //                                 <td>${planno}</td> 
            //                                 <td>${tpn}</td>
            //                                 <td>${pick_qty}</td> 
            //                                 <td>${issued_qty}</td> 
            //                             </tr>
            //                         </tbody>
            //                     </table>
            //                 </div>
            //             </div>
            //             <footer>
            //                 <p class="mb-0">RGP Return Goods Inspection</p>
            //             </footer>
            //         </div>
            //     </div>
            // </body>

            // </html>`
            //         await sendMail({ subject: 'Ready to receive Material', html, to: 'parivallalin@gmail.com,manimaranramesh1402@gmail.com,selvamca1990@gmail.com' })
            return res.status(201).send({ notify: true, success, message: 'success', action, method });
        }

        if (action === 'GetPlannoToValidate') {
            return res.status(201).send({
                notify: false,
                success,
                data,
                action,
                method
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

export {
    performShipOutActions
}