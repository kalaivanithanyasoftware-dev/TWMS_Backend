import { changeDateToSqlFormat } from "../../config/auth.js";
import { poolPromise, sql } from "../../config/db.js";

const getOutwardTATHours = async (req, res) => {
    try {
        const { startDateTime, endDateTime, year, month, filterType } = req.body
        let whereQuery = ``
        if (filterType === 'time') {
            whereQuery = ``;
        } else if (filterType === 'year') {
            whereQuery = ` AND YEAR(printdate) = @year`;
        } else if (filterType === 'month') {
            whereQuery = ` AND YEAR(printdate) = @year AND MONTH(printdate) = @month`;
        }
//         let hourQuery = `
// WITH ProcessedData AS (
//     SELECT 
//         id,
//         CASE WHEN CAST(assigned_on AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS PLANNED_DO,
//         CASE WHEN CAST(assigned_on AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_PICK,
//         CASE WHEN CAST(assigned_on AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(denomination_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_PICK_OT,
//         CASE WHEN CAST(assigned_on AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(denomination_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_PICK_AT,

//         CASE WHEN CAST(denomination_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_BOX_DINOM,
//         CASE WHEN CAST(denomination_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(box_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_BOX_DINOM_OT,
//         CASE WHEN CAST(denomination_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(box_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_BOX_DINOM_AT,

//         CASE WHEN CAST(box_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_BOX_LABEL,
//         CASE WHEN CAST(box_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(labeldone_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_BOX_LABEL_OT,
//         CASE WHEN CAST(box_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(labeldone_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_BOX_LABEL_AT,

// 		CASE WHEN CAST(labeldone_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_PRE_INSP,
//         CASE WHEN CAST(labeldone_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(pre_inspect_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_PRE_INSP_OT,
//         CASE WHEN CAST(labeldone_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(pre_inspect_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_PRE_INSP_AT,

// 		CASE WHEN CAST(pre_inspect_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_FQA,
//         CASE WHEN CAST(pre_inspect_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(fqa_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_FQA_OT,
//         CASE WHEN CAST(pre_inspect_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(fqa_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_FQA_AT,

// 		CASE WHEN CAST(fqa_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_OUT_VERIFI,
//         CASE WHEN CAST(fqa_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(outward_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_OUT_VERIFI_OT,
//         CASE WHEN CAST(fqa_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(outward_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_OUT_VERIFI_AT,

// 		CASE WHEN CAST(outward_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_OBD,
//         CASE WHEN CAST(outward_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(obd_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_OBD_OT,
//         CASE WHEN CAST(outward_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(obd_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_OBD_AT,

// 		CASE WHEN CAST(obd_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_LOGI_DOC,
//         CASE WHEN CAST(obd_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(logistics_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_LOGI_DOC_OT,
//         CASE WHEN CAST(obd_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(logistics_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_LOGI_DOC_AT,

// 		CASE WHEN CAST(logistics_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_OWT_DOC,
//         CASE WHEN CAST(logistics_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(outward_docs_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_OWT_DOC_OT,
//         CASE WHEN CAST(logistics_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(outward_docs_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_OWT_DOC_AT,

// 		CASE WHEN CAST(outward_docs_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_EWAY_BILL,
//         CASE WHEN CAST(outward_docs_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(eway_bill_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_EWAY_BILL_OT,
//         CASE WHEN CAST(outward_docs_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(eway_bill_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_EWAY_BILL_AT,

// 		CASE WHEN CAST(eway_bill_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_SHIP_OUT,
//         CASE WHEN CAST(eway_bill_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(ship_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_SHIP_OUT_OT,
//         CASE WHEN CAST(eway_bill_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(ship_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_SHIP_OUT_AT,

// 		CASE WHEN CAST(ship_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_ACK,
//         CASE WHEN CAST(ship_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(ack_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_ACK_OT,
//         CASE WHEN CAST(ship_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(ack_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_ACK_AT

//     FROM planning_outward WHERE del_status = 0 ${whereQuery}
// )
// SELECT
// 	   SUM(PLANNED_DO) PLANNED_DO,
//        SUM(TOT_PICK) AS TOT_PICK,
//        SUM(TOT_PICK_OT) AS TOT_PICK_OT,
//        SUM(TOT_PICK_AT) AS TOT_PICK_AT,

//        SUM(TOT_BOX_DINOM) AS TOT_BOX_DINOM,
//        SUM(TOT_BOX_DINOM_OT) AS TOT_BOX_DINOM_OT,
//        SUM(TOT_BOX_DINOM_AT) AS TOT_BOX_DINOM_AT,

// 	   SUM(TOT_BOX_LABEL) AS TOT_BOX_LABEL,
//        SUM(TOT_BOX_LABEL_OT) AS TOT_BOX_LABEL_OT,
//        SUM(TOT_BOX_LABEL_AT) AS TOT_BOX_LABEL_AT,

// 	   SUM(TOT_PRE_INSP) AS TOT_PRE_INSP,
//        SUM(TOT_PRE_INSP_OT) AS TOT_PRE_INSP_OT,
//        SUM(TOT_PRE_INSP_AT) AS TOT_PRE_INSP_AT,

// 	   SUM(TOT_FQA) AS TOT_FQA,
//        SUM(TOT_FQA_OT) AS TOT_FQA_OT,
//        SUM(TOT_FQA_AT) AS TOT_FQA_AT,

// 	   SUM(TOT_OUT_VERIFI) AS TOT_OUT_VERIFI,
//        SUM(TOT_OUT_VERIFI_OT) AS TOT_OUT_VERIFI_OT,
//        SUM(TOT_OUT_VERIFI_AT) AS TOT_OUT_VERIFI_AT,

// 	   SUM(TOT_OBD) AS TOT_OBD,
//        SUM(TOT_OBD_OT) AS TOT_OBD_OT,
//        SUM(TOT_OBD_AT) AS TOT_OBD_AT,

// 	   SUM(TOT_LOGI_DOC) AS TOT_LOGI_DOC,
//        SUM(TOT_LOGI_DOC_OT) AS TOT_LOGI_DOC_OT,
//        SUM(TOT_LOGI_DOC_AT) AS TOT_LOGI_DOC_AT,

// 	   SUM(TOT_OWT_DOC) AS TOT_OWT_DOC,
//        SUM(TOT_OWT_DOC_OT) AS TOT_OWT_DOC_OT,
//        SUM(TOT_OWT_DOC_AT) AS TOT_OWT_DOC_AT,

// 	   SUM(TOT_EWAY_BILL) AS TOT_EWAY_BILL,
//        SUM(TOT_EWAY_BILL_OT) AS TOT_EWAY_BILL_OT,
//        SUM(TOT_EWAY_BILL_AT) AS TOT_EWAY_BILL_AT,

// 	   SUM(TOT_SHIP_OUT) AS TOT_SHIP_OUT,
//        SUM(TOT_SHIP_OUT_OT) AS TOT_SHIP_OUT_OT,
//        SUM(TOT_SHIP_OUT_AT) AS TOT_SHIP_OUT_AT,

// 	   SUM(TOT_ACK) AS TOT_ACK,
//        SUM(TOT_ACK_OT) AS TOT_ACK_OT,
//        SUM(TOT_ACK_AT) AS TOT_ACK_AT

//        FROM ProcessedData;`
//         if (filterType === 'time') {
//             hourQuery = ` 
// WITH TimeSlots AS (
//     SELECT '07:00 - 08:00' AS TimeSlot, 'A' AS Shift UNION ALL
//     SELECT '08:00 - 09:00', 'A' UNION ALL
//     SELECT '09:00 - 10:00', 'A' UNION ALL
//     SELECT '10:00 - 11:00', 'A' UNION ALL
//     SELECT '11:00 - 12:00', 'A' UNION ALL
//     SELECT '12:00 - 13:00', 'A' UNION ALL
//     SELECT '13:00 - 14:00', 'A' UNION ALL
//     SELECT '14:00 - 15:00', 'A' UNION ALL
//     SELECT '15:00 - 16:00', 'B' UNION ALL
//     SELECT '16:00 - 17:00', 'B' UNION ALL
//     SELECT '17:00 - 18:00', 'B' UNION ALL
//     SELECT '18:00 - 19:00', 'B' UNION ALL
//     SELECT '19:00 - 20:00', 'B' UNION ALL
//     SELECT '20:00 - 21:00', 'B' UNION ALL
//     SELECT '21:00 - 22:00', 'B' UNION ALL
//     SELECT '22:00 - 23:00', 'B' UNION ALL
//     SELECT '23:00 - 00:00', 'C' UNION ALL
//     SELECT '00:00 - 01:00', 'C' UNION ALL
//     SELECT '01:00 - 02:00', 'C' UNION ALL
//     SELECT '02:00 - 03:00', 'C' UNION ALL
//     SELECT '03:00 - 04:00', 'C' UNION ALL
//     SELECT '04:00 - 05:00', 'C' UNION ALL
//     SELECT '05:00 - 06:00', 'C' UNION ALL
//     SELECT '06:00 - 07:00', 'C'
// ),
// ProcessedData AS (
//     SELECT 
//         id,
// 		CASE 
//         WHEN DATEPART(HOUR, GETDATE()) >= 7 AND DATEPART(HOUR, GETDATE()) < 15 THEN 'A'
//         WHEN DATEPART(HOUR, GETDATE()) >= 15 AND DATEPART(HOUR, GETDATE()) < 23 THEN 'B'
//         ELSE 'C'
//     END AS Shift, CONVERT(VARCHAR(5), DATEADD(HOUR, DATEDIFF(HOUR, 0, assigned_on), 0), 108) 
//     + ' - ' + 
//     CONVERT(VARCHAR(5), DATEADD(HOUR, DATEDIFF(HOUR, 0, assigned_on) + 1, 0), 108) 
//     AS TimeSlot,
//         CASE WHEN CAST(printdate AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS PLANNED_DO,
//         CASE WHEN CAST(printdate AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_PICK,
//         CASE WHEN CAST(printdate AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(denomination_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_PICK_OT,
//         CASE WHEN CAST(printdate AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(denomination_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_PICK_AT,

//         CASE WHEN CAST(denomination_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_BOX_DINOM,
//         CASE WHEN CAST(denomination_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(box_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_BOX_DINOM_OT,
//         CASE WHEN CAST(denomination_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(box_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_BOX_DINOM_AT,

//         CASE WHEN CAST(box_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_BOX_LABEL,
//         CASE WHEN CAST(box_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(labeldone_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_BOX_LABEL_OT,
//         CASE WHEN CAST(box_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(labeldone_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_BOX_LABEL_AT,

// 		CASE WHEN CAST(labeldone_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_PRE_INSP,
//         CASE WHEN CAST(labeldone_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(pre_inspect_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_PRE_INSP_OT,
//         CASE WHEN CAST(labeldone_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(pre_inspect_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_PRE_INSP_AT,

// 		CASE WHEN CAST(pre_inspect_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_FQA,
//         CASE WHEN CAST(pre_inspect_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(fqa_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_FQA_OT,
//         CASE WHEN CAST(pre_inspect_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(fqa_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_FQA_AT,

// 		CASE WHEN CAST(fqa_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_OUT_VERIFI,
//         CASE WHEN CAST(fqa_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(outward_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_OUT_VERIFI_OT,
//         CASE WHEN CAST(fqa_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(outward_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_OUT_VERIFI_AT,

// 		CASE WHEN CAST(outward_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_OBD,
//         CASE WHEN CAST(outward_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(obd_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_OBD_OT,
//         CASE WHEN CAST(outward_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(obd_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_OBD_AT,

// 		CASE WHEN CAST(obd_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_LOGI_DOC,
//         CASE WHEN CAST(obd_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(logistics_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_LOGI_DOC_OT,
//         CASE WHEN CAST(obd_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(logistics_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_LOGI_DOC_AT,

// 		CASE WHEN CAST(logistics_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_OWT_DOC,
//         CASE WHEN CAST(logistics_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(outward_docs_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_OWT_DOC_OT,
//         CASE WHEN CAST(logistics_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(outward_docs_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_OWT_DOC_AT,

// 		CASE WHEN CAST(outward_docs_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_EWAY_BILL,
//         CASE WHEN CAST(outward_docs_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(eway_bill_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_EWAY_BILL_OT,
//         CASE WHEN CAST(outward_docs_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(eway_bill_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_EWAY_BILL_AT,

// 		CASE WHEN CAST(eway_bill_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_SHIP_OUT,
//         CASE WHEN CAST(eway_bill_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(ship_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_SHIP_OUT_OT,
//         CASE WHEN CAST(eway_bill_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(ship_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_SHIP_OUT_AT,

// 		CASE WHEN CAST(ship_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_ACK,
//         CASE WHEN CAST(ship_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(ack_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime THEN 1 ELSE 0 END AS TOT_ACK_OT,
//         CASE WHEN CAST(ship_date AS DATETIME) BETWEEN @StartDateTime AND @EndDateTime AND CAST(ack_date AS DATETIME) > @EndDateTime THEN 1 ELSE 0 END AS TOT_ACK_AT

//     FROM planning_outward WHERE del_status = 0  
// )
// SELECT
// t.Shift,
// t.TimeSlot,
// 	   SUM(PLANNED_DO) PLANNED_DO,
//        SUM(TOT_PICK) AS TOT_PICK,
//        SUM(TOT_PICK_OT) AS TOT_PICK_OT,
//        SUM(TOT_PICK_AT) AS TOT_PICK_AT,

//        SUM(TOT_BOX_DINOM) AS TOT_BOX_DINOM,
//        SUM(TOT_BOX_DINOM_OT) AS TOT_BOX_DINOM_OT,
//        SUM(TOT_BOX_DINOM_AT) AS TOT_BOX_DINOM_AT,

// 	   SUM(TOT_BOX_LABEL) AS TOT_BOX_LABEL,
//        SUM(TOT_BOX_LABEL_OT) AS TOT_BOX_LABEL_OT,
//        SUM(TOT_BOX_LABEL_AT) AS TOT_BOX_LABEL_AT,

// 	   SUM(TOT_PRE_INSP) AS TOT_PRE_INSP,
//        SUM(TOT_PRE_INSP_OT) AS TOT_PRE_INSP_OT,
//        SUM(TOT_PRE_INSP_AT) AS TOT_PRE_INSP_AT,

// 	   SUM(TOT_FQA) AS TOT_FQA,
//        SUM(TOT_FQA_OT) AS TOT_FQA_OT,
//        SUM(TOT_FQA_AT) AS TOT_FQA_AT,

// 	   SUM(TOT_OUT_VERIFI) AS TOT_OUT_VERIFI,
//        SUM(TOT_OUT_VERIFI_OT) AS TOT_OUT_VERIFI_OT,
//        SUM(TOT_OUT_VERIFI_AT) AS TOT_OUT_VERIFI_AT,

// 	   SUM(TOT_OBD) AS TOT_OBD,
//        SUM(TOT_OBD_OT) AS TOT_OBD_OT,
//        SUM(TOT_OBD_AT) AS TOT_OBD_AT,

// 	   SUM(TOT_LOGI_DOC) AS TOT_LOGI_DOC,
//        SUM(TOT_LOGI_DOC_OT) AS TOT_LOGI_DOC_OT,
//        SUM(TOT_LOGI_DOC_AT) AS TOT_LOGI_DOC_AT,

// 	   SUM(TOT_OWT_DOC) AS TOT_OWT_DOC,
//        SUM(TOT_OWT_DOC_OT) AS TOT_OWT_DOC_OT,
//        SUM(TOT_OWT_DOC_AT) AS TOT_OWT_DOC_AT,

// 	   SUM(TOT_EWAY_BILL) AS TOT_EWAY_BILL,
//        SUM(TOT_EWAY_BILL_OT) AS TOT_EWAY_BILL_OT,
//        SUM(TOT_EWAY_BILL_AT) AS TOT_EWAY_BILL_AT,

// 	   SUM(TOT_SHIP_OUT) AS TOT_SHIP_OUT,
//        SUM(TOT_SHIP_OUT_OT) AS TOT_SHIP_OUT_OT,
//        SUM(TOT_SHIP_OUT_AT) AS TOT_SHIP_OUT_AT,

// 	   SUM(TOT_ACK) AS TOT_ACK,
//        SUM(TOT_ACK_OT) AS TOT_ACK_OT,
//        SUM(TOT_ACK_AT) AS TOT_ACK_AT

//        FROM ProcessedData AS d
// 	   RIGHT JOIN TimeSlots t
//     ON d.TimeSlot = t.TimeSlot AND t.Shift = d.Shift
// 	GROUP BY t.TimeSlot,t.Shift;
// 	 `
//         }

let hourQuery=` 
WITH TimeSlots AS (
    SELECT '07:00 - 08:00' AS TimeSlot, 'A' AS Shift UNION ALL
    SELECT '08:00 - 09:00', 'A' UNION ALL
    SELECT '09:00 - 10:00', 'A' UNION ALL
    SELECT '10:00 - 11:00', 'A' UNION ALL
    SELECT '11:00 - 12:00', 'A' UNION ALL
    SELECT '12:00 - 13:00', 'A' UNION ALL
    SELECT '13:00 - 14:00', 'A' UNION ALL
    SELECT '14:00 - 15:00', 'A' UNION ALL
    SELECT '15:00 - 16:00', 'B' UNION ALL
    SELECT '16:00 - 17:00', 'B' UNION ALL
    SELECT '17:00 - 18:00', 'B' UNION ALL
    SELECT '18:00 - 19:00', 'B' UNION ALL
    SELECT '19:00 - 20:00', 'B' UNION ALL
    SELECT '20:00 - 21:00', 'B' UNION ALL
    SELECT '21:00 - 22:00', 'B' UNION ALL
    SELECT '22:00 - 23:00', 'B' UNION ALL
    SELECT '23:00 - 00:00', 'C' UNION ALL
    SELECT '00:00 - 01:00', 'C' UNION ALL
    SELECT '01:00 - 02:00', 'C' UNION ALL
    SELECT '02:00 - 03:00', 'C' UNION ALL
    SELECT '03:00 - 04:00', 'C' UNION ALL
    SELECT '04:00 - 05:00', 'C' UNION ALL
    SELECT '05:00 - 06:00', 'C' UNION ALL
    SELECT '06:00 - 07:00', 'C'
), 
ProcessedData AS (
    SELECT 
         id,
        YEAR(assigned_on) AS Year,
        MONTH(assigned_on) AS Month,
        DAY(assigned_on) AS Day,
        CASE 
            WHEN DATEPART(HOUR, first_printdate) >= 7 AND DATEPART(HOUR, first_printdate) < 15 THEN 'A'
            WHEN DATEPART(HOUR, first_printdate) >= 15 AND DATEPART(HOUR, first_printdate) < 23 THEN 'B'
            ELSE 'C'
        END AS Shift,
        CONVERT(VARCHAR(5), DATEADD(HOUR, DATEDIFF(HOUR, 0, first_printdate), 0), 108) 
    + ' - ' + 
    CONVERT(VARCHAR(5), DATEADD(HOUR, DATEDIFF(HOUR, 0, first_printdate) + 1, 0), 108) 
    AS TimeSlot ,

CASE WHEN assigned_on IS NOT NULL THEN 1 ELSE 0 END AS PLANNED_DO,
CASE WHEN first_printdate IS NOT NULL THEN 1 ELSE 0 END AS TOT_PICK,
CASE WHEN first_printdate IS NOT NULL AND CAST(denomination_date AS DATETIME) <= CAST(first_printdate AS DATETIME) THEN 1 ELSE 0 END AS TOT_PICK_OT,
CASE WHEN first_printdate IS NOT NULL AND CAST(denomination_date AS DATETIME) > CAST(first_printdate AS DATETIME) THEN 1 ELSE 0 END AS TOT_PICK_AT,

CASE WHEN denomination_date IS NOT NULL THEN 1 ELSE 0 END AS TOT_BOX_DINOM,
CASE WHEN denomination_date IS NOT NULL AND CAST(box_date AS DATETIME) <= CAST(denomination_date AS DATETIME) THEN 1 ELSE 0 END AS TOT_BOX_DINOM_OT,
CASE WHEN denomination_date IS NOT NULL AND CAST(box_date AS DATETIME) > CAST(denomination_date AS DATETIME) THEN 1 ELSE 0 END AS TOT_BOX_DINOM_AT,

CASE WHEN box_date IS NOT NULL THEN 1 ELSE 0 END AS TOT_BOX_LABEL,
CASE WHEN box_date IS NOT NULL AND CAST(labeldone_date AS DATETIME) <= CAST(box_date AS DATETIME) THEN 1 ELSE 0 END AS TOT_BOX_LABEL_OT,
CASE WHEN box_date IS NOT NULL AND CAST(labeldone_date AS DATETIME) > CAST(box_date AS DATETIME) THEN 1 ELSE 0 END AS TOT_BOX_LABEL_AT,

CASE WHEN labeldone_date IS NOT NULL THEN 1 ELSE 0 END AS TOT_PRE_INSP,
CASE WHEN labeldone_date IS NOT NULL AND CAST(pre_inspect_date AS DATETIME) <= CAST(labeldone_date AS DATETIME) THEN 1 ELSE 0 END AS TOT_PRE_INSP_OT,
CASE WHEN labeldone_date IS NOT NULL AND CAST(pre_inspect_date AS DATETIME) > CAST(labeldone_date AS DATETIME) THEN 1 ELSE 0 END AS TOT_PRE_INSP_AT,

CASE WHEN pre_inspect_date IS NOT NULL THEN 1 ELSE 0 END AS TOT_FQA,
CASE WHEN pre_inspect_date IS NOT NULL AND CAST(fqa_date AS DATETIME) <= CAST(pre_inspect_date AS DATETIME) THEN 1 ELSE 0 END AS TOT_FQA_OT,
CASE WHEN pre_inspect_date IS NOT NULL AND CAST(fqa_date AS DATETIME) > CAST(pre_inspect_date AS DATETIME) THEN 1 ELSE 0 END AS TOT_FQA_AT,

CASE WHEN fqa_date IS NOT NULL THEN 1 ELSE 0 END AS TOT_OUT_VERIFI,
CASE WHEN fqa_date IS NOT NULL AND CAST(outward_date AS DATETIME) <= CAST(fqa_date AS DATETIME) THEN 1 ELSE 0 END AS TOT_OUT_VERIFI_OT,
CASE WHEN fqa_date IS NOT NULL AND CAST(outward_date AS DATETIME) > CAST(fqa_date AS DATETIME) THEN 1 ELSE 0 END AS TOT_OUT_VERIFI_AT,

CASE WHEN outward_date IS NOT NULL THEN 1 ELSE 0 END AS TOT_OBD,
CASE WHEN outward_date IS NOT NULL AND CAST(obd_date AS DATETIME) <= CAST(outward_date AS DATETIME) THEN 1 ELSE 0 END AS TOT_OBD_OT,
CASE WHEN outward_date IS NOT NULL AND CAST(obd_date AS DATETIME) > CAST(outward_date AS DATETIME) THEN 1 ELSE 0 END AS TOT_OBD_AT,

CASE WHEN obd_date IS NOT NULL THEN 1 ELSE 0 END AS TOT_LOGI_DOC,
CASE WHEN obd_date IS NOT NULL AND CAST(dcDate AS DATETIME) <= CAST(obd_date AS DATETIME) THEN 1 ELSE 0 END AS TOT_LOGI_DOC_OT,
CASE WHEN obd_date IS NOT NULL AND CAST(dcDate AS DATETIME) > CAST(obd_date AS DATETIME) THEN 1 ELSE 0 END AS TOT_LOGI_DOC_AT,

CASE WHEN dcDate IS NOT NULL THEN 1 ELSE 0 END AS TOT_OWT_DOC,
CASE WHEN dcDate IS NOT NULL AND CAST(outward_docs_date AS DATETIME) <= CAST(dcDate AS DATETIME) THEN 1 ELSE 0 END AS TOT_OWT_DOC_OT,
CASE WHEN dcDate IS NOT NULL AND CAST(outward_docs_date AS DATETIME) > CAST(dcDate AS DATETIME) THEN 1 ELSE 0 END AS TOT_OWT_DOC_AT,

CASE WHEN outward_docs_date IS NOT NULL THEN 1 ELSE 0 END AS TOT_EWAY_BILL,
CASE WHEN outward_docs_date IS NOT NULL AND CAST(eway_bill_date AS DATETIME) <= CAST(outward_docs_date AS DATETIME) THEN 1 ELSE 0 END AS TOT_EWAY_BILL_OT,
CASE WHEN outward_docs_date IS NOT NULL AND CAST(eway_bill_date AS DATETIME) > CAST(outward_docs_date AS DATETIME) THEN 1 ELSE 0 END AS TOT_EWAY_BILL_AT,

CASE WHEN eway_bill_date IS NOT NULL THEN 1 ELSE 0 END AS TOT_SHIP_OUT,
CASE WHEN eway_bill_date IS NOT NULL AND CAST(ship_date AS DATETIME) <= CAST(eway_bill_date AS DATETIME) THEN 1 ELSE 0 END AS TOT_SHIP_OUT_OT,
CASE WHEN eway_bill_date IS NOT NULL AND CAST(ship_date AS DATETIME) > CAST(eway_bill_date AS DATETIME) THEN 1 ELSE 0 END AS TOT_SHIP_OUT_AT,      

CASE WHEN ship_date IS NOT NULL THEN 1 ELSE 0 END AS TOT_ACK,
CASE WHEN ship_date IS NOT NULL AND CAST(ack_date AS DATETIME) <= CAST(ship_date AS DATETIME) THEN 1 ELSE 0 END AS TOT_ACK_OT,
CASE WHEN ship_date IS NOT NULL AND CAST(ack_date AS DATETIME) > CAST(ship_date AS DATETIME) THEN 1 ELSE 0 END AS TOT_ACK_AT

    FROM planning_outward WHERE del_status = 0 --${whereQuery}
)
SELECT    
	   d.Year,
	   d.Month, 
	   d.Day,
	   d.Shift,
	   t.TimeSlot,
	   SUM(PLANNED_DO) PLANNED_DO,
       SUM(TOT_PICK) AS TOT_PICK,
       SUM(TOT_PICK_OT) AS TOT_PICK_OT,
       SUM(TOT_PICK_AT) AS TOT_PICK_AT,

       SUM(TOT_BOX_DINOM) AS TOT_BOX_DINOM,
       SUM(TOT_BOX_DINOM_OT) AS TOT_BOX_DINOM_OT,
       SUM(TOT_BOX_DINOM_AT) AS TOT_BOX_DINOM_AT,

	   SUM(TOT_BOX_LABEL) AS TOT_BOX_LABEL,
       SUM(TOT_BOX_LABEL_OT) AS TOT_BOX_LABEL_OT,
       SUM(TOT_BOX_LABEL_AT) AS TOT_BOX_LABEL_AT,

	   SUM(TOT_PRE_INSP) AS TOT_PRE_INSP,
       SUM(TOT_PRE_INSP_OT) AS TOT_PRE_INSP_OT,
       SUM(TOT_PRE_INSP_AT) AS TOT_PRE_INSP_AT,

	   SUM(TOT_FQA) AS TOT_FQA,
       SUM(TOT_FQA_OT) AS TOT_FQA_OT,
       SUM(TOT_FQA_AT) AS TOT_FQA_AT,

	   SUM(TOT_OUT_VERIFI) AS TOT_OUT_VERIFI,
       SUM(TOT_OUT_VERIFI_OT) AS TOT_OUT_VERIFI_OT,
       SUM(TOT_OUT_VERIFI_AT) AS TOT_OUT_VERIFI_AT,

	   SUM(TOT_OBD) AS TOT_OBD,
       SUM(TOT_OBD_OT) AS TOT_OBD_OT,
       SUM(TOT_OBD_AT) AS TOT_OBD_AT,

	   SUM(TOT_LOGI_DOC) AS TOT_LOGI_DOC,
       SUM(TOT_LOGI_DOC_OT) AS TOT_LOGI_DOC_OT,
       SUM(TOT_LOGI_DOC_AT) AS TOT_LOGI_DOC_AT,

	   SUM(TOT_OWT_DOC) AS TOT_OWT_DOC,
       SUM(TOT_OWT_DOC_OT) AS TOT_OWT_DOC_OT,
       SUM(TOT_OWT_DOC_AT) AS TOT_OWT_DOC_AT,

	   SUM(TOT_EWAY_BILL) AS TOT_EWAY_BILL,
       SUM(TOT_EWAY_BILL_OT) AS TOT_EWAY_BILL_OT,
       SUM(TOT_EWAY_BILL_AT) AS TOT_EWAY_BILL_AT,

	   SUM(TOT_SHIP_OUT) AS TOT_SHIP_OUT,
       SUM(TOT_SHIP_OUT_OT) AS TOT_SHIP_OUT_OT,
       SUM(TOT_SHIP_OUT_AT) AS TOT_SHIP_OUT_AT,

	   SUM(TOT_ACK) AS TOT_ACK,
       SUM(TOT_ACK_OT) AS TOT_ACK_OT,
       SUM(TOT_ACK_AT) AS TOT_ACK_AT
	   
FROM ProcessedData AS d 
RIGHT JOIN TimeSlots AS t ON d.TimeSlot = t.TimeSlot AND d.Shift = t.Shift 
GROUP BY t.TimeSlot,d.Year,d.Month,d.Shift,d.Day
ORDER BY d.year, d.month, t.TimeSlot;`
        const pool = await poolPromise;

        const result = await pool.request()
            .input('startDateTime', sql.NVarChar, changeDateToSqlFormat(startDateTime))
            .input('endDateTime', sql.NVarChar, changeDateToSqlFormat(endDateTime))
            .input('month', sql.Int, month)
            .input('year', sql.Int, year)
            .query(hourQuery);
        res.status(201).send({ data: result.recordset });
    } catch (error) {
        res.status(401).send({ data: [], paginate: {}, error: `${error}` })
    }
}


export { getOutwardTATHours }