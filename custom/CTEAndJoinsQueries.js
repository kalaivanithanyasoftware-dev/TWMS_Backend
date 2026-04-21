const CTEQueries = {
	picklist_generation: `WITH UserRole AS (
    SELECT 
        u.id AS user_id,
        TRIM(u.firstname + ' ' + u.lastname) AS full_name,
        u.empcode,
        ISNULL(u.profile,'') profile,
        r.rolename
    FROM ms_user u
    LEFT JOIN ms_role r ON u.roleid = r.id
),
PlanningDetails AS (
    SELECT
		d.id AS idd,
        d.id AS detail_id,
		d.po, 
		upper(d.tpn) AS tpn,
        d.planno,
        d.supplierid,
        d.cm_refid,
		CONCAT('TP', FORMAT(d.cm_refid, '00000')) AS orderno,
		isnull(d.printcount,0) printcount,
		d.status,
		d.totalqty,
		d.confirm_qty,
        d.planned_requested_qty AS req_qty,
        ISNULL(d.holdremarks,'') holdremarks,
        ISNULL(d.fqa_reject_remarks,'') fqa_reject_remarks,
        ISNULL(d.sto_number,'') sto_number,
        ISNULL(d.physical_type,'') physical_type,
        ISNULL(d.grn_number,'') grn_number,
        ISNULL(d.obd_number,'') obd_number,
		ISNULL(d.sto_invoice,'') sto_invoice,
		ISNULL(d.po_number,'') po_number, 
		ISNULL(d.eway_billno,'') eway_billno,
		ISNULL(d.eway_bill_upload,'') eway_bill_upload,
		ISNULL(d.truck_number,'') truck_number,
		ISNULL(d.weight_and_volume,'') weight_and_volume,
		ISNULL(d.noOfPallet,'') noOfPallet, 
		ISNULL(d.invoicenumber,'') invoicenumber,
		ISNULL(d.uploadinvoice,'') uploadinvoice,
		ISNULL(d.lr_number,'') lr_number,
		ISNULL(d.driver_name,'') driver_name,
		ISNULL(d.driver_mobile,'') driver_mobile,
		ISNULL(d.transporter_name,'') transporter_name,
		d.assigned_by,
		d.pick_by,
		d.denomination_by,
		d.box_by,
		d.labeldone_by,
		d.pre_inspect_by,
		d.fqa_by,
		d.dispatch_by,
		d.first_obd_by,
		d.obd_by,
		d.first_logistics_by,
		d.logistics_by,
		d.outward_docs_by, 
		d.eway_bill_by,
		d.ship_by,
		d.ack_by, 
		CONVERT(VARCHAR(19), d.first_printdate, 29) AS first_printdate,
		CONVERT(VARCHAR(19), d.assigned_on, 29) AS assigned_date,
		CONVERT(VARCHAR(10), d.pick_date, 29) AS pick_date,
		CONVERT(VARCHAR(19), d.denomination_date, 29) AS denomination_date,
		CONVERT(VARCHAR(19), d.box_date, 29) AS box_date,
		CONVERT(VARCHAR(19), d.labeldone_date, 29) AS labeldone_date,
		CONVERT(VARCHAR(19), d.pre_inspect_date, 29) AS pre_inspect_date,
		CONVERT(VARCHAR(19), d.fqa_date, 29) AS fqa_date, 
		ISNULL(CONVERT(VARCHAR(19), d.dispatch_date, 29),'') AS dispatch_date,
		ISNULL(CONVERT(VARCHAR(19), d.first_obd_date, 29),'') AS first_obd_date,
		ISNULL(CONVERT(VARCHAR(19), d.obd_date, 29),'') AS obd_date,
		ISNULL(CONVERT(VARCHAR(19), d.first_logistics_date, 29),'') AS first_logistics_date,
		ISNULL(CONVERT(VARCHAR(19), d.dcDate, 29),'') AS dcDatedcDate,
		ISNULL(CONVERT(VARCHAR(19), d.outward_docs_date, 29),'') AS outward_docs_date,
		ISNULL(CONVERT(VARCHAR(19), d.eway_bill_date, 29),'') AS eway_bill_date,
		ISNULL(CONVERT(VARCHAR(19), d.ship_date, 29),'') AS ship_date,
		ISNULL(CONVERT(VARCHAR(19), d.ack_date, 29),'') AS ack_date 
    FROM planning_outward d
    WHERE d.del_status = 0 AND ( 
    OR (@status = 'PICK' AND d.status=d.status) 
    OR (@status = 'OUTBOUND_DOC_DONE') 
	)
)`,
	detailed_report: `WITH UserRole AS (SELECT u.id AS user_id, TRIM(u.firstname + ' ' + u.lastname) AS full_name, u.empcode, ISNULL(u.profile,'') profile, r.rolename FROM ms_user u LEFT JOIN ms_role r ON u.roleid = r.id),
        PlanningDetails AS 
		(
		SELECT 
		d.id AS idd,
        d.id AS detail_id,
		d.po,
		upper(d.tpn) AS tpn,
        d.planno,
        d.supplierid,
        d.cm_refid,
		CONCAT('TP', FORMAT(d.cm_refid, '00000')) AS orderno,
		d.status,
		isnull(d.printcount,0) printcount,
		d.totalqty,
		d.confirm_qty,
        d.planned_requested_qty AS req_qty,
		d.holdremarks,
		d.fqa_reject_remarks,
        ISNULL(d.sto_number,'') sto_number,
        ISNULL(d.physical_type,'') physical_type,
        ISNULL(d.obd_number,'') obd_number,
        ISNULL(d.grn_number,'') grn_number,
		ISNULL(d.sto_invoice,'') sto_invoice,
		ISNULL(d.po_number,'') po_number,
		ISNULL(d.eway_billno,'') eway_billno,
		ISNULL(d.eway_bill_upload,'') eway_bill_upload,
		ISNULL(d.truck_number,'') truck_number,
		ISNULL(d.weight_and_volume,'') weight_and_volume,
		ISNULL(d.noOfPallet,'') noOfPallet, 
		ISNULL(d.invoicenumber,'') invoicenumber,
		ISNULL(d.uploadinvoice,'') uploadinvoice,   
		d.assigned_by,
		d.pick_by,
		d.denomination_by,
		d.box_by,
		d.labeldone_by,
		d.pre_inspect_by,
		d.fqa_by,
		d.fqa_hold_by,
		d.dispatch_by,
		d.first_obd_by,
		d.obd_by,
		d.first_logistics_by,
		d.logistics_by,
		d.outward_docs_by, 
		d.eway_bill_by,
		d.ship_by,
		d.ack_by, 
		CONVERT(VARCHAR(19), d.first_printdate, 29) AS first_printdate,
		CONVERT(VARCHAR(19), d.printdate, 29) AS printdate,
		CONVERT(VARCHAR(19), d.assigned_on, 29) AS assigned_date,
		CONVERT(VARCHAR(10), d.pick_date, 29) AS pick_date,
		CONVERT(VARCHAR(19), d.denomination_date, 29) AS denomination_date,
		CONVERT(VARCHAR(19), d.box_date, 29) AS box_date,
		CONVERT(VARCHAR(19), d.labeldone_date, 29) AS labeldone_date,
		CONVERT(VARCHAR(19), d.pre_inspect_date, 29) AS pre_inspect_date,
		CONVERT(VARCHAR(19), d.fqa_date, 29) AS fqa_date, 
		CONVERT(VARCHAR(19), d.fqa_hold_date, 29) AS fqa_hold_date, 
		ISNULL(CONVERT(VARCHAR(19), d.dispatch_date, 29),'') AS dispatch_date,
		ISNULL(CONVERT(VARCHAR(19), d.first_obd_date, 29),'') AS first_obd_date,
		ISNULL(CONVERT(VARCHAR(19), d.obd_date, 29),'') AS obd_date,
		ISNULL(CONVERT(VARCHAR(19), d.first_logistics_date, 29),'') AS first_logistics_date,
		ISNULL(CONVERT(VARCHAR(19), d.dcDate, 29),'') AS dcDate,
		ISNULL(CONVERT(VARCHAR(19), d.outward_docs_date, 29),'') AS outward_docs_date,
		ISNULL(CONVERT(VARCHAR(19), d.eway_bill_date, 29),'') AS eway_bill_date,
		ISNULL(CONVERT(VARCHAR(19), d.ship_date, 29),'') AS ship_date,
		ISNULL(CONVERT(VARCHAR(19), d.ack_date, 29),'') AS ack_date,
		 	
		ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.assigned_on, d.denomination_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.assigned_on, d.denomination_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.assigned_on, d.denomination_date) % 60), 2),'') AS pick_tat, 
	 
	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.denomination_date, d.box_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.denomination_date, d.box_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.denomination_date, d.box_date) % 60), 2),'') AS box_tat,  

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.box_date, d.labeldone_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR,(DATEDIFF(SECOND, d.box_date, d.labeldone_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.box_date, d.labeldone_date) % 60), 2),'') AS label_tat,
	  
	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.box_date, d.pre_inspect_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.box_date, d.pre_inspect_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.box_date, d.pre_inspect_date) % 60), 2),'') AS pre_inspect_tat, 

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.pre_inspect_date, d.fqa_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.pre_inspect_date, d.fqa_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.pre_inspect_date, d.fqa_date) % 60), 2),'') AS fqa_tat, 

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.fqa_date, d.dispatch_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.fqa_date, d.dispatch_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.fqa_date, d.dispatch_date) % 60), 2),'') AS dispatch_tat, 

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.dispatch_date, d.first_obd_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.dispatch_date, d.first_obd_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.dispatch_date, d.first_obd_date) % 60), 2),'') AS first_obd_tat, 

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.first_obd_date, d.obd_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.first_obd_date, d.obd_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.first_obd_date, d.obd_date) % 60), 2),'') AS obd_tat, 

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.obd_date, d.first_logistics_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.obd_date, d.first_logistics_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.obd_date, d.first_logistics_date) % 60), 2),'') AS first_logistics_tat, 

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.first_logistics_date, d.dcDate) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.first_logistics_date, d.dcDate) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.first_logistics_date, d.dcDate) % 60), 2),'') AS logistics_tat, 

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.dcDate, d.outward_docs_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.dcDate, d.outward_docs_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.dcDate, d.outward_docs_date) % 60), 2),'') AS outward_docs_tat, 

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.outward_docs_date, d.eway_bill_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.outward_docs_date, d.eway_bill_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.outward_docs_date, d.eway_bill_date) % 60), 2),'') AS eway_bill_tat, 

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.eway_bill_date, d.ship_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.eway_bill_date, d.ship_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.eway_bill_date, d.ship_date) % 60), 2),'') AS ship_tat, 

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.ship_date, d.ack_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.ship_date, d.ack_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.ship_date, d.ack_date) % 60), 2),'') AS ack_tat

	FROM planning_outward d WHERE d.del_status = 0)`,


	inward_shelf_life_expiry: `
	 WITH LabelData AS (
        SELECT  
            lg.id,
			CONCAT('GRNLBL', lg.id) AS label_id,
			lg.datecode,
			p.mpn_number,
			p.tpn_number,
			lg.quantity,
			ISNULL(lg.quantity*sap.unitprice,0) price,
			CONVERT(VARCHAR(19),lg.createddate,29) createddate, 
            -- Calculate Manufacture Date
            CONVERT(VARCHAR(10), DATEADD(DAY, 
				(CAST(RIGHT(lg.datecode, 2) AS INT) - 1) * 7,
				DATEADD(DAY, 
					CASE 
						WHEN DATEPART(WEEKDAY, DATEFROMPARTS(
							CASE 
								WHEN CAST(LEFT(lg.datecode, 2) AS INT) < 50 THEN 2000 
								ELSE 2100 
							END + CAST(LEFT(lg.datecode, 2) AS INT), 1, 4
						)) = 1 THEN -3
						ELSE 2 - DATEPART(WEEKDAY, DATEFROMPARTS(
							CASE 
								WHEN CAST(LEFT(lg.datecode, 2) AS INT) < 50 THEN 2000 
								ELSE 2100 
							END + CAST(LEFT(lg.datecode, 2) AS INT), 1, 4
						))
					END, 
					DATEFROMPARTS(
						CASE 
							WHEN CAST(LEFT(lg.datecode, 2) AS INT) < 50 THEN 2000 
							ELSE 2100 
						END + CAST(LEFT(lg.datecode, 2) AS INT), 1, 4
					)
				)
			), 27) AS ManufactureDate,

			-- Calculate Expiry Date
			CONVERT(VARCHAR(10), DATEADD(MONTH, PT.noofmonths, 
				DATEADD(DAY, 
					(CAST(RIGHT(lg.datecode, 2) AS INT) - 1) * 7,
					DATEADD(DAY, 
						CASE 
							WHEN DATEPART(WEEKDAY, DATEFROMPARTS(
								CASE 
									WHEN CAST(LEFT(lg.datecode, 2) AS INT) < 50 THEN 2000 
									ELSE 2100 
								END + CAST(LEFT(lg.datecode, 2) AS INT), 1, 4
							)) = 1 THEN -3
							ELSE 2 - DATEPART(WEEKDAY, DATEFROMPARTS(
								CASE 
									WHEN CAST(LEFT(lg.datecode, 2) AS INT) < 50 THEN 2000 
									ELSE 2100 
								END + CAST(LEFT(lg.datecode, 2) AS INT), 1, 4
							))
						END, 
						DATEFROMPARTS(
							CASE 
								WHEN CAST(LEFT(lg.datecode, 2) AS INT) < 50 THEN 2000 
								ELSE 2100 
							END + CAST(LEFT(lg.datecode, 2) AS INT), 1, 4
						)
					)
				)
			), 27) AS ExpiryDate,

			-- Calculate Days to Expiry
			DATEDIFF(DAY, 
				GETDATE(),
				DATEADD(MONTH, PT.noofmonths, 
					DATEADD(DAY, 
						(CAST(RIGHT(lg.datecode, 2) AS INT) - 1) * 7,
						DATEADD(DAY, 
							CASE 
								WHEN DATEPART(WEEKDAY, DATEFROMPARTS(
									CASE 
										WHEN CAST(LEFT(lg.datecode, 2) AS INT) < 50 THEN 2000 
										ELSE 2100 
									END + CAST(LEFT(lg.datecode, 2) AS INT), 1, 4
								)) = 1 THEN -3
								ELSE 2 - DATEPART(WEEKDAY, DATEFROMPARTS(
									CASE 
										WHEN CAST(LEFT(lg.datecode, 2) AS INT) < 50 THEN 2000 
										ELSE 2100 
									END + CAST(LEFT(lg.datecode, 2) AS INT), 1, 4
								))
							END, 
							DATEFROMPARTS(
								CASE 
									WHEN CAST(LEFT(lg.datecode, 2) AS INT) < 50 THEN 2000 
									ELSE 2100 
								END + CAST(LEFT(lg.datecode, 2) AS INT), 1, 4
							)
						)
					)
				)
			) AS DaysToExpiry
			FROM inward_label_generation AS lg
			INNER JOIN inward_physical_Verification AS p ON p.id = lg.physical_refid
			INNER JOIN planning_sapstocklist AS sap ON sap.material=p.tpn_number
			INNER JOIN ms_part AS PT ON PT.tpn = p.tpn_number
			WHERE  lg.status=2 AND lg.del_status=0 AND ISNULL(lg.is_putaway,0)=0
            )`,

	shelf_life_expiry: `
	WITH LabelData AS (
    	SELECT 
        lg.id,
        CONCAT('GRNLBL',COALESCE(
				CAST(ins.grn_label_id AS NVARCHAR),
				ins.grn_label_split_id
		)) as label_id,
        lg.datecode,
		p.mpn_number,
		p.tpn_number,
		ins.quantity,
		ISNULL(ins.quantity*sap.unitprice,0) price,
        CONVERT(VARCHAR(19),lg.createddate,29) createddate,
        -- Calculate Manufacture Date
        CONVERT(VARCHAR(10), DATEADD(DAY, 
            (CAST(RIGHT(lg.datecode, 2) AS INT) - 1) * 7,
            DATEADD(DAY, 
                CASE 
                    WHEN DATEPART(WEEKDAY, DATEFROMPARTS(
                        CASE 
                            WHEN CAST(LEFT(lg.datecode, 2) AS INT) < 50 THEN 2000 
                            ELSE 2100 
                        END + CAST(LEFT(lg.datecode, 2) AS INT), 1, 4
                    )) = 1 THEN -3
                    ELSE 2 - DATEPART(WEEKDAY, DATEFROMPARTS(
                        CASE 
                            WHEN CAST(LEFT(lg.datecode, 2) AS INT) < 50 THEN 2000 
                            ELSE 2100 
                        END + CAST(LEFT(lg.datecode, 2) AS INT), 1, 4
                    ))
                END, 
                DATEFROMPARTS(
                    CASE 
                        WHEN CAST(LEFT(lg.datecode, 2) AS INT) < 50 THEN 2000 
                        ELSE 2100 
                    END + CAST(LEFT(lg.datecode, 2) AS INT), 1, 4
                )
            )
        ), 27) AS ManufactureDate,
        
        -- Calculate Expiry Date
        CONVERT(VARCHAR(10), DATEADD(MONTH, PT.noofmonths, 
            DATEADD(DAY, 
                (CAST(RIGHT(lg.datecode, 2) AS INT) - 1) * 7,
                DATEADD(DAY, 
                    CASE 
                        WHEN DATEPART(WEEKDAY, DATEFROMPARTS(
                            CASE 
                                WHEN CAST(LEFT(lg.datecode, 2) AS INT) < 50 THEN 2000 
                                ELSE 2100 
                            END + CAST(LEFT(lg.datecode, 2) AS INT), 1, 4
                        )) = 1 THEN -3
                        ELSE 2 - DATEPART(WEEKDAY, DATEFROMPARTS(
                            CASE 
                                WHEN CAST(LEFT(lg.datecode, 2) AS INT) < 50 THEN 2000 
                                ELSE 2100 
                            END + CAST(LEFT(lg.datecode, 2) AS INT), 1, 4
                        ))
                    END, 
                    DATEFROMPARTS(
                        CASE 
                            WHEN CAST(LEFT(lg.datecode, 2) AS INT) < 50 THEN 2000 
                            ELSE 2100 
                        END + CAST(LEFT(lg.datecode, 2) AS INT), 1, 4
                    )
                )
            )
        ), 27) AS ExpiryDate,
        
        -- Calculate Days to Expiry
        DATEDIFF(DAY, 
            GETDATE(),
            DATEADD(MONTH, PT.noofmonths, 
                DATEADD(DAY, 
                    (CAST(RIGHT(lg.datecode, 2) AS INT) - 1) * 7,
                    DATEADD(DAY, 
                        CASE 
                            WHEN DATEPART(WEEKDAY, DATEFROMPARTS(
                                CASE 
                                    WHEN CAST(LEFT(lg.datecode, 2) AS INT) < 50 THEN 2000 
                                    ELSE 2100 
                                END + CAST(LEFT(lg.datecode, 2) AS INT), 1, 4
                            )) = 1 THEN -3
                            ELSE 2 - DATEPART(WEEKDAY, DATEFROMPARTS(
                                CASE 
                                    WHEN CAST(LEFT(lg.datecode, 2) AS INT) < 50 THEN 2000 
                                    ELSE 2100 
                                END + CAST(LEFT(lg.datecode, 2) AS INT), 1, 4
                            ))
                        END, 
                        DATEFROMPARTS(
                            CASE 
                                WHEN CAST(LEFT(lg.datecode, 2) AS INT) < 50 THEN 2000 
                                ELSE 2100 
                            END + CAST(LEFT(lg.datecode, 2) AS INT), 1, 4
                        )
                    )
                )
            )
        ) AS DaysToExpiry
    FROM ops_inventory_new_splitup AS ins
     INNER JOIN planning_sapstocklist AS sap ON sap.material=ins.tpn
	INNER JOIN inward_label_generation AS lg ON CAST(lg.id AS NVARCHAR)=COALESCE(
                    CAST(ins.grn_label_id AS NVARCHAR),
                    LEFT(ins.grn_label_split_id, CHARINDEX('-', ins.grn_label_split_id) - 1)
                )
    INNER JOIN inward_physical_Verification AS p ON p.id = lg.physical_refid
    INNER JOIN ms_part AS PT ON PT.tpn = p.tpn_number
    WHERE lg.del_status = 0 AND ins.del_status=0 AND ISNULL(ins.is_out,0) = 0 

	UNION ALL

	SELECT 
		ins.id,  
		 CONCAT('LBL',COALESCE(
					CAST(ins.grn_label_id AS NVARCHAR),
					ins.grn_label_split_id
		)) as labelid,  
		wsp.datecode,
		wsp.mpn_number, 
		wsp.tpn_number,  
		ins.quantity,
		ISNULL(ins.quantity*sap.unitprice,0) price,
	CONVERT(VARCHAR(19), ins.createddate, 29)  as createddate,
-- Calculate Manufacture Date
    CONVERT(VARCHAR(10),DATEADD(DAY, 
        (CAST(RIGHT(wsp.datecode, 2) AS INT) - 1) * 7,
        DATEADD(DAY, 
            CASE 
                WHEN DATEPART(WEEKDAY, DATEFROMPARTS(
                    CASE 
                        WHEN CAST(LEFT(wsp.datecode, 2) AS INT) < 50 THEN 2000 
                        ELSE 2100 
                    END + CAST(LEFT(wsp.datecode, 2) AS INT), 1, 4
                )) = 1 THEN -3
                ELSE 2 - DATEPART(WEEKDAY, DATEFROMPARTS(
                    CASE 
                        WHEN CAST(LEFT(wsp.datecode, 2) AS INT) < 50 THEN 2000 
                        ELSE 2100 
                    END + CAST(LEFT(wsp.datecode, 2) AS INT), 1, 4
                ))
            END, 
            DATEFROMPARTS(
                CASE 
                    WHEN CAST(LEFT(wsp.datecode, 2) AS INT) < 50 THEN 2000 
                    ELSE 2100 
                END + CAST(LEFT(wsp.datecode, 2) AS INT), 1, 4
            )
        )
    ),27) AS ManufactureDate,
    -- Calculate Expiry Date
    CONVERT(VARCHAR(10),DATEADD(MONTH, PT.noofmonths, 
        DATEADD(DAY, 
            (CAST(RIGHT(wsp.datecode, 2) AS INT) - 1) * 7,
            DATEADD(DAY, 
                CASE 
                    WHEN DATEPART(WEEKDAY, DATEFROMPARTS(
                        CASE 
                            WHEN CAST(LEFT(wsp.datecode, 2) AS INT) < 50 THEN 2000 
                            ELSE 2100 
                        END + CAST(LEFT(wsp.datecode, 2) AS INT), 1, 4
                    )) = 1 THEN -3
                    ELSE 2 - DATEPART(WEEKDAY, DATEFROMPARTS(
                        CASE 
                            WHEN CAST(LEFT(wsp.datecode, 2) AS INT) < 50 THEN 2000 
                            ELSE 2100 
                        END + CAST(LEFT(wsp.datecode, 2) AS INT), 1, 4
                    ))
                END, 
                DATEFROMPARTS(
                    CASE 
                        WHEN CAST(LEFT(wsp.datecode, 2) AS INT) < 50 THEN 2000 
                        ELSE 2100 
                    END + CAST(LEFT(wsp.datecode, 2) AS INT), 1, 4
                )
            )
        )
    ),27) AS ExpiryDate,
    -- Calculate Days to Expiry
    DATEDIFF(DAY, 
        GETDATE(),
        DATEADD(MONTH, PT.noofmonths, 
            DATEADD(DAY, 
                (CAST(RIGHT(wsp.datecode, 2) AS INT) - 1) * 7,
                DATEADD(DAY, 
                    CASE 
                        WHEN DATEPART(WEEKDAY, DATEFROMPARTS(
                            CASE 
                                WHEN CAST(LEFT(wsp.datecode, 2) AS INT) < 50 THEN 2000 
                                ELSE 2100 
                            END + CAST(LEFT(wsp.datecode, 2) AS INT), 1, 4
                        )) = 1 THEN -3
                        ELSE 2 - DATEPART(WEEKDAY, DATEFROMPARTS(
                            CASE 
                                WHEN CAST(LEFT(wsp.datecode, 2) AS INT) < 50 THEN 2000 
                                ELSE 2100 
                            END + CAST(LEFT(wsp.datecode, 2) AS INT), 1, 4
                        ))
                    END, 
                    DATEFROMPARTS(
                        CASE 
                            WHEN CAST(LEFT(wsp.datecode, 2) AS INT) < 50 THEN 2000 
                            ELSE 2100 
                        END + CAST(LEFT(wsp.datecode, 2) AS INT), 1, 4
                    )
                )
            )
        )
    ) AS DaysToExpiry FROM ops_inventory_wall_to_wall_new_splitup as ins 
     INNER JOIN planning_sapstocklist AS sap ON sap.material=ins.tpn
	 LEFT JOIN (SELECT label_id,mpn_number,tpn_number,make,quantity,datecode FROM cyclecount_wall_to_wall_label_splitup) AS wsp ON wsp.label_id=CASE 
            WHEN CHARINDEX('-', COALESCE(ins.grn_label_id, ins.grn_label_split_id)) = 0 THEN 
                COALESCE(ins.grn_label_id, ins.grn_label_split_id) -- No hyphen
            WHEN LEN(SUBSTRING(COALESCE(ins.grn_label_id, ins.grn_label_split_id), 
                              CHARINDEX('-', COALESCE(ins.grn_label_id, ins.grn_label_split_id)) + 1, 
                              LEN(COALESCE(ins.grn_label_id, ins.grn_label_split_id)))) < 3 THEN
                LEFT(COALESCE(ins.grn_label_id, ins.grn_label_split_id), 
                     CHARINDEX('-', COALESCE(ins.grn_label_id, ins.grn_label_split_id)) - 1) -- Before first hyphen
            WHEN LEN(SUBSTRING(COALESCE(ins.grn_label_id, ins.grn_label_split_id), 
                              CHARINDEX('-', COALESCE(ins.grn_label_id, ins.grn_label_split_id)) + 1, 
                              LEN(COALESCE(ins.grn_label_id, ins.grn_label_split_id)))) >= 5 AND
                 LEN(COALESCE(ins.grn_label_id, ins.grn_label_split_id)) - LEN(REPLACE(COALESCE(ins.grn_label_id, ins.grn_label_split_id), '-', '')) > 1 THEN
                LEFT(COALESCE(ins.grn_label_id, ins.grn_label_split_id), 
                     CHARINDEX('-', COALESCE(ins.grn_label_id, ins.grn_label_split_id), 
                               CHARINDEX('-', COALESCE(ins.grn_label_id, ins.grn_label_split_id)) + 1) - 1) -- Before second hyphen
            ELSE
                COALESCE(ins.grn_label_id, ins.grn_label_split_id) -- Return full value
        END  
	 LEFT JOIN (SELECT tpn,noofmonths FROM ms_part) AS PT ON PT.tpn = ins.tpn 
	 WHERE ins.del_status=0 AND ISNULL(ins.is_out,0) = 0
)
`
}

const CTEJoinAndWhereQueries = {
	picklist_generation: `INNER JOIN planning_cmlist AS cm ON cm.id=pd.cm_refid
	LEFT JOIN ms_type AS t ON t.id=cm.typeid
	INNER JOIN ms_supplier AS sp ON sp.id=pd.supplierid
	INNER JOIN UserRole AS assigner ON assigner.user_id = pd.assigned_by  
	INNER JOIN UserRole AS picker ON picker.user_id = pd.pick_by   
	
	LEFT JOIN UserRole AS denomination ON denomination.user_id = pd.denomination_by 
	
	LEFT JOIN UserRole AS box ON box.user_id = pd.box_by 
	
	LEFT JOIN UserRole AS label ON label.user_id = pd.labeldone_by 
	
	LEFT JOIN UserRole AS pre_ins ON pre_ins.user_id = pd.pre_inspect_by 
	
	LEFT JOIN UserRole AS fqa ON fqa.user_id = pd.fqa_by  

	LEFT JOIN UserRole AS dispatch ON dispatch.user_id = pd.dispatch_by  

	LEFT JOIN UserRole AS firstobduser ON firstobduser.user_id = pd.first_obd_by  
	
	LEFT JOIN UserRole AS obduser ON obduser.user_id = pd.obd_by 
	
	LEFT JOIN UserRole AS firstlogisticsuser ON firstlogisticsuser.user_id = pd.first_logistics_by  
	
	LEFT JOIN UserRole AS logisticsuser ON logisticsuser.user_id = pd.logistics_by  
	
	LEFT JOIN UserRole AS out_docs_user ON out_docs_user.user_id = pd.outward_docs_by 
	
	LEFT JOIN UserRole AS eway_user ON eway_user.user_id = pd.eway_bill_by
	
	LEFT JOIN UserRole AS shipuser ON shipuser.user_id = pd.ship_by 
	LEFT JOIN UserRole AS ackuser ON ackuser.user_id = pd.ack_by 
	
	WHERE 
	pd.po LIKE @search OR 
	pd.planno LIKE @search OR 
	CONCAT('TP', FORMAT(pd.cm_refid, '00000')) LIKE @search OR
	pd.req_qty LIKE @search OR 
	sp.suppliername LIKE @search OR 
	CASE WHEN pd.status=6 THEN 'FQA Pending' WHEN pd.status=777 THEN 'FQA Hold' ELSE 'Processin in Other stage' END LIKE @search OR

	assigner.full_name LIKE @search OR 
	denomination.full_name LIKE @search OR
	box.full_name LIKE @search OR
	label.full_name LIKE @search OR
	pre_ins.full_name LIKE @search OR
	fqa.full_name LIKE @search OR
	picker.full_name LIKE @search OR 
	dispatch.full_name LIKE @search OR 
	firstobduser.full_name LIKE @search OR 
	obduser.full_name LIKE @search OR 
	firstlogisticsuser.full_name LIKE @search OR 
	logisticsuser.full_name LIKE @search OR 
	out_docs_user.full_name LIKE @search OR 
	eway_user.full_name LIKE @search OR 
	shipuser.full_name LIKE @search OR 
	ackuser.full_name LIKE @search OR 

	assigner.empcode LIKE @search OR 
	picker.empcode LIKE @search OR 
	denomination.empcode LIKE @search OR 
	box.empcode LIKE @search OR 
	label.empcode LIKE @search OR 
	pre_ins.empcode LIKE @search OR 
	fqa.empcode LIKE @search OR 
	dispatch.empcode LIKE @search OR 
	firstobduser.empcode LIKE @search OR 
	obduser.empcode LIKE @search OR 
	firstlogisticsuser.empcode LIKE @search OR 
	logisticsuser.empcode LIKE @search OR 
	out_docs_user.empcode LIKE @search OR 
	eway_user.empcode LIKE @search OR 
	shipuser.empcode LIKE @search OR 
	ackuser.empcode LIKE @search OR
	
	assigner.rolename LIKE @search OR 
	picker.rolename LIKE @search OR 
	denomination.rolename LIKE @search OR 
	box.rolename LIKE @search OR 
	label.rolename LIKE @search OR 
	pre_ins.rolename LIKE @search OR 
	fqa.rolename LIKE @search OR 
	dispatch.rolename LIKE @search OR 
	firstobduser.rolename LIKE @search OR 
	obduser.rolename LIKE @search OR 
	firstlogisticsuser.rolename LIKE @search OR 
	logisticsuser.rolename LIKE @search OR 
	out_docs_user.rolename LIKE @search OR 
	eway_user.rolename LIKE @search OR 
	shipuser.rolename LIKE @search OR 
	ackuser.rolename LIKE @search OR 

	pd.assigned_date LIKE @search OR
	pd.pick_date LIKE @search OR
	pd.denomination_date LIKE @search OR
	pd.box_date LIKE @search OR
	pd.labeldone_date LIKE @search OR
	pd.pre_inspect_date LIKE @search OR 
	pd.fqa_date LIKE @search OR 
	pd.dispatch_date LIKE @search OR
	pd.first_obd_date LIKE @search OR
	pd.obd_date LIKE @search OR
	pd.first_logistics_date LIKE @search OR
	pd.dcDate LIKE @search OR
	pd.outward_docs_date LIKE @search OR
	pd.eway_bill_date LIKE @search OR
	pd.ship_date LIKE @search OR
	pd.ack_date LIKE @search OR

	pd.po LIKE @search OR
	pd.planno LIKE @search OR
	pd.tpn LIKE @search OR
	sp.suppliername LIKE @search OR 
	pd.req_qty LIKE @search OR
	pd.totalqty LIKE @search OR
	pd.confirm_qty LIKE @search OR
	pd.sto_number LIKE @search OR
	pd.obd_number LIKE @search OR
	pd.grn_number LIKE @search OR
	pd.sto_invoice LIKE @search OR
	pd.po_number LIKE @search OR
	pd.eway_billno LIKE @search OR 
	pd.truck_number LIKE @search OR
	pd.weight_and_volume LIKE @search OR
	pd.noOfPallet LIKE @search OR 
	pd.invoicenumber LIKE @search OR
	pd.lr_number LIKE @search`,

	detailed_report: `LEFT JOIN (SELECT planno, COUNT(id) AS noofreel,SUM(CASE WHEN fqa_status=2 THEN quantity ELSE 0 END) reject_qty 
		FROM (
			SELECT planno, id,fqa_status,quantity FROM ops_inventory_new_splitup WHERE del_status=0
			UNION ALL
			SELECT planno, id,fqa_status,quantity FROM ops_inventory_wall_to_wall_new_splitup WHERE del_status=0
		) AS combined
    	GROUP BY planno
	) AS ins ON pd.planno = ins.planno
 INNER JOIN planning_cmlist cm ON cm.id = pd.cm_refid AND cm.del_status = 0
 	LEFT JOIN ms_type AS t ON t.id=cm.typeid
    INNER JOIN ms_supplier sp ON sp.id = pd.supplierid
    LEFT JOIN UserRole req ON req.user_id = cm.createdby 
    INNER JOIN UserRole AS assigner ON assigner.user_id = pd.assigned_by 
    LEFT JOIN UserRole picker ON picker.user_id = pd.denomination_by
	LEFT JOIN UserRole AS denomination ON denomination.user_id = pd.denomination_by  
	LEFT JOIN UserRole AS box ON box.user_id = pd.box_by  
	LEFT JOIN UserRole AS label ON label.user_id = pd.labeldone_by  
	LEFT JOIN UserRole AS pre_ins ON pre_ins.user_id = pd.pre_inspect_by  
	LEFT JOIN UserRole AS fqa ON fqa.user_id = pd.fqa_by   
	LEFT JOIN UserRole AS fqa_hold ON fqa_hold.user_id = pd.fqa_hold_by  
	LEFT JOIN UserRole AS dispatch ON dispatch.user_id = pd.dispatch_by    
	LEFT JOIN UserRole AS firstobduser ON firstobduser.user_id = pd.first_obd_by    
	LEFT JOIN UserRole AS obduser ON obduser.user_id = pd.obd_by  
	LEFT JOIN UserRole AS firstlogisticsuser ON firstlogisticsuser.user_id = pd.first_logistics_by 
	LEFT JOIN UserRole AS logisticsuser ON logisticsuser.user_id = pd.logistics_by   
	LEFT JOIN UserRole AS out_docs_user ON out_docs_user.user_id = pd.outward_docs_by  
	LEFT JOIN UserRole AS eway_user ON eway_user.user_id = pd.eway_bill_by 
	LEFT JOIN UserRole AS shipuser ON shipuser.user_id = pd.ship_by 
	LEFT JOIN UserRole AS ackuser ON ackuser.user_id = pd.ack_by

    WHERE cm.del_status = 0 AND (
	pd.po LIKE @search OR 
	pd.planno LIKE @search OR 
	CONCAT('TP', FORMAT(pd.cm_refid, '00000')) LIKE @search OR
	pd.req_qty LIKE @search OR 
	sp.suppliername LIKE @search OR 

	assigner.full_name LIKE @search OR 
	denomination.full_name LIKE @search OR
	box.full_name LIKE @search OR
	label.full_name LIKE @search OR
	pre_ins.full_name LIKE @search OR
	fqa.full_name LIKE @search OR
	picker.full_name LIKE @search OR 
	dispatch.full_name LIKE @search OR 
	firstobduser.full_name LIKE @search OR 
	obduser.full_name LIKE @search OR 
	firstlogisticsuser.full_name LIKE @search OR 
	logisticsuser.full_name LIKE @search OR 
	out_docs_user.full_name LIKE @search OR 
	eway_user.full_name LIKE @search OR 
	shipuser.full_name LIKE @search OR 
	ackuser.full_name LIKE @search OR 

	assigner.empcode LIKE @search OR 
	picker.empcode LIKE @search OR 
	denomination.empcode LIKE @search OR 
	box.empcode LIKE @search OR 
	label.empcode LIKE @search OR 
	pre_ins.empcode LIKE @search OR 
	fqa.empcode LIKE @search OR 
	dispatch.empcode LIKE @search OR 
	firstobduser.empcode LIKE @search OR 
	obduser.empcode LIKE @search OR 
	firstlogisticsuser.empcode LIKE @search OR
	logisticsuser.empcode LIKE @search OR 
	out_docs_user.empcode LIKE @search OR 
	eway_user.empcode LIKE @search OR 
	shipuser.empcode LIKE @search OR 
	ackuser.empcode LIKE @search OR
	
	assigner.rolename LIKE @search OR 
	picker.rolename LIKE @search OR 
	denomination.rolename LIKE @search OR 
	box.rolename LIKE @search OR 
	label.rolename LIKE @search OR 
	pre_ins.rolename LIKE @search OR 
	fqa.rolename LIKE @search OR 
	dispatch.rolename LIKE @search OR 
	firstobduser.rolename LIKE @search OR 
	obduser.rolename LIKE @search OR 
	firstlogisticsuser.rolename LIKE @search OR 
	logisticsuser.rolename LIKE @search OR 
	out_docs_user.rolename LIKE @search OR 
	eway_user.rolename LIKE @search OR 
	shipuser.rolename LIKE @search OR 
	ackuser.rolename LIKE @search OR 

	pd.assigned_date LIKE @search OR
	pd.pick_date LIKE @search OR
	pd.denomination_date LIKE @search OR
	pd.box_date LIKE @search OR
	pd.labeldone_date LIKE @search OR
	pd.pre_inspect_date LIKE @search OR 
	pd.fqa_date LIKE @search OR 
	pd.dispatch_date LIKE @search OR
	pd.first_obd_date LIKE @search OR
	pd.obd_date LIKE @search OR
	pd.first_logistics_date LIKE @search OR
	pd.dcDate LIKE @search OR
	pd.outward_docs_date LIKE @search OR
	pd.eway_bill_date LIKE @search OR
	pd.ship_date LIKE @search OR
	pd.ack_date LIKE @search OR

	pd.pick_tat LIKE @search OR
	pd.box_tat LIKE @search OR
	pd.label_tat LIKE @search OR
	pd.pre_inspect_tat LIKE @search OR
	pd.fqa_tat LIKE @search OR
	pd.dispatch_tat LIKE @search OR
	pd.first_obd_tat LIKE @search OR
	pd.obd_tat LIKE @search OR
	pd.first_logistics_tat LIKE @search OR
	pd.logistics_tat LIKE @search OR
	pd.outward_docs_tat LIKE @search OR
	pd.eway_bill_tat LIKE @search OR
	pd.ship_tat LIKE @search OR
	pd.ack_tat LIKE @search OR

	pd.po LIKE @search OR
	pd.planno LIKE @search OR
	pd.tpn LIKE @search OR
	sp.suppliername LIKE @search OR 
	pd.req_qty LIKE @search OR
	pd.totalqty LIKE @search OR
	pd.confirm_qty LIKE @search OR
	pd.sto_number LIKE @search OR
	pd.obd_number LIKE @search OR
	pd.grn_number LIKE @search OR
	pd.sto_invoice LIKE @search OR
	pd.po_number LIKE @search OR
	pd.eway_billno LIKE @search OR 
	pd.truck_number LIKE @search OR
	pd.weight_and_volume LIKE @search OR
	pd.noOfPallet LIKE @search OR 
	pd.invoicenumber LIKE @search)`,

	inward_shelf_life_expiry: `
	WHERE DaysToExpiry <= 0 AND (
		datecode LIKE @search OR
		mpn_number LIKE @search OR
		tpn_number LIKE @search OR
		ManufactureDate LIKE @search OR
		ExpiryDate LIKE @search OR
		DaysToExpiry LIKE @search
		)
	ORDER BY DaysToExpiry ASC`,

	inward_shelf_life_expiry_partwise: `
	WHERE DaysToExpiry <= 0 AND (
		datecode LIKE @search OR
		mpn_number LIKE @search OR
		tpn_number LIKE @search OR
		ManufactureDate LIKE @search OR
		ExpiryDate LIKE @search OR
		DaysToExpiry LIKE @search
		)
	GROUP BY tpn_number,mpn_number,datecode,ManufactureDate,ExpiryDate,DaysToExpiry 
	ORDER BY DaysToExpiry ASC`
	,

	shelf_life_expiry: `
	WHERE DaysToExpiry <= 0 AND (
		datecode LIKE @search OR
		mpn_number LIKE @search OR
		tpn_number LIKE @search OR
		ManufactureDate LIKE @search OR
		ExpiryDate LIKE @search OR
		DaysToExpiry LIKE @search
		)
	ORDER BY DaysToExpiry ASC`,

	shelf_life_expiry_partwise: `
	WHERE DaysToExpiry <= 0 AND (
		datecode LIKE @search OR
		mpn_number LIKE @search OR
		tpn_number LIKE @search OR
		ManufactureDate LIKE @search OR
		ExpiryDate LIKE @search OR
		DaysToExpiry LIKE @search
		)
	GROUP BY tpn_number,mpn_number,datecode,ManufactureDate,ExpiryDate,DaysToExpiry 
	ORDER BY DaysToExpiry ASC`
}

export { CTEQueries, CTEJoinAndWhereQueries }