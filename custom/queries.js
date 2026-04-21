import { CTEJoinAndWhereQueries, CTEQueries } from "./CTEAndJoinsQueries.js"

export const queries = {
	// Settings
	ms_screenlist: `SELECT s.id,s.menuname,s.screenname,s.screenpath,s.defaultLayout,ISNULL(STUFF((SELECT ','+[permission_name] FROM ms_permissions WHERE id IN(SELECT value FROM STRING_SPLIT(s.[permissions],',')) for xml path('')),1,1,''),'') permision_name,TRIM(u.firstname +' '+ u.lastname) created_by, r.rolename AS created_byrole,u.empcode AS created_byempcode,ISNULL(u.profile,'') created_byprofile,CONVERT(VARCHAR(19),s.createddate,29) createddate FROM ms_screenlist AS s INNER JOIN ms_user AS u ON u.id=s.createdby INNER JOIN ms_role AS r ON r.id=u.roleid WHERE s.menuname LIKE @search OR s.screenname LIKE @search OR s.screenpath LIKE @search OR ISNULL(STUFF((SELECT ','+[permission_name] FROM ms_permissions WHERE id IN(SELECT value FROM STRING_SPLIT(s.[permissions],',')) for xml path('')),1,1,''),'') LIKE @search OR TRIM(u.firstname +' '+ u.lastname) LIKE @search OR u.empcode LIKE @search OR CONVERT(VARCHAR(19),s.createddate,29) LIKE @search OR r.rolename LIKE @search ORDER BY s.position`,

	ms_user: `SELECT u.id,u.firstname +' '+u.lastname AS [user],u.firstname,u.lastname,u.empcode,u.empcode userempcode,r.rolename userrole,s.suppliername,u.supplierid,u.roleid,d.departmentname,u.departmentid,u.password,u.status,ISNULL(u.profile,'') userprofile,ISNULL(u.profile,'') profile FROM ms_user AS u INNER JOIN ms_role AS r ON r.id=u.roleid INNER JOIN ms_department AS d ON d.id=u.departmentid LEFT JOIN ms_supplier As s ON s.id=u.supplierid WHERE u.del_status=0 AND (u.firstname +' '+u.lastname LIKE @search OR u.lastname LIKE @search OR u.empcode LIKE @search OR r.rolename LIKE @search OR d.departmentname LIKE @search OR s.suppliername LIKE @search) ORDER BY u.id DESC`,

	ms_role: `SELECT r.id ,r.plantid ,p.plantcode + ' - ' + p.plantname AS plant,r.rolename ,r.description ,isnull(screenid,'') screenid ,r.status,isnull(r.homepage,0) homepage FROM ms_role AS r INNER JOIN ms_plant AS p ON p.id=r.plantid WHERE r.del_status=0 AND r.plantid=@plantid AND (p.plantcode + ' - ' + p.plantname LIKE @search OR r.rolename LIKE @search OR r.description LIKE @search) ORDER BY id DESC`,

	ms_department: `SELECT * FROM ms_department WHERE del_status=0 AND (departmentname LIKE @search OR description LIKE @search) ORDER BY id DESC`,

	ms_reason:
		`SELECT 
    r.id, 
    ISNULL(r.type, '') AS type, 
    ISNULL(r.reason, '') AS reason,
    ISNULL(r.status, '') AS status,
    CONVERT(VARCHAR(19), CASE WHEN r.updateddate IS NULL THEN r.createddate ELSE r.updateddate END, 29) AS createddate, 
    TRIM(u.firstname + ' ' + u.lastname) AS createdby, 
    u.empcode AS createdbyempcode, 
    ISNULL(u.[profile], '') AS createdbyempprofile, 
    role.rolename AS createdbyrole
FROM ms_reason AS r 
LEFT JOIN ms_user AS u ON r.createdby = u.id 
LEFT JOIN ms_role AS role ON u.roleid = role.id 
WHERE r.del_status = 0 ORDER BY r.id DESC`
	,

	ms_mode_of_transport: `
SELECT m.id, ISNULL(m.mode_type,'')mode_type, ISNULL (m.description,'') description ,ISNULL (m.status ,'') as status ,
CONVERT(VARCHAR(19),CASE WHEN m.updatedate IS NULL THEN m.createddate ELSE m.updatedate END,29) AS createddate, 
TRIM(u.firstname +' ' +u.lastname) AS created_by, u.empcode AS created_byempcode, ISNULL(u.[profile],'') AS
created_byempprofile, r.rolename AS created_byrole FROM ms_mode_of_transport as m LEFT JOIN ms_user as u ON m.createdby = u.id 
LEFT JOIN ms_role r ON u.roleid = r.id WHERE m.del_status=0
   AND (m.mode_type LIKE @search OR m.mode_type LIKE @search OR isnull(m.description,'') like @search) order by id desc `,

	ms_inward_doc_type:
		`
SELECT i.id, ISNULL(i.doc_type,'')doc_type, ISNULL (i.description,'') description ,ISNULL (i.status ,'') as status ,
CONVERT(VARCHAR(19),CASE WHEN i.updatedate IS NULL THEN i.createddate ELSE i.updatedate END,29) AS createddate, 
TRIM(u.firstname +' ' +u.lastname) AS created_by, u.empcode AS created_byempcode, ISNULL(u.[profile],'') AS
created_byempprofile, r.rolename AS created_byrole FROM ms_inward_doc_type as i LEFT JOIN ms_user as u ON i.createdby = u.id 
LEFT JOIN ms_role r ON u.roleid = r.id WHERE i.del_status=0
   AND (i.doc_type LIKE @search OR i.doc_type LIKE @search OR isnull(i.description,'') like @search) order by id desc`,


	users_activity: `SELECT ua.id,u.firstname +' '+u.lastname AS [user],u.empcode userempcode,r.rolename userrole,d.departmentname,ISNULL(u.profile,'') userprofile,ua.activity_type,ua.activity_data,CASE WHEN u.del_status=1 THEN 'Deleted' WHEN u.status=1 THEN 'Active' WHEN u.status=0 THEN 'InActive' ELSE 'NA' END [status],CONVERT(VARCHAR(19),ua.created_at,29) created_at FROM user_activity_log AS ua INNER JOIN ms_user AS u ON u.id=ua.userid INNER JOIN ms_role AS r ON r.id=u.roleid INNER JOIN ms_department AS d ON d.id=u.departmentid WHERE u.id=CASE WHEN ISNULL(@userid,'')='' THEN u.id ELSE @userid END AND (u.firstname +' '+u.lastname LIKE @search OR u.empcode LIKE @search OR r.rolename LIKE @search OR d.departmentname LIKE @search OR CASE WHEN u.del_status=1 THEN 'Deleted' WHEN u.status=1 THEN 'Active' WHEN u.status=0 THEN 'InActive' ELSE 'NA' END LIKE @search OR ua.activity_type LIKE @search OR ua.activity_data LIKE @search) ORDER BY ua.id DESC`,

	ms_screenmenu_details: `SELECT * FROM ms_screenmenu_details WHERE (menuname LIKE @search OR description LIKE @search OR btntext LIKE @search OR color LIKE @search) ORDER BY id DESC`,

	// Masters
	ms_part: `SELECT * FROM ms_part WHERE del_status=0 AND (type LIKE @search OR tpn LIKE @search OR noofmonths LIKE @search OR description LIKE @search) ORDER BY id DESC`,

	ms_location: `SELECT id,ISNULL(type,'') type,location,ISNULL(description,'') description,mixedtpn,status,CASE WHEN mixedtpn=1 THEN 'Yes' ELSE 'No' END mixedTpnLabel FROM ms_location WHERE del_status=0 AND (type LIKE @search OR location LIKE @search OR ISNULL(description,'') LIKE @search OR CASE WHEN mixedtpn=1 THEN 'Yes' ELSE 'No' END LIKE @search) ORDER BY id DESC`,

	ms_mpn_tpnmapping: `SELECT m.id,m.mpn_number, m.tpn_number,CONVERT(VARCHAR(19),CASE WHEN m.updateddate IS NULL THEN m.createddate ELSE m.updateddate END,29) AS createddate, TRIM(u.firstname +' ' +u.lastname) AS created_by, u.empcode AS created_byempcode, ISNULL(u.[profile],'') AS created_byempprofile, r.rolename AS created_byrole FROM ms_mpn_tpnmapping as m LEFT JOIN ms_user as u ON m.createdby = u.id LEFT JOIN ms_role r ON u.roleid = r.id WHERE m.del_status=0 AND (m.mpn_number LIKE @search OR m.tpn_number LIKE @search OR CONVERT(VARCHAR(19),CASE WHEN m.updateddate IS NULL THEN m.createddate ELSE m.updateddate END,29) LIKE @search OR TRIM(u.firstname +' ' +u.lastname) LIKE @search OR u.empcode LIKE @search OR u.updateddate LIKE @search OR r.rolename LIKE @search) ORDER BY m.id DESC`,

	ms_dock: `
	SELECT 
	d.id,
	d.plantid,
	p.plantcode + ' - ' + p.plantname AS plant,
	CASE 
		WHEN ISNULL(d.dock_assigned,0)=0 THEN 'No' 
		WHEN d.dock_assigned=1 THEN 'Yes' 
		ELSE 'NA' 
	END dock_assigned,
	d.dock_number, 
	d.description,
	d.status,
	CONVERT(VARCHAR(19),CASE WHEN d.updateddate IS NULL THEN d.createddate ELSE d.updateddate END,29) AS createddate, 
	TRIM(u.firstname +' ' +u.lastname) AS created_by, 
	u.empcode AS created_byempcode, 
	ISNULL(u.[profile],'') AS created_byempprofile, 
	r.rolename AS created_byrole 
FROM ms_dock as d 
LEFT JOIN ms_user as u ON d.createdby = u.id 
LEFT JOIN ms_role r ON u.roleid = r.id
INNER JOIN ms_plant AS p ON p.id=d.plantid
WHERE d.del_status=0 AND d.plantid=@plantid
AND (
	p.plantcode + ' - ' + p.plantname LIKE @search OR
	CASE 
		WHEN ISNULL(d.dock_assigned,0)=0 THEN 'No' 
		WHEN d.dock_assigned=1 THEN 'Yes' 
		ELSE 'NA' 
	END LIKE @search OR 
	d.dock_number LIKE @search OR 
	d.description LIKE @search OR 
	CONVERT(VARCHAR(19),CASE WHEN d.updateddate IS NULL THEN d.createddate ELSE d.updateddate END,29) LIKE @search OR 
	TRIM(u.firstname +' ' +u.lastname) LIKE @search OR 
	u.empcode LIKE @search OR 
	u.updateddate LIKE @search OR 
	r.rolename LIKE @search
) 
ORDER BY d.id DESC
	`,

	// Binning
	ms_sap_stocklist: `SELECT * FROM ms_sap_stocklist WHERE del_status=0 AND (plant LIKE @search OR tpn LIKE @search OR quantity LIKE @search OR value LIKE @search) ORDER BY id DESC`,


	sap_vs_actualreport_new: `SELECT s.material AS tpn, s.availablequantity AS sapquantity, COALESCE(i.total_quantity, 0) AS quantity, CASE WHEN s.availablequantity = COALESCE(i.total_quantity, 0) THEN 'Matched' WHEN s.availablequantity > COALESCE(i.total_quantity, 0) THEN 'Shortage' WHEN s.availablequantity < COALESCE(i.total_quantity, 0) THEN 'Excess' ELSE 'NA' END AS status, ABS(s.availablequantity - COALESCE(i.total_quantity, 0)) AS differenceqty FROM planning_sapstocklist AS s LEFT JOIN ( SELECT tpn, SUM(quantity) AS total_quantity FROM ops_inventory_new WHERE del_status = 0 AND status = 1 GROUP BY tpn ) AS i ON s.material = i.tpn WHERE (@search IS NULL OR s.material LIKE @search OR s.availablequantity LIKE @search OR COALESCE(i.total_quantity, 0) LIKE @search OR CASE WHEN s.availablequantity = COALESCE(i.total_quantity, 0) THEN 'Matched' WHEN s.availablequantity > COALESCE(i.total_quantity, 0) THEN 'Shortage' WHEN s.availablequantity < COALESCE(i.total_quantity, 0) THEN 'Excess' ELSE 'NA' END LIKE @search OR ABS(s.availablequantity - COALESCE(i.total_quantity, 0)) LIKE @search) ORDER BY s.material`,

	inventory_report: `
	SELECT 
		i.id,
		UPPER(i.palletno) AS palletno,
		UPPER(l.location) AS location,
		UPPER(i.tpn) as tpn,
		i.quantity, 
		ISNULL(UPPER(u.firstname)+' '+UPPER(u.lastname),'') AS auditby, 
		ISNULL(u.empcode,'') AS auditbyempcode, 
		ISNULL(r.rolename,'') AS auditbyrole, 
		ISNULL(u.profile,'') auditbyprofile, 
		CONVERT(VARCHAR(19),i.createddate,29) AS auditdate, 
		COALESCE(ins.quantity, 0) AS reel_qty,
		COALESCE(ins.safety_stock, 0) AS safety_stock,
		CASE 
			WHEN i.quantity=COALESCE(ins.quantity, 0) THEN 'Matched' 
			WHEN i.quantity>COALESCE(ins.quantity, 0) THEN 'Excess' 
			WHEN i.quantity<COALESCE(ins.quantity, 0) THEN 'Shortage' 
			ELSE 'NA' 
		END status 
	FROM ops_inventory_new AS i 
	INNER JOIN (SELECT id,location FROM ms_location) AS l ON l.id=i.locationid 
	LEFT JOIN ms_user as u on u.id=i.createdby LEFT JOIN ms_role as r on r.id=u.roleid  
	LEFT JOIN (SELECT inv_id, SUM(IIF(safetystatus=0,quantity,0)) AS quantity, ISNULL(SUM(IIF(safetystatus=1,quantity,0)),0) AS safety_stock 
		FROM (
			SELECT inv_id, id,quantity,ISNULL(safetystatus,0) safetystatus FROM ops_inventory_new_splitup WHERE del_status=0 AND ISNULL(is_out,0)=0
			UNION ALL
			SELECT inv_id, id,quantity,ISNULL(safetystatus,0) safetystatus FROM ops_inventory_wall_to_wall_new_splitup WHERE del_status=0 AND ISNULL(is_out,0)=0
		) AS combined
    	GROUP BY inv_id
	) AS ins ON i.id = ins.inv_id

	WHERE i.del_status=0 AND (
    (@reportType = 'Empty' AND i.quantity <= 0)
    OR (
        @reportType <> 'Empty'
        AND i.quantity > 0
        AND (
            @status = '' OR
            (@status = 'Matched' AND i.quantity = COALESCE(ins.quantity, 0)) OR
            (@status = 'Excess' AND i.quantity > COALESCE(ins.quantity, 0)) OR
            (@status = 'Shortage' AND i.quantity < COALESCE(ins.quantity, 0))
        )
    )
)
AND (
    @reportType = 'Empty'
    OR (
        (@safetystatus IS NOT NULL AND ins.safety_stock > 0)
        OR (@safetystatus IS NULL)
    )
)
AND (
    @reportType = 'Empty'
    OR (
        UPPER(i.palletno) LIKE @search OR
        UPPER(l.location) LIKE @search OR
        UPPER(i.tpn) LIKE @search OR
        CAST(i.quantity AS VARCHAR) LIKE @search OR
        UPPER(u.firstname) + ' ' + UPPER(u.lastname) LIKE @search OR
        CONVERT(VARCHAR(19), i.createddate, 29) LIKE @search
    )
) ORDER BY i.id DESC`,

	inventory_detailed_report: `

	SELECT DISTINCT 
    ins.id,
    'GRN LABEL' type,
    IIF(ins.mixedtpn=1,'Mixed TPN','Non-Mixed TPN') mixedtpn,
    ins.inv_id,
    IIF(ISNULL(ins.safetystatus,0)=0,'In Inventory','Safety') safetystatus,
    CONCAT('GRNLBL', ins.grn_label_id) AS labelid, 
	CASE WHEN ins.parentid IS NULL THEN '' ELSE CONCAT('GRNLBL', ins.parentid) END AS parentid,
    lg.storagelocation,
    ins.palletno, 
    loc.location,
    lg.mpn_number, 
    lg.tpn_number, 
    ins.quantity,
    lg.serialno,
    IIF(ISNULL(CONVERT(VARCHAR,lg.datecode),0) = 0,'No Date Code',CONVERT(VARCHAR,lg.datecode)) datecode, 
    lg.make,
    lg.invoice_number,
    lg.grn_number,
    lg.grn_date,
    u.firstname + ' ' + u.lastname as created_by, 
    u.empcode as created_byempcode, 
    ISNULL(u.profile, '') as created_byprofile, 
    r.rolename as created_byrole, 
    CONVERT(VARCHAR(19), ins.createddate, 29)  as createddate,
-- Calculate Manufacture Date
    IIF(ISNULL(CONVERT(VARCHAR,lg.datecode),0)=0,'No Date Code',CONVERT(VARCHAR(10),DATEADD(DAY, 
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
    ),27)) AS ManufactureDate,
    -- Calculate Expiry Date
    IIF(ISNULL(CONVERT(VARCHAR,lg.datecode),0)=0,'No Date Code',CONVERT(VARCHAR(10),DATEADD(MONTH, PT.noofmonths, 
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
    ),27)) AS ExpiryDate,
    -- Calculate Days to Expiry
    ISNULL(CONVERT(VARCHAR,DATEDIFF(DAY, 
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
    )),0) AS DaysToExpiry FROM ops_inventory_new_splitup AS ins 
     INNER JOIN ms_location AS loc ON loc.id = ins.locationid 
     INNER JOIN ms_part AS PT ON PT.tpn = ins.tpn 
     INNER JOIN inward_label_generation AS lg ON lg.id = ins.grn_label_id
     INNER JOIN ms_user as u on u.id = ins.createdby 
     INNER JOIN ms_role as r on r.id = u.roleid  
WHERE ins.del_status=0 AND 
     ISNULL(ins.is_out,0)=0 AND 
     ISNULL(ins.mixedtpn,0)=ISNULL(@mixedtpn,ins.mixedtpn) AND
     ISNULL(ins.safetystatus,0) = IIF(ISNULL(@safetystatus,0) = 0,ISNULL(ins.safetystatus, 0), @safetystatus) 
     AND ISNULL(lg.storagelocation,0) =  IIF(ISNULL(@storagelocation,0) = 0,ISNULL(lg.storagelocation, 0), @storagelocation) 
	 AND (
	CONCAT('GRNLBL', ins.grn_label_id) LIKE @search OR 
    lg.storagelocation LIKE @search OR
	CASE WHEN ins.parentid IS NULL THEN '' ELSE CONCAT('GRNLBL', ins.parentid) END LIKE @search OR  
    IIF(ins.mixedtpn=1,'Mixed TPN', 'Non-Mixed TPN') LIKE @search OR
    ins.palletno LIKE @search OR 
    loc.location LIKE @search OR 
    lg.mpn_number LIKE @search OR 
    ins.tpn LIKE @search OR 
    ins.quantity LIKE @search OR 
    lg.serialno LIKE @search OR 
    lg.datecode LIKE @search OR 
    lg.make LIKE @search OR 
    u.firstname + ' ' + u.lastname LIKE @search OR 
    u.empcode LIKE @search OR 
    r.rolename LIKE @search OR 
    FORMAT(ins.createddate, 'dd/MM/yyyy HH:mm:ss') LIKE @search 
 )

UNION ALL

SELECT DISTINCT 
    ins.id,'AUDIT LABEL' type,
    IIF(ins.mixedtpn=1,'Mixed TPN','Non-Mixed TPN') mixedtpn,
    ins.inv_id,
    IIF(ISNULL(ins.safetystatus,0)=0,'In Inventory','Safety') safetystatus,
    CONCAT('LBL',ins.grn_label_id) as labelid, 
	CASE WHEN ins.parentid IS NULL THEN '' ELSE CONCAT('GRNLBL', ins.parentid) END AS parentid,
    '' AS storagelocation,
    ins.palletno, 
    loc.location,
    wsp.mpn_number, 
    ins.tpn tpn_number, 
    ins.quantity,
    '' serialno,
    IIF(ISNULL(CONVERT(VARCHAR,wsp.datecode),0) = 0,'No Date Code',CONVERT(VARCHAR,wsp.datecode)) datecode,
    wsp.make,
    '' invoice_number,'' 
    grn_number,
    '' grn_date, 
    u.firstname + ' ' + u.lastname as created_by, 
    u.empcode as created_byempcode, 
    ISNULL(u.profile, '') as created_byprofile, 
    r.rolename as created_byrole, 
    CONVERT(VARCHAR(19), ins.createddate, 29)  as createddate,
-- Calculate Manufacture Date
    IIF(ISNULL(CONVERT(VARCHAR,wsp.datecode),0)=0,'No Date Code',CONVERT(VARCHAR(10),DATEADD(DAY, 
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
    ),27)) AS ManufactureDate,
    -- Calculate Expiry Date
    IIF(ISNULL(CONVERT(VARCHAR,wsp.datecode),0)=0,'No Date Code',CONVERT(VARCHAR(10),DATEADD(MONTH, PT.noofmonths, 
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
    ),27)) AS ExpiryDate,
    -- Calculate Days to Expiry
    ISNULL(CONVERT(VARCHAR,DATEDIFF(DAY, 
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
    )),0) AS DaysToExpiry 
FROM ops_inventory_wall_to_wall_new_splitup as ins 
LEFT JOIN cyclecount_wall_to_wall_label_splitup AS wsp ON wsp.label_id = ins.grn_label_id
INNER JOIN ms_location as loc on loc.id = ins.locationid 
LEFT JOIN ms_part AS PT ON PT.tpn = ins.tpn 
INNER JOIN ms_user as u on u.id = ins.createdby INNER JOIN ms_role as r on r.id = u.roleid 
WHERE ins.del_status=0 AND 
ISNULL(ins.is_out,0) = 0 AND 
ISNULL(ins.mixedtpn,0)=ISNULL(@mixedtpn,ins.mixedtpn) AND
ISNULL(ins.safetystatus,0)=IIF(ISNULL(@safetystatus,0)=0,ISNULL(ins.safetystatus,0),@safetystatus)  
AND (
    CONCAT('LBL', ins.grn_label_id) LIKE @search OR  
	CASE WHEN ins.parentid IS NULL THEN '' ELSE CONCAT('GRNLBL', ins.parentid) END LIKE @search OR
    IIF(ins.mixedtpn=1,'Mixed TPN','Non-Mixed TPN') LIKE @search OR
    ins.palletno LIKE @search OR 
    loc.location LIKE @search OR 
    wsp.mpn_number LIKE @search OR 
    ins.tpn LIKE @search OR 
    ins.quantity LIKE @search OR 
    wsp.datecode LIKE @search OR 
    wsp.make LIKE @search OR 
    u.firstname + ' ' + u.lastname LIKE @search OR 
    u.empcode LIKE @search OR 
    r.rolename LIKE @search
) 
ORDER BY ExpiryDate DESC
`,

	quarantine_inventory_detailed_report: `
	SELECT 
	DISTINCT
		'GRN LABEL' AS type,
		ins.id,
		'GRNLBL' + CONVERT(VARCHAR, lg.id) AS labelid,
		ins.boxno, 
		ins.palletno, 
		loc.location,
		p.mpn_number, 
		ins.tpn, 
		ins.quantity,
		lg.datecode, 
		u.firstname + ' ' + u.lastname AS created_by, 
		u.empcode AS created_byempcode, 
		ISNULL(u.profile, '') AS created_byprofile, 
		r.rolename AS created_byrole, 
		CONVERT(VARCHAR(19), ins.createddate, 29) AS createddate 
	FROM ops_inventory_new_splitup_quarantine AS ins 
	INNER JOIN ms_location AS loc ON loc.id = ins.locationid 
	INNER JOIN inward_label_generation AS lg ON CAST(lg.id AS NVARCHAR) = CASE WHEN CHARINDEX('-', ins.grn_label_id) > 0 THEN LEFT(ins.grn_label_id, CHARINDEX('-', ins.grn_label_id) - 1) ELSE ins.grn_label_id END
	INNER JOIN ms_user AS u ON u.id = ins.createdby 
	INNER JOIN ms_role AS r ON r.id = u.roleid 
	INNER JOIN inward_physical_Verification AS p ON p.id=lg.physical_refid 
	WHERE ins.del_status=0 AND (
		'GRNLBL' + CONVERT(VARCHAR, lg.id) LIKE @search  OR ins.boxno LIKE @search OR   ins.palletno LIKE @search OR loc.location LIKE @search OR p.mpn_number LIKE @search OR ins.tpn LIKE @search OR ins.quantity LIKE @search OR lg.datecode LIKE @search OR u.firstname + ' ' + u.lastname LIKE @search OR u.empcode LIKE @search OR r.rolename LIKE @search OR CONVERT(VARCHAR, ins.createddate, 103) + ' ' + right('00' + CONVERT(VARCHAR(2), DATEPART(HOUR, ins.createddate)), 2) + ':' + right('00' + CONVERT(VARCHAR(2), DATEPART(MINUTE, ins.createddate)), 2) + ':' + right('00' + CONVERT(VARCHAR(2), DATEPART(SECOND, ins.createddate)), 2) LIKE @search 
		)

	UNION ALL

	SELECT 
	DISTINCT 
		'AUDIT LABEL' AS type,
		ins.id,
		CONCAT('LBL',ins.grn_label_id) AS labelid,
		ins.boxno, 
		ins.palletno, 
		loc.location,
		wsp.mpn_number, 
		ins.tpn, 
		ins.quantity,
		wsp.datecode, 
		u.firstname + ' ' + u.lastname AS created_by, 
		u.empcode AS created_byempcode, 
		ISNULL(u.profile, '') AS created_byprofile, 
		r.rolename AS created_byrole, 
		CONVERT(VARCHAR(19), ins.createddate, 29) AS createddate 
	FROM ops_inventory_wall_to_wall_new_splitup_quarantine AS ins 
	LEFT JOIN cyclecount_wall_to_wall_label_splitup AS wsp ON wsp.label_id=CASE 
            WHEN CHARINDEX('-', ins.grn_label_id) = 0 THEN 
                ins.grn_label_id -- No hyphen
            WHEN LEN(SUBSTRING(ins.grn_label_id, 
                              CHARINDEX('-', ins.grn_label_id) + 1, 
                              LEN(ins.grn_label_id))) < 3 THEN
                LEFT(ins.grn_label_id, 
                     CHARINDEX('-', ins.grn_label_id) - 1) -- Before first hyphen
            WHEN LEN(SUBSTRING(ins.grn_label_id, 
                              CHARINDEX('-', ins.grn_label_id) + 1, 
                              LEN(ins.grn_label_id))) >= 5 AND
                 LEN(ins.grn_label_id) - LEN(REPLACE(ins.grn_label_id, '-', '')) > 1 THEN
                LEFT(ins.grn_label_id, 
                     CHARINDEX('-', ins.grn_label_id, 
                               CHARINDEX('-', ins.grn_label_id) + 1) - 1) -- Before second hyphen
            ELSE
                ins.grn_label_id -- Return full value
        END
		  
	INNER JOIN ms_location AS loc ON loc.id = ins.locationid 
	INNER JOIN ms_user AS u ON u.id = ins.createdby 
	INNER JOIN ms_role AS r ON r.id = u.roleid 
	WHERE ins.del_status=0 AND (
		CONCAT('LBL',ins.grn_label_id) LIKE @search OR ins.boxno LIKE @search OR ins.palletno LIKE @search OR loc.location  LIKE @search OR wsp.mpn_number LIKE @search OR ins.tpn LIKE @search OR ins.quantity LIKE @search OR wsp.datecode LIKE @search OR u.firstname + ' ' + u.lastname LIKE @search OR u.empcode LIKE @search OR r.rolename LIKE @search
		) 

	ORDER BY id DESC`,

	putaway_pending: `
	SELECT 
		lg.id,
		'GRNLBL' + CONVERT(VARCHAR, lg.id) AS labelid, 
		p.mpn_number, 
		p.tpn_number, 
		lg.grn_number,
		lg.invoice_number,
		lg.quantity,
		lg.datecode, 
		u.firstname + ' ' + u.lastname AS created_by, 
		u.empcode AS created_byempcode, 
		ISNULL(u.profile, '') AS created_byprofile, 
		r.rolename AS created_byrole, 
		CONVERT(VARCHAR(19), lg.createddate, 29)  AS createddate 
	FROM inward_label_generation AS lg  
	INNER JOIN ms_user AS u ON u.id = lg.createdby INNER JOIN ms_role AS r ON r.id = u.roleid 
	LEFT JOIN inward_physical_Verification AS p ON p.id=lg.physical_refid 
	WHERE lg.status=2 AND lg.del_status=0 AND ISNULL(lg.is_putaway,0)=0 AND (
		'GRNLBL' + CONVERT(VARCHAR, lg.id) like @search OR p.mpn_number like @search OR p.tpn_number like @search OR lg.quantity like @search OR lg.datecode LIKE @search OR lg.make LIKE @search OR u.firstname + ' ' + u.lastname like @search OR u.empcode like @search OR r.rolename like @search OR FORMAT(lg.createddate, 'dd/MM/yyyy HH:mm:ss') like @search
		) 
	ORDER BY lg.id DESC`,

	mixed_tpn: ` SELECT mt.id,CONCAT('LBL',mt.label_id) label_id,ISNULL(mt.mpn,'') mpn,mt.tpn,l.location,mt.quantity,CONVERT(VARCHAR(19),mt.createddate,29) inv_date, u.firstname +' '+u.lastname inv_by, u.empcode AS inv_byempcode, r.rolename AS inv_byrole,isnull(u.profile,'') inv_byprofile FROM mixed_tpn_new AS mt INNER JOIN ms_user AS u ON u.id=mt.createdby INNER JOIN ms_role AS r ON r.id=u.roleid inner join ms_location as l on l.id=mt.locationid WHERE mt.del_status=0 AND (CONCAT('LBL',mt.label_id) LIKE @search OR ISNULL(mt.mpn,'') LIKE @search OR mt.tpn LIKE @search OR l.location LIKE @search OR mt.quantity LIKE @search OR CONVERT(VARCHAR,mt.createddate,25) LIKE @search OR  u.firstname +' '+u.lastname LIKE @search) ORDER BY mt.id DESC`,

	// Outward
	ms_supplier: `SELECT id,suppliercode,suppliername,gst,email,mobile,address,remarks,status,ISNULL(OutwardProcessStatus,'') OutwardProcessStatus FROM ms_supplier WHERE del_status=0 AND (suppliercode LIKE @search OR suppliername LIKE @search OR gst LIKE @search OR email LIKE @search OR mobile LIKE @search OR remarks LIKE @search) ORDER BY id DESC`,

	planning_cmlist: `
	SELECT 
	pc.id,
	CONCAT('TP', FORMAT(pc.id, '00000')) AS orderno,
	t.[type],
	UPPER(pc.component) component,
	pc.modelname,
	sp.suppliername AS vendor,
	pc.po,
	pc.description,
	pc.requestquantity,
	pc.priority,
	pc.bypass_qty,
	pc.bypass_remarks,
	CONVERT(VARCHAR,pc.createddate,29) requestedon,
	ISNULL(pc.planned_requested_qty,0) planned_requested_qty,
	ISNULL(ps.availablequantity,0) availablequantity,
	CASE WHEN pc.requestquantity<=ps.availablequantity THEN 'Possible' ELSE 'Not-Possible' END status, 
	CASE
        WHEN bypass_qty >= requestquantity THEN 'Completed'
        WHEN availablequantity = 0 AND outward_status IS NULL THEN 'SAP NA'
        WHEN outward_status IS NULL THEN 'Yet To Start'
        WHEN outward_status NOT IN ('Completed','Partial') AND (po.confirm_qty + bypass_qty >= requestquantity AND bypass_qty IS NOT NULL) THEN 'Completed'
        WHEN outward_status NOT IN ('Completed','Partial') AND (po.confirm_qty + bypass_qty > 0 OR po.confirm_qty + bypass_qty = 0) THEN 'In-Progress'
        WHEN availablequantity = 0 AND ((outward_status = 'Completed' AND po.confirm_qty < requestquantity) OR outward_status = 'Partial') THEN 'Partially Completed (No SAP)'
        WHEN (outward_status = 'Completed' AND po.confirm_qty + bypass_qty < requestquantity) OR outward_status = 'Partial' THEN 'Partially Completed'
        WHEN outward_status = 'Completed' OR (planned_requested_qty >= requestquantity AND bypass_qty IS NOT NULL) THEN 'Completed'
        ELSE 'NA'
    END AS plan_status,
	ISNULL(po.confirm_qty,0)+ISNULL(pc.bypass_qty,0) confirm_qty,
	GREATEST(CASE 
		WHEN po.outward_status IS NULL THEN pc.requestquantity-ISNULL(pc.bypass_qty,0) 
		WHEN po.outward_status NOT IN('Completed','Partial') AND (ISNULL(po.confirm_qty,0)>0 OR ISNULL(po.confirm_qty,0)=0) THEN pc.requestquantity-(po.confirm_qty+ISNULL(pc.bypass_qty,0))
		WHEN (po.outward_status='Completed' AND po.confirm_qty<pc.requestquantity) OR po.outward_status='Partial' THEN pc.requestquantity-(po.confirm_qty +ISNULL(pc.bypass_qty,0))
		ELSE  0
	END,0) pending_qty,
	ISNULL(pc.wh_remarks,'') wh_remarks,
	ISNULL(pc.mpm_remarks,'') mpm_remarks,
	ISNULL(pc.scm_remarks,'') scm_remarks, 
	TRIM(u.firstname +' '+u.lastname) createdby, 
	ISNULL(u.profile,'') createdbyprofile, 
	u.empcode AS createdbyempcode, 
	r.rolename AS createdbyrole, 
	CONVERT(VARCHAR(19),pc.createddate,29) AS createddate,
	pc.status req_status, 
	TRIM(bu.firstname +' ' +bu.lastname) bypass_by,
	CONVERT(VARCHAR(19),pc.bypass_date,29) bypass_date

FROM planning_cmlist AS pc 
LEFT JOIN planning_sapstocklist AS ps on ps.material=pc.component 
INNER JOIN ms_supplier AS sp ON sp.id=pc.supplierid 
LEFT JOIN ms_user AS bu ON bu.id=pc.bypass_by 
LEFT JOIN ms_role AS br ON br.id=bu.roleid
LEFT JOIN ms_type AS t ON t.id=pc.typeid 
LEFT JOIN (
    SELECT 
        cm_refid,
        CASE 
            WHEN MIN(status) >= 13 AND MIN(status) NOT IN(777) AND MAX(status) NOT IN(777) THEN 'Completed'  
            WHEN MAX(status)>=13 AND MAX(status) NOT IN(777) THEN 'Partial'
            WHEN MIN(status) <= 12 THEN 'In-Progress' 
            ELSE 'NA' 
        END AS outward_status,
		SUM(CASE WHEN status>=13 THEN confirm_qty ELSE 0 END) AS confirm_qty 
    FROM planning_outward
    WHERE del_status = 0 AND status NOT IN(77)
    GROUP BY cm_refid
) AS po ON po.cm_refid = pc.id

INNER JOIN ms_user AS u ON u.id=pc.createdby 
INNER JOIN ms_role AS r ON r.id=u.roleid WHERE pc.del_status=0 

AND (
	CONCAT('TP', FORMAT(pc.id, '00000')) LIKE @search OR 
	t.[type] LIKE @search OR 
	pc.component LIKE @search OR 
	pc.modelname LIKE @search OR 
	sp.suppliername LIKE @search OR 
	pc.po LIKE @search OR 
	pc.[description] LIKE @search OR 
	pc.requestquantity LIKE @search OR 
	ps.availablequantity LIKE @search OR 
	CASE 
		WHEN pc.requestquantity>=ps.availablequantity THEN 'Possible' 
		ELSE 'Not-Possible' 
	END LIKE @search OR 
	CASE   
		WHEN ISNULL(ps.availablequantity,0) = 0 AND po.outward_status IS NULL THEN 'SAP NA'
		WHEN po.outward_status IS NULL THEN 'Yet To Start'
		WHEN po.outward_status NOT IN('Completed','Partial') AND (ISNULL(po.confirm_qty,0)+ISNULL(pc.bypass_qty,0)>=pc.requestquantity AND pc.bypass_qty IS NOT NULL) THEN 'Completed'
		WHEN po.outward_status NOT IN('Completed','Partial') AND (ISNULL(po.confirm_qty,0)+ISNULL(pc.bypass_qty,0)>0 OR ISNULL(po.confirm_qty,0)+ISNULL(pc.bypass_qty,0)=0) THEN 'In-Progress' 
		WHEN ISNULL(ps.availablequantity,0) = 0 AND ((po.outward_status='Completed' AND po.confirm_qty<pc.requestquantity) OR po.outward_status='Partial') THEN 'Partially Completed (No SAP)'
		WHEN (po.outward_status='Completed' AND po.confirm_qty+ISNULL(pc.bypass_qty,0)<pc.requestquantity) OR po.outward_status='Partial' THEN 'Partially Completed'
		WHEN po.outward_status='Completed' OR ISNULL(pc.planned_requested_qty,0)>=pc.requestquantity AND pc.bypass_qty IS NOT NULL THEN 'Completed'  
		ELSE 'NA'
	END LIKE @search OR 
	TRIM(u.firstname +' '+u.lastname) LIKE @search OR 
	u.empcode LIKE @search OR 
	r.rolename LIKE @search OR 
	CONVERT(VARCHAR(19),pc.createddate,29) LIKE @search OR 
	pc.priority LIKE @search 
) 
ORDER BY pc.id DESC`,

	planning_sapstocklist: `SELECT id,plant,upper(material) material,description,storagelocation,unitprice,IIF(availablequantity<0,0,availablequantity) availablequantity,CONVERT(VARCHAR,createddate,29) stockon FROM planning_sapstocklist WHERE (plant LIKE @search OR material LIKE @search OR [description] LIKE @search OR storagelocation LIKE @search OR unitprice LIKE @search OR IIF(availablequantity<0,0,availablequantity) LIKE @search) ORDER BY id DESC`,

	cm_delivery_plan_new: `SELECT cm.id,sap.id sap_id,cm.po,t.[type],CONCAT('TP', FORMAT(cm.id, '00000')) AS orderno,cm.modelname,cm.priority, upper(trim(cm.component)) as req_tpn, isnull(cm.requestquantity,0)-isnull(cm.planned_requested_qty,0) as req_qty, IIF(ISNULL(sap.availablequantity, 0) < 0, 0, ISNULL(sap.availablequantity, 0)) AS sap_qty, case when isnull(sap.availablequantity,0)>0 then 'Matched' else 'Not-Matched' end req_vs_sap, sum(isnull(inv.quantity,0)) as physical_qty, case when isnull(cm.requestquantity,0)<=sum(isnull(inv.quantity,0)) then 'Matched' else 'Not-Matched' end req_vs_physical, convert(varchar(10),cm.createddate,29) as req_date, datediff(dd,convert(date,getdate()),convert(date,cm.createddate)) as due_days, stuff((select distinct ' | '+ upper(l.location) from ops_inventory_new AS i INNER JOIN ms_location AS l ON l.id=i.locationid where tpn=cm.component AND i.del_status=0 and quantity>0 for xml path('')),1,2,'') AS avail_loc FROM planning_cmlist as cm INNER JOIN ms_supplier AS sp ON sp.id=cm.supplierid left join planning_sapstocklist as sap on sap.material=cm.component LEFT JOIN ms_type AS t ON t.id=cm.typeid left join ops_inventory_new as inv on inv.tpn=cm.component and inv.del_status=0 and inv.quantity>0 where cm.del_status=0 AND isnull(cm.requestquantity,0)-isnull(cm.planned_requested_qty,0)>0 and sp.id=@vendor AND (CONCAT('TP', FORMAT(cm.id, '00000')) LIKE @search OR cm.modelname LIKE @search OR cm.po LIKE @search OR upper(trim(cm.component)) LIKE @search OR isnull(cm.requestquantity,0)-isnull(cm.planned_requested_qty,0) LIKE @search OR IIF(ISNULL(sap.availablequantity, 0) < 0, 0, ISNULL(sap.availablequantity, 0)) LIKE @search) group by inv.tpn,cm.component,isnull(cm.requestquantity,0),isnull(cm.planned_requested_qty,0),sap.availablequantity,sap.material,cm.createddate,cm.id,sap.id,cm.priority,cm.po,t.[type],cm.modelname ORDER BY cm.id DESC`,

	cmvssap: `select cm.id, upper(trim(cm.component)) as req_tpn,sp.suppliername vendor, isnull(cm.requestquantity,0) as req_qty, isnull(sap.availablequantity,0) as sap_qty, case when isnull(cm.requestquantity,0)<=isnull(sap.availablequantity,0) then 'Matched' else 'Not-Matched' end req_vs_sap, sum(isnull(inv.quantity,0)) as physical_qty, case when isnull(cm.requestquantity,0)<=sum(isnull(inv.quantity,0)) then 'Matched' else 'Not-Matched' end req_vs_physical, convert(varchar(10),cm.createddate,29) as req_date, datediff(dd,convert(date,getdate()),convert(date,cm.createddate)) as due_days, stuff((select distinct ' | '+ upper(location) from ops_inventory where tpn=cm.component and tpn=sap.material AND del_status=0 and quantity>0 for xml path('')),1,2,'') AS avail_loc from planning_cmlist as cm INNER JOIN ms_supplier AS sp ON sp.id=cm.supplierid inner join planning_sapstocklist as sap on sap.material=cm.component inner join ops_inventory as inv on inv.tpn=cm.component and inv.tpn=sap.material where cm.del_status=0 AND cm.status=1 and (upper(trim(cm.component)) like @search or sp.suppliername like @search or isnull(cm.requestquantity,0) like @search or isnull(sap.availablequantity,0) like @search or datediff(dd,convert(date,getdate()),convert(date,cm.createddate)) like @search or stuff((select distinct ' | '+ upper(location) from ops_inventory where tpn=cm.component and tpn=sap.material and quantity>0 for xml path('')),1,2,'') like @search) group by inv.tpn,cm.component,cm.vendor,cm.requestquantity,sap.availablequantity,sap.material,cm.createddate,cm.id,cm.priority,sp.suppliername ORDER BY cm.createddate,cm.priority asc`,

	picklist_generation: `
	${CTEQueries.picklist_generation}
	SELECT
	pd.planno AS id, 
	pd.po, 
	pd.planno,
	pd.cm_refid,
	pd.orderno,
	t.[type],
	cm.modelname,
	pd.tpn,
	pd.supplierid,
	sp.suppliername vendor, 
	pd.printcount, 
	pd.status,
	CASE WHEN pd.status=6 THEN 'FQA Pending' WHEN pd.status=777 THEN 'FQA Hold' ELSE 'Processin in Other stage' END fqa_status,
	pd.req_qty AS pick_qty,
	pd.totalqty,
	pd.confirm_qty, 
	pd.holdremarks,
	pd.fqa_reject_remarks,
	pd.sto_number,
	pd.physical_type,
	pd.grn_number,
	pd.obd_number,
	pd.sto_invoice, 
	pd.eway_billno,
	pd.eway_bill_upload,
	pd.truck_number,
	pd.weight_and_volume,
	pd.noOfPallet, 
	pd.invoicenumber,
	pd.uploadinvoice,   
	pd.lr_number,   
	pd.driver_name,
	pd.driver_mobile,
	pd.transporter_name,

	assigner.full_name AS assigned_by,
	picker.full_name AS pick_by,
	denomination.full_name AS denomination_by,
	box.full_name AS box_by,
	label.full_name AS label_by,
	pre_ins.full_name AS pre_ins_by,
	fqa.full_name AS fqa_by,
	dispatch.full_name AS dispatch_by, 
	firstobduser.full_name AS first_obd_by,
	obduser.full_name AS obd_by,
	firstlogisticsuser.full_name AS first_logistics_by, 
	logisticsuser.full_name AS logistics_by, 
	out_docs_user.full_name AS outward_docs_by,
	eway_user.full_name AS eway_by, 
	shipuser.full_name AS ship_by, 
	ackuser.full_name AS ack_by, 

	assigner.empcode AS assigned_byempcode,
	picker.empcode AS pick_byempcode,
	denomination.empcode AS denomination_byempcode,
	box.empcode AS box_byempcode,
	label.empcode AS label_byempcode,
	pre_ins.empcode AS pre_ins_byempcode,
	fqa.empcode AS fqa_byempcode,
	dispatch.empcode AS dispatch_byempcode,
	firstobduser.empcode AS first_obd_byempcode, 
	obduser.empcode AS obd_byempcode, 
	firstlogisticsuser.empcode AS first_logistics_byempcode,
	logisticsuser.empcode AS logistics_byempcode,
	out_docs_user.empcode AS outward_docs_byempcode,
	eway_user.empcode AS eway_byempcode,
	shipuser.empcode AS ship_byempcode, 
	ackuser.empcode AS ack_byempcode, 

	assigner.rolename AS assigned_byrole, 
	picker.rolename AS pick_byrole,
	denomination.rolename AS denomination_byrole,
	box.rolename AS box_byrole,
	label.rolename AS label_byrole,
	pre_ins.rolename AS pre_ins_byrole,
	fqa.rolename AS fqa_byrole,
	dispatch.rolename AS dispatch_byrole, 
	firstobduser.rolename AS first_obd_byrole, 
	obduser.rolename AS obd_byrole, 
	firstlogisticsuser.rolename AS first_logistics_byrole, 
	logisticsuser.rolename AS logistics_byrole, 
	out_docs_user.rolename AS outward_docs_byrole, 
	eway_user.rolename AS eway_byrole,
	shipuser.rolename AS ship_byrole,
	ackuser.rolename AS ack_byrole,

	assigner.profile AS assigned_byprofile,
	picker.profile AS pick_byprofile, 
	denomination.profile AS denomination_byprofile,
	box.profile AS box_byprofile,
	label.profile AS label_byprofile,
	pre_ins.profile AS pre_ins_byprofile,
	fqa.profile AS fqa_byprofile,
	dispatch.profile AS dispatch_byprofile, 
	firstobduser.profile AS first_obd_byprofile, 
	obduser.profile AS obd_byprofile, 
	firstlogisticsuser.profile AS first_logistics_byprofile,
	logisticsuser.profile AS logistics_byprofile,
	out_docs_user.profile AS outward_docs_byprofile, 
	eway_user.profile AS eway_byprofile,
	shipuser.profile AS ship_byprofile,
	ackuser.profile AS ack_byprofile,
	
	pd.first_printdate,
	pd.assigned_date,
	pd.pick_date, 
	pd.denomination_date, 
	pd.box_date, 
	pd.labeldone_date, 
	pd.pre_inspect_date, 
	pd.fqa_date,  
	pd.dispatch_date, 
	pd.first_obd_date,
	pd.obd_date,
	pd.first_logistics_date,
	pd.logistics_date,
	pd.outward_docs_date,
	pd.eway_bill_date,
	pd.ship_date,
	pd.ack_date 

	FROM PlanningDetails AS pd
	${CTEJoinAndWhereQueries.picklist_generation} ORDER BY pd.idd DESC`,

	picking_denomination: `SELECT d.planno AS id,d.planno,d.po,upper(d.tpn) tpn,d.planned_requested_qty pick_qty,sp.suppliername vendor, u.firstname + ' ' + u.lastname AS pick_by, u1.firstname + ' ' + u1.lastname AS assigned_by, r.rolename AS pick_byrole, r1.rolename AS assigned_byrole,u.empcode AS pick_byempcode, u1.empcode AS assigned_byempcode, CONVERT(VARCHAR(10), d.pick_date, 29) AS pick_date, CONVERT(VARCHAR(19), d.assigned_on, 29) AS assigned_date, ISNULL(u.profile, '') AS pick_byprofile, ISNULL(u1.profile, '') AS assigned_byprofile FROM planning_outward AS d INNER JOIN ms_supplier AS sp ON sp.id=d.supplierid INNER JOIN ms_user AS u ON u.id = d.pick_by INNER JOIN ms_user AS u1 ON u1.id = d.assigned_by INNER JOIN ms_role AS r ON r.id = u.roleid INNER JOIN ms_role AS r1 ON r1.id = u1.roleid WHERE d.del_status=0 AND d.status = 1 and d.planno LIKE @planno and d.pick_by=CASE WHEN @role='Admin' THEN d.pick_by ELSE @pickby END ORDER BY d.id DESC`,

	qa_confirmation: `SELECT d.po,d.planno,upper(d.tpn) tpn,sp.suppliername vendor, d.planned_requested_qty AS req_qty,d.totalqty, u.firstname + ' ' + u.lastname AS pick_by, u1.firstname + ' ' + u1.lastname AS assigned_by, r.rolename AS pick_byrole, r1.rolename AS assigned_byrole, u.empcode AS pick_byempcode, u1.empcode AS assigned_byempcode, CONVERT(VARCHAR(10), d.pick_date, 29) AS pick_date, CONVERT(VARCHAR(19), d.assigned_on, 29) AS assigned_date, ISNULL(u.profile, '') AS pick_byprofile, ISNULL(u1.profile, '') AS assigned_byprofile FROM planning_outward AS d INNER JOIN ms_supplier AS sp ON sp.id=d.supplierid INNER JOIN ms_user AS u ON u.id = d.pick_by INNER JOIN ms_user AS u1 ON u1.id = d.assigned_by INNER JOIN ms_role AS r ON r.id = u.roleid INNER JOIN ms_role AS r1 ON r1.id = u1.roleid WHERE d.del_status=0 AND d.status = 2 AND d.planno LIKE @planno ORDER BY d.pick_date`,

	// quarantinereport: `SELECT pos.id,d.po,d.planno,sp.suppliername vendor,pos.serialno,upper(d.tpn) tpn,d.planned_requested_qty,(select sum(confirm_qty) from planning_outward_splitup where outward_id=pos.outward_id) confirm_qty,pos.rejection_qty, u.firstname + ' ' + u.lastname AS rejected_by, u.empcode AS rejected_byempcode, r.rolename AS rejected_byrole, isnull(u.profile,'') AS rejected_byprofile, convert(varchar,pos.qaconfirmed_date,29) rejected_date FROM planning_outward_splitup AS pos INNER JOIN planning_outward AS d ON d.id=pos.outward_id INNER JOIN ms_supplier AS sp ON sp.id=d.supplierid INNER JOIN ms_user AS u ON u.id = pos.qaconfirmed_by INNER JOIN ms_role AS r ON r.id = u.roleid WHERE d.del_status=0 AND isnull(pos.rejection_qty,0)>0 AND (d.po LIKE @search OR d.planno LIKE @search OR sp.suppliername LIKE @search OR pos.serialno LIKE @search OR upper(d.tpn) LIKE @search OR d.planned_requested_qty LIKE @search OR pos.confirm_qty LIKE @search OR pos.rejection_qty LIKE @search OR u.firstname + ' ' + u.lastname LIKE @search OR u.empcode LIKE @search OR r.rolename LIKE @search OR convert(varchar,pos.qaconfirmed_date,29) LIKE @search) ORDER BY pos.qaconfirmed_date ASC`,

	fqa_rejection: `
	SELECT 
	'AUDITLBL' AS Type,
	t.[type] typename,
	cm.modelname,
	CONCAT('TP', FORMAT(cm.id, '00000')) AS orderno,
	ins.id,
	ins.box_label_id,
	CONCAT('LBL',COALESCE(
				CAST(ins.grn_label_id AS NVARCHAR),
				ins.grn_label_split_id
	)) AS reel_id,
	ins.planno,
	ins.tpn,
	ins.quantity,
	u.firstname+' '+u.lastname AS rejected_by,
	u.empcode AS rejected_byempcode,
	u.profile AS rejected_by_profile,
	r.rolename AS rejected_byrole,
	CONVERT(VARCHAR(19),ins.rejected_date,29) AS rejected_date,
	ins.fqa_remarks,
	ins.quarantine_doc_no
FROM ops_inventory_wall_to_wall_new_splitup AS ins
INNER JOIN planning_outward AS po ON po.planno=ins.planno
INNER JOIN planning_cmlist AS cm ON cm.id=po.cm_refid
LEFT JOIN ms_type AS t ON t.id=cm.typeid 
INNER JOIN ms_user AS u ON u.id=ins.rejected_by
INNER JOIN ms_role AS r ON r.id=u.roleid
WHERE ins.fqa_status=2 AND ins.del_status=0 
	AND (
	(@quarantine_doc_no='NULL' AND ins.quarantine_doc_no IS NULL) OR 
	(@quarantine_doc_no IS NULL AND ins.quarantine_doc_no IS NOT NULL)
	) 
	AND (
		ins.box_label_id LIKE @search OR 
			CONCAT('LBL',COALESCE(
					CAST(ins.grn_label_id AS NVARCHAR),
					ins.grn_label_split_id
		)) LIKE @search OR 
		CONCAT('TP', FORMAT(cm.id, '00000')) LIKE @search OR 
		ins.planno LIKE @search OR 
		ins.tpn LIKE @search OR 
		ins.quantity LIKE @search OR 
		u.firstname+' '+u.lastname LIKE @search OR 
		u.empcode LIKE @search OR 
		CONVERT(VARCHAR(19),ins.rejected_date,29) LIKE @search OR 
		cm.modelname LIKE @search OR t.[type] LIKE @search
	)
                
UNION ALL

SELECT 
	'GRNLBL' AS Type,
	t.[type] typename,
	cm.modelname,
	CONCAT('TP', FORMAT(cm.id, '00000')) AS orderno,
	ins.id,
	ins.box_label_id,
	CONCAT('GRNLBL',COALESCE(
				CAST(ins.grn_label_id AS NVARCHAR),
				ins.grn_label_split_id
	)) AS reel_id,
	ins.planno,
	ins.tpn,
	ins.quantity,
	u.firstname+' '+u.lastname AS rejected_by,
	u.empcode AS rejected_byempcode,
	u.profile AS rejected_by_profile,
	r.rolename AS rejected_byrole,
	CONVERT(VARCHAR(19),ins.rejected_date,29) AS rejected_date,
	ins.fqa_remarks,
	ins.quarantine_doc_no
FROM ops_inventory_new_splitup AS ins
INNER JOIN planning_outward AS po ON po.planno=ins.planno
INNER JOIN planning_cmlist AS cm ON cm.id=po.cm_refid
LEFT JOIN ms_type AS t ON t.id=cm.typeid  
INNER JOIN ms_user AS u ON u.id=ins.rejected_by
INNER JOIN ms_role AS r ON r.id=u.roleid
WHERE ins.fqa_status=2 AND ins.del_status=0 
	AND (
		(@quarantine_doc_no='NULL' AND ins.quarantine_doc_no IS NULL) OR 
		(@quarantine_doc_no IS NULL AND ins.quarantine_doc_no IS NOT NULL)
		) 
		AND (
		ins.box_label_id LIKE @search OR 
		CONCAT('GRNLBL',COALESCE(
						CAST(ins.grn_label_id AS NVARCHAR),
						ins.grn_label_split_id
			)) LIKE @search OR 
		CONCAT('TP', FORMAT(cm.id, '00000')) LIKE @search OR 
		ins.planno LIKE @search OR 
		ins.tpn LIKE @search OR 
		ins.quantity LIKE @search OR 
		u.firstname+' '+u.lastname LIKE @search OR 
		u.empcode LIKE @search OR 
		CONVERT(VARCHAR(19),ins.rejected_date,29) LIKE @search OR 
		cm.modelname LIKE @search OR 
		t.[type] LIKE @search
		) 
ORDER BY id DESC
	`,

	splitup_report: `select cm.id, isnull(trim(d.planno),'') as planno, isnull(trim(cm.component),'') as tpn, s.suppliername as vendor, isnull(trim(cm.po),'') as po, isnull(ltrim(rtrim((d.planned_requested_qty))),0) as req_qty,d.totalqty, isnull(sum(sp.confirm_qty),0) as confirm_qty,  CASE WHEN d.status>=6 THEN isnull(sum(sp.confirm_qty),0) ELSE '' END dispatch_qty, trim(isnull(trim(picker.firstname),'')+' '+isnull(trim(picker.lastname),'')) as picked_by, isnull(trim(picker.empcode),'') as picked_byempcode, isnull(trim(picker.profile),'') as picked_byprofile, isnull(trim(pickerrole.rolename),'') as picked_byrole, isnull(convert(varchar(19),sp.picked_on,29),'') as picked_date, trim(isnull(trim(assigner.firstname),'')+' '+isnull(trim(assigner.lastname),'')) as assigned_by, isnull(trim(assigner.empcode),'') as assigned_byempcode, isnull(trim(assigner.profile),'') as assigned_byprofile, isnull(trim(assignerrole.rolename),'') as
    assigned_byrole, isnull(convert(varchar(19),d.assigned_on,29) ,'') as assigned_date, 
	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, assigned_on, picked_on) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, assigned_on, picked_on) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, assigned_on, picked_on) % 60), 2),'') AS pick_tat, 
	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, picked_on, qadate) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, picked_on, qadate) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, picked_on, qadate) % 60), 2),'') AS iqc_tat, ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, qadate, outward_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, qadate, outward_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, qadate, outward_date) % 60), 2),'') AS outward_tat, trim(isnull(qa.firstname+' '+qa.lastname,'')) as qa_by, isnull(qa.empcode,'') as qa_byempcode, isnull(qa.profile,'') as qa_byprofile, isnull(qarole.rolename,'') as qa_byrole,isnull(convert(varchar(19),d.qadate,29),'')  as qa_date, trim(isnull(u.firstname+' '+u.lastname,'')) as outward_by, isnull(u.empcode,'') as outward_byempcode, isnull(u.profile,'') as outward_byprofile, isnull(r.rolename,'') as outward_byrole,isnull(convert(varchar(19),d.outward_date,29),'') as outward_date, case when d.status = 1 then 'Yet to Start' when d.status = 2 then 'Picking Done' when d.status = 3 then 'QA Confirmed' when d.status = 4 then 'Outward Done' when d.status = 5 then 'OBD Docs Done' when d.status = 6 then 'Logistics Done' when d.status = 7 then 'Outward Docs Done' when d.status = 8 then 'E-Way Bill Done' when d.status = 9 then 'Ship Out Done' when d.status = 10 then 'Acknowledged Done' else 'Pending' end as status,  
	
	trim(upu.firstname +' '+upu.lastname) createdby, 
	isnull(upu.profile,'') createdbyprofile, 
	upu.empcode AS createdbyempcode, 
	upr.rolename AS createdbyrole, 
	CONVERT(VARCHAR(19),cm.createddate,29) AS createddate ,
	
	
	
	ISNULL(trim(ou.firstname + ' ' + ou.lastname), '') AS obd_by, 
	ISNULL(orr.rolename, '') AS obd_byrole, ou.empcode AS obd_byempcode, 
	ISNULL(ou.profile, '') AS obd_byprofile, 
	ISNULL(CONVERT(VARCHAR(19), d.obd_date, 29), '') AS obd_date,


	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.outward_date, d.obd_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.outward_date, d.obd_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.outward_date, d.obd_date) % 60), 2),'') AS obd_tat,

	ISNULL(trim(ldu.firstname + ' ' + ldu.lastname), '') AS logistics_by, 
	ISNULL(ldr.rolename, '') AS logistics_byrole, ldu.empcode AS logistics_byempcode, 
	ISNULL(ldu.profile, '') AS logistics_byprofile, 
	ISNULL(CONVERT(VARCHAR(19), d.logistics_date, 29), '') AS logistics_date,

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.obd_date, d.logistics_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.obd_date, d.logistics_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.obd_date, d.logistics_date) % 60), 2),'') AS logistics_tat,

	ISNULL(trim(odu.firstname + ' ' + odu.lastname),'') AS outward_docs_by, 
	ISNULL(odr.rolename,'') AS outward_docs_byrole, 
	ISNULL(odu.empcode,'') AS outward_docs_byempcode, 
	ISNULL(odu.profile, '') AS outward_docs_byprofile, 
	ISNULL(CONVERT(VARCHAR(19), d.outward_docs_date, 29),'') AS outward_docs_date,
	

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.logistics_date, d.outward_docs_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.logistics_date, d.outward_docs_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.logistics_date, d.outward_docs_date) % 60), 2),'') AS outward_docs_tat,

	ISNULL(trim(ewu.firstname + ' ' + ewu.lastname),'') AS eway_by, 
	ISNULL(ewr.rolename,'') AS eway_byrole,
	ISNULL(ewu.empcode,'') AS eway_byempcode, 
	ISNULL(ewu.profile, '') AS eway_byprofile, 
	ISNULL(CONVERT(VARCHAR(19), d.eway_bill_date, 29),'') AS eway_bill_date,

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.outward_docs_date, d.eway_bill_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.outward_docs_date, d.eway_bill_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.outward_docs_date, d.eway_bill_date) % 60), 2),'') AS eway_bill_tat,

	ISNULL(trim(spu.firstname + ' ' + spu.lastname),'') AS ship_by, 
	ISNULL(spr.rolename,'') AS ship_byrole, 
	ISNULL(spu.empcode,'') AS ship_byempcode, 
	ISNULL(spu.profile, '') AS ship_byprofile, 
	ISNULL(CONVERT(VARCHAR(19), d.ship_date, 29),'') AS ship_date,

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.eway_bill_date, d.ship_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.eway_bill_date, d.ship_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.eway_bill_date, d.ship_date) % 60), 2),'') AS ship_tat,

	ISNULL(trim(acku.firstname + ' ' + acku.lastname),'') AS ack_by, 
	ISNULL(ackr.rolename,'') AS ack_byrole, 
	ISNULL(acku.empcode,'') AS ack_byempcode, 
	ISNULL(acku.profile, '') AS ack_byprofile, 
	ISNULL(CONVERT(VARCHAR(19), d.ack_date, 29),'') AS ack_date,

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.ship_date, d.ack_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.ship_date, d.ack_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.ship_date, d.ack_date) % 60), 2),'') AS ack_tat

	FROM planning_cmlist as cm 
	RIGHT JOIN planning_outward as d on cm.id=d.cm_refid
	INNER JOIN ms_supplier AS s ON s.id=d.supplierid
	LEFT JOIN planning_outward_splitup as sp on sp.cm_refid=d.cm_refid and d.cm_refid=cm.id AND sp.outward_id=d.id 
	LEFT JOIN ms_user as picker on picker.id=d.pick_by 
	LEFT JOIN ms_role as pickerrole on pickerrole.id=picker.roleid 
	LEFT JOIN ms_user as assigner on assigner.id=d.assigned_by 
	LEFT JOIN ms_role as assignerrole on assignerrole.id=assigner.roleid 
	LEFT JOIN ms_user as qa on qa.id=d.qaby 
	LEFT JOIN ms_role as qarole on qarole.id=qa.roleid 
	
	LEFT JOIN ms_user as u on u.id=d.outward_by 
	
	LEFT JOIN ms_role as r on r.id=u.roleid 

	LEFT JOIN ms_user as upu on upu.id=cm.createdby 
	LEFT JOIN ms_role as upr on upr.id=upu.roleid 

	LEFT JOIN ms_user AS ou ON ou.id = d.obd_by 
	LEFT JOIN ms_role AS orr ON orr.id = ou.roleid
	
	LEFT JOIN ms_user AS ldu ON ldu.id = d.logistics_by 
	LEFT JOIN ms_role AS ldr ON ldr.id = ldu.roleid

	LEFT JOIN ms_user AS odu ON odu.id = d.outward_docs_by 
	LEFT JOIN ms_role AS odr ON odr.id = odu.roleid 

	LEFT JOIN ms_user AS ewu ON ewu.id = d.eway_bill_by 
	LEFT JOIN ms_role AS ewr ON ewr.id = ewu.roleid 

	LEFT JOIN ms_user AS spu ON spu.id = d.ship_by 
	LEFT JOIN ms_role AS spr ON spr.id = spu.roleid

	LEFT JOIN ms_user AS acku ON acku.id = d.ack_by 
	LEFT JOIN ms_role AS ackr ON ackr.id = acku.roleid

	WHERE d.del_status=0 AND cm.del_status=0 AND d.planno LIKE @search OR s.suppliername LIKE @search OR cm.component LIKE @search OR cm.po LIKE @search OR req_qty  LIKE @search OR sp.confirm_qty  LIKE @search OR picked_by LIKE @search OR picker.empcode LIKE @search OR pickerrole.rolename LIKE @search OR isnull(convert(varchar(19),sp.picked_on,29),'') LIKE @search OR assigned_by LIKE @search OR isnull(trim(assigner.empcode),'') LIKE @search OR isnull(trim(assignerrole.rolename),'') LIKE @search OR trim(isnull(qa.firstname+' '+qa.lastname,'')) LIKE @search OR isnull(qa.empcode,'') LIKE @search OR isnull(qarole.rolename,'') LIKE @search OR outward_by LIKE @search OR isnull(u.empcode,'') LIKE @search OR isnull(r.rolename,'') LIKE @search OR outward_date LIKE @search OR case when cm.status = 1 then 'Yet to Start' when cm.status = 2 then 'Picking Done' when cm.status = 3 then 'QA Confirmed' when cm.status = 4 then 'Outward Done' else 'Error' end LIKE @search OR trim(upu.firstname +' '+upu.lastname) LIKE @search OR upu.empcode LIKE @search OR upr.rolename LIKE @search OR CONVERT(VARCHAR(19),cm.createddate,29) LIKE @search

	group by cm.id, isnull(trim(d.planno),''), isnull(trim(cm.component),''), s.suppliername, isnull(trim(cm.po),''),isnull(ltrim(rtrim((d.planned_requested_qty))),0),d.totalqty,cm.status,d.status, trim(isnull(trim(picker.firstname),'')+' '+isnull(trim(picker.lastname),'')), isnull(trim(picker.empcode),''),isnull(trim(picker.profile),''),isnull(trim(pickerrole.rolename),''),convert(varchar(19),sp.picked_on,29), trim(isnull(trim(assigner.firstname),'')+' '+isnull(trim(assigner.lastname),'')), isnull(trim(assigner.empcode),''), isnull(trim(assigner.profile),''), isnull(trim(assignerrole.rolename),''), isnull(convert(varchar(19),d.assigned_on,29) ,''), ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, assigned_on, picked_on) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, assigned_on, picked_on) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, assigned_on, picked_on) % 60), 2),''), ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, picked_on, qadate) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, picked_on, qadate) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, picked_on, qadate) % 60), 2),'') , ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, qadate, outward_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, qadate, outward_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, qadate, outward_date) % 60), 2),'') , trim(isnull(qa.firstname+' '+qa.lastname,'')) , isnull(qa.empcode,''), isnull(qa.profile,''), isnull(qarole.rolename,''), isnull(convert(varchar(19),d.qadate,29),''), trim(isnull(u.firstname+' '+u.lastname,'')) , isnull(u.empcode,'') , isnull(u.profile,'') , isnull(r.rolename,'') , isnull(convert(varchar(19),d.outward_date,29),''), case when d.status = 1 then 'Yet to Start' when d.status = 2 then 'Picking Done' when d.status = 3 then 'QA Confirmed' when d.status = 4 then 'Outward Done' when d.status = 5 then 'OBD Docs Done' when d.status = 6 then 'Logistics Done' when d.status = 7 then 'Outward Docs Done' when d.status = 8 then 'E-Way Bill Done' when d.status = 9 then 'Ship Out Done' when d.status = 10 then 'Acknowledged Done' else 'Pending' end,trim(upu.firstname +' '+upu.lastname), isnull(upu.profile,''), upu.empcode, upr.rolename, CONVERT(VARCHAR(19),cm.createddate,29),CAST(RIGHT(d.planno, LEN(d.planno) - 14) AS INT),
	
	ISNULL(trim(ou.firstname + ' ' + ou.lastname), ''), 
	ISNULL(orr.rolename, ''), ou.empcode, 
	ISNULL(ou.profile, ''), 
	ISNULL(CONVERT(VARCHAR(19), d.obd_date, 29), ''),


	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.outward_date, d.obd_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.outward_date, d.obd_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.outward_date, d.obd_date) % 60), 2),''),

	ISNULL(trim(ldu.firstname + ' ' + ldu.lastname), ''), 
	ISNULL(ldr.rolename, ''), ldu.empcode, 
	ISNULL(ldu.profile, ''), 
	ISNULL(CONVERT(VARCHAR(19), d.logistics_date, 29), ''),

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.obd_date, d.logistics_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.obd_date, d.logistics_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.obd_date, d.logistics_date) % 60), 2),''),

	ISNULL(trim(odu.firstname + ' ' + odu.lastname),''), 
	ISNULL(odr.rolename,''), 
	ISNULL(odu.empcode,''), 
	ISNULL(odu.profile, ''), 
	ISNULL(CONVERT(VARCHAR(19), d.outward_docs_date, 29),''),
	

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.logistics_date, d.outward_docs_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.logistics_date, d.outward_docs_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.logistics_date, d.outward_docs_date) % 60), 2),''),

	ISNULL(trim(ewu.firstname + ' ' + ewu.lastname),''), 
	ISNULL(ewr.rolename,''),
	ISNULL(ewu.empcode,''), 
	ISNULL(ewu.profile, ''), 
	ISNULL(CONVERT(VARCHAR(19), d.eway_bill_date, 29),''),

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.outward_docs_date, d.eway_bill_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.outward_docs_date, d.eway_bill_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.outward_docs_date, d.eway_bill_date) % 60), 2),''),

	ISNULL(trim(spu.firstname + ' ' + spu.lastname),'') , 
	ISNULL(spr.rolename,''), 
	ISNULL(spu.empcode,''), 
	ISNULL(spu.profile, ''), 
	ISNULL(CONVERT(VARCHAR(19), d.ship_date, 29),''),

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.outward_docs_date, d.eway_bill_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.outward_docs_date, d.eway_bill_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.outward_docs_date, d.eway_bill_date) % 60), 2),''),

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.eway_bill_date, d.ship_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.eway_bill_date, d.ship_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.eway_bill_date, d.ship_date) % 60), 2),''),

	ISNULL(trim(acku.firstname + ' ' + acku.lastname),''), 
	ISNULL(ackr.rolename,''), 
	ISNULL(acku.empcode,''), 
	ISNULL(acku.profile, ''), 
	ISNULL(CONVERT(VARCHAR(19), d.ack_date, 29),''),

	ISNULL(CONVERT(VARCHAR, (DATEDIFF(SECOND, d.ship_date, d.ack_date) / 3600)) + ':' + RIGHT('0' + CONVERT(VARCHAR, (DATEDIFF(SECOND, d.ship_date, d.ack_date) % 3600) / 60), 2) + ':' + RIGHT('0' + CONVERT(VARCHAR, DATEDIFF(SECOND, d.ship_date, d.ack_date) % 60), 2),'')
	
	ORDER BY CAST(RIGHT(d.planno, LEN(d.planno) - 14) AS INT) ASC`,

	detailed_report: `${CTEQueries.detailed_report} SELECT  
	pd.planno AS id,  
    pd.planno,
	COALESCE(ins.noofreel, 0) AS noofreel,
	COALESCE(ins.reject_qty, 0) AS reject_qty,
    pd.tpn,
    sp.suppliername vendor,
	pd.cm_refid, 
	pd.orderno,
	t.[type],
	cm.modelname,
    ISNULL(LTRIM(RTRIM(cm.po)), '') AS po,
    ISNULL(pd.req_qty, 0) AS req_qty,
    pd.totalqty,
    ISNULL(pd.confirm_qty, 0) AS confirm_qty,
    CASE WHEN pd.status >= 13 THEN ISNULL(pd.confirm_qty, 0) ELSE '' END AS dispatch_qty, 
    pd.printdate,
	req.full_name plan_request_by, 
	req.profile plan_request_byprofile, 
	req.empcode AS plan_request_byempcode, 
	req.rolename AS plan_request_byrole, 
	CONVERT(VARCHAR(19),cm.createddate,29) AS plan_request_date,  
	pd.holdremarks,
	pd.fqa_reject_remarks,
	pd.sto_number,
	pd.physical_type,
	pd.grn_number,
	pd.obd_number,
	pd.sto_invoice,
	pd.po_number,
	pd.eway_billno,
	pd.eway_bill_upload,
	pd.truck_number,
	pd.weight_and_volume,
	pd.noOfPallet, 
	pd.invoicenumber,
	pd.uploadinvoice,

	assigner.full_name AS assigned_by,
	picker.full_name AS pick_by,
	denomination.full_name AS denomination_by,
	box.full_name AS box_by,
	label.full_name AS label_by,
	pre_ins.full_name AS pre_ins_by,
	fqa.full_name AS fqa_by,
	fqa_hold.full_name AS fqa_hold_by,
	dispatch.full_name AS dispatch_by, 
	firstobduser.full_name AS first_obd_by,
	obduser.full_name AS obd_by,
	firstlogisticsuser.full_name AS first_logistics_by, 
	logisticsuser.full_name AS logistics_by, 
	out_docs_user.full_name AS outward_docs_by,
	eway_user.full_name AS eway_by, 
	shipuser.full_name AS ship_by, 
	ackuser.full_name AS ack_by, 

	assigner.empcode AS assigned_byempcode,
	picker.empcode AS pick_byempcode,
	denomination.empcode AS denomination_byempcode,
	box.empcode AS box_byempcode,
	label.empcode AS label_byempcode,
	pre_ins.empcode AS pre_ins_byempcode,
	fqa.empcode AS fqa_byempcode,
	fqa_hold.empcode AS fqa_hold_byempcode,
	dispatch.empcode AS dispatch_byempcode,
	firstobduser.empcode AS first_obd_byempcode, 
	obduser.empcode AS obd_byempcode, 
	firstlogisticsuser.empcode AS first_logistics_byempcode,
	logisticsuser.empcode AS logistics_byempcode,
	out_docs_user.empcode AS outward_docs_byempcode,
	eway_user.empcode AS eway_byempcode,
	shipuser.empcode AS ship_byempcode, 
	ackuser.empcode AS ack_byempcode, 

	assigner.rolename AS assigned_byrole, 
	picker.rolename AS pick_byrole,
	denomination.rolename AS denomination_byrole,
	box.rolename AS box_byrole,
	label.rolename AS label_byrole,
	pre_ins.rolename AS pre_ins_byrole,
	fqa.rolename AS fqa_byrole,
	fqa_hold.rolename AS fqa_hold_byrole,
	dispatch.rolename AS dispatch_byrole, 
	firstobduser.rolename AS first_obd_byrole, 
	obduser.rolename AS obd_byrole, 
	firstlogisticsuser.rolename AS first_logistics_byrole, 
	logisticsuser.rolename AS logistics_byrole, 
	out_docs_user.rolename AS outward_docs_byrole, 
	eway_user.rolename AS eway_byrole,
	shipuser.rolename AS ship_byrole,
	ackuser.rolename AS ack_byrole,

	assigner.profile AS assigned_byprofile,
	picker.profile AS pick_byprofile, 
	denomination.profile AS denomination_byprofile,
	box.profile AS box_byprofile,
	label.profile AS label_byprofile,
	pre_ins.profile AS pre_ins_byprofile,
	fqa.profile AS fqa_byprofile,
	fqa_hold.profile AS fqa_hold_byprofile,
	dispatch.profile AS dispatch_byprofile, 
	firstobduser.profile AS first_obd_byprofile, 
	obduser.profile AS obd_byprofile, 
	firstlogisticsuser.profile AS first_logistics_byprofile,
	logisticsuser.profile AS logistics_byprofile,
	out_docs_user.profile AS outward_docs_byprofile, 
	eway_user.profile AS eway_byprofile,
	shipuser.profile AS ship_byprofile,
	ackuser.profile AS ack_byprofile,
	
	pd.first_printdate,
	pd.assigned_date,
	pd.pick_date, 
	pd.denomination_date, 
	pd.box_date, 
	pd.labeldone_date, 
	pd.pre_inspect_date, 
	pd.fqa_date,  
	pd.fqa_hold_date,  
	pd.dispatch_date, 
	pd.first_obd_date,
	pd.obd_date,
	pd.first_logistics_date,
	pd.logistics_date,
	pd.outward_docs_date,
	pd.eway_bill_date,
	pd.ship_date,
	pd.ack_date, 

	pd.pick_tat, 
	pd.box_tat,  
	pd.label_tat,	 
	pd.pre_inspect_tat, 
	pd.fqa_tat, 
	pd.dispatch_tat,
	pd.first_obd_tat,
	pd.obd_tat,
	pd.first_logistics_tat,
	pd.logistics_tat,
	pd.outward_docs_tat,
	pd.eway_bill_tat,
	pd.ship_tat,
	pd.ack_tat,	
	 
    CASE WHEN pd.status = 1 THEN 'Plan Assigned' WHEN pd.status = 2 THEN 'Picking Done' WHEN pd.status = 3 THEN 'Partially Boxed' WHEN pd.status = 4 THEN 'Box Done (Fully Boxed)' WHEN pd.status = 5 THEN 'Box Labeling Done' WHEN pd.status = 6 THEN 'FQA Pre-Inspection Done' WHEN pd.status = 7 THEN 'FQA Confirmation Done' WHEN pd.status = 77 THEN 'FQA Rejected' WHEN pd.status = 777 THEN 'FQA Hold' WHEN pd.status = 8 THEN 'Outward Verification Done' WHEN pd.status = 99 THEN 'Stock Transfer Order' WHEN pd.status = 9 THEN 
	'OutBound Documentation Done' WHEN pd.status = 10 THEN 'STO Invoice Done' WHEN pd.status = 10 THEN 'Delivery Challan Done' WHEN pd.status = 11 THEN 'Loading Confirmation Done' WHEN pd.status = 12 THEN 'E-Way Bill Done' WHEN pd.status = 13 THEN 'Ship Out Done' WHEN pd.status = 14 THEN 'Acknowledgement Fully Done' WHEN pd.status = 15 THEN 'Acknowledgement Partially Done' WHEN pd.status = 16 THEN 'Acknowledgement Fully Rejected' WHEN pd.status = 17 THEN 'Tejas Discripancy Update Done' WHEN pd.status = 18 THEN 'Supplier Discrepancy Done' ELSE 'Pending' end as status
    FROM PlanningDetails pd ${CTEJoinAndWhereQueries.detailed_report} ORDER BY pd.detail_id DESC`,

	obd_docs: `SELECT d.planno AS id, d.po, d.planno,upper(d.tpn) AS tpn,sp.suppliername vendor, d.planned_requested_qty AS pick_qty,d.totalqty,d.confirm_qty, u.firstname + ' ' + u.lastname AS pick_by, u1.firstname + ' ' + u1.lastname AS assigned_by, r.rolename AS pick_byrole, r1.rolename AS assigned_byrole, u.empcode AS pick_byempcode, u1.empcode AS assigned_byempcode, CONVERT(VARCHAR(19), d.pick_date, 29) AS pick_date, CONVERT(VARCHAR(19), d.assigned_on, 29) AS assigned_date, ISNULL(u.profile, '') AS pick_byprofile, ISNULL(u1.profile, '') AS assigned_byprofile,isnull(d.printcount,0) printcount, trim(qu.firstname + ' ' + qu.lastname) AS qa_by,qr.rolename AS qa_byrole,qu.empcode AS qa_byempcode,ISNULL(qu.profile, '') AS qa_byprofile,CONVERT(VARCHAR(19), d.qadate, 29) AS qa_date, trim(vu.firstname + ' ' + vu.lastname) AS outward_by, vr.rolename AS outward_byrole, vu.empcode AS outward_byempcode, ISNULL(vu.profile, '') AS outward_byprofile, CONVERT(VARCHAR(19), d.outward_date,
    29) AS outward_date , 
	ISNULL(d.obd_number,'') obd_number,
	ISNULL(d.po_number,'') po_number,
	ISNULL(d.eway_billno,'') eway_billno,
	ISNULL(d.eway_bill_upload,'') eway_bill_upload,
	ISNULL(d.truck_number,'') truck_number,
	ISNULL(d.weight_and_volume,'') weight_and_volume,
	ISNULL(d.noOfPallet,'') noOfPallet, 
	ISNULL(d.invoicenumber,'') invoicenumber,ISNULL(d.uploadinvoice,'') uploadinvoice,
	
	trim(ou.firstname + ' ' + ou.lastname) AS obd_by, 
	orr.rolename AS obd_byrole, ou.empcode AS obd_byempcode, 
	ISNULL(ou.profile, '') AS obd_byprofile, 
	CONVERT(VARCHAR(19), d.obd_date, 29) AS obd_date,

	 
	ISNULL(trim(ldu.firstname + ' ' + ldu.lastname), '') AS logistics_by, 
	ISNULL(ldr.rolename, '') AS logistics_byrole, ldu.empcode AS logistics_byempcode, 
	ISNULL(ldu.profile, '') AS logistics_byprofile, 
	ISNULL(CONVERT(VARCHAR(19), d.logistics_date, 29), '') AS logistics_date,
	 
	
	ISNULL(trim(odu.firstname + ' ' + odu.lastname),'') AS outward_docs_by, 
	ISNULL(odr.rolename,'') AS outward_docs_byrole, 
	ISNULL(odu.empcode,'') AS outward_docs_byempcode, 
	ISNULL(odu.profile, '') AS outward_docs_byprofile, 
	ISNULL(CONVERT(VARCHAR(19), d.outward_docs_date, 29),'') AS outward_docs_date,

	ISNULL(trim(ewu.firstname + ' ' + ewu.lastname),'') AS eway_by, 
	ISNULL(ewr.rolename,'') AS eway_byrole,
	ISNULL(ewu.empcode,'') AS eway_byempcode, 
	ISNULL(ewu.profile, '') AS eway_byprofile, 
	ISNULL(CONVERT(VARCHAR(19), d.eway_bill_date, 29),'') AS eway_bill_date,

	ISNULL(trim(spu.firstname + ' ' + spu.lastname),'') AS ship_by, 
	ISNULL(spr.rolename,'') AS ship_byrole, 
	ISNULL(spu.empcode,'') AS ship_byempcode, 
	ISNULL(spu.profile, '') AS ship_byprofile, 
	ISNULL(CONVERT(VARCHAR(19), d.ship_date, 29),'') AS ship_date

	FROM planning_outward AS d 
	INNER JOIN ms_user AS u ON u.id = d.pick_by INNER JOIN ms_user AS u1 ON u1.id = d.assigned_by INNER JOIN ms_role AS r ON r.id = u.roleid INNER JOIN ms_role AS r1 ON r1.id = u1.roleid 
	LEFT JOIN ms_user AS qu ON qu.id = d.qaby LEFT JOIN ms_role AS qr ON qr.id = qu.roleid INNER JOIN ms_user AS vu ON vu.id = d.outward_by INNER JOIN ms_role AS vr ON vr.id = vu.roleid 
	INNER JOIN ms_supplier AS sp ON sp.id=d.supplierid
	LEFT JOIN ms_user AS ou ON ou.id = d.obd_by 
	LEFT JOIN ms_role AS orr ON orr.id = ou.roleid
	
	LEFT JOIN ms_user AS ldu ON ldu.id = d.logistics_by 
	LEFT JOIN ms_role AS ldr ON ldr.id = ldu.roleid
	
	LEFT JOIN ms_user AS odu ON odu.id = d.outward_docs_by 
	LEFT JOIN ms_role AS odr ON odr.id = odu.roleid 

	LEFT JOIN ms_user AS ewu ON ewu.id = d.eway_bill_by 
	LEFT JOIN ms_role AS ewr ON ewr.id = ewu.roleid 

	LEFT JOIN ms_user AS spu ON spu.id = d.ship_by 
	LEFT JOIN ms_role AS spr ON spr.id = spu.roleid 
	
	WHERE d.del_status=0 AND d.status=@status AND (d.po LIKE @search OR d.planno LIKE @search OR d.planned_requested_qty LIKE @search OR sp.suppliername LIKE @search OR u.firstname + ' ' + u.lastname LIKE @search OR  u1.firstname + ' ' + u1.lastname LIKE @search  OR r.rolename LIKE @search OR r1.rolename LIKE @search OR u.empcode LIKE @search OR u1.empcode  LIKE @search  OR CONVERT(VARCHAR(19), d.pick_date, 29) LIKE @search  OR CONVERT(VARCHAR(19), d.assigned_on, 29) LIKE @search OR d.tpn LIKE @search OR trim(qu.firstname + ' ' + qu.lastname) LIKE @search OR qr.rolename LIKE @search OR qu.empcode LIKE @search OR ISNULL(qu.profile, '') LIKE @search OR CONVERT(VARCHAR(19), d.qadate, 29) LIKE @search OR trim(vu.firstname + ' ' + vu.lastname) LIKE @search OR vr.rolename LIKE @search OR vu.empcode LIKE @search OR CONVERT(VARCHAR(19), d.outward_date, 29) LIKE @search OR trim(ou.firstname + ' ' + ou.lastname) LIKE @search OR orr.rolename LIKE @search OR ou.empcode LIKE @search OR CONVERT(VARCHAR(19), d.obd_date, 29) LIKE @search OR d.obd_number LIKE @search OR d.po_number LIKE @search) ORDER BY d.id DESC`,

	mpmdashboardsapvalue: `select distinct upper(tpn) as tpn,sum(convert(int,quantity)) as quantity,convert(int,value) as price from ms_sap_stocklist where upper(tpn) like @search group by upper(tpn),quantity,value order by upper(tpn) asc`,

	material_ack: `
	SELECT 
	d.planno AS id, 
	d.po,d.planno, 
	UPPER(d.tpn) AS tpn,
	d.cm_refid, 
	sp.suppliername vendor, 
	d.planned_requested_qty AS pick_qty, 
	d.totalqty,
	d.confirm_qty,
	d.requested_qty requestquantity, 
	d.confirm_qty orig_received_qty,
 
	ISNULL(CASE WHEN ISNULL(d.totalqty,0) >= d.requested_qty THEN 0 ELSE d.planned_requested_qty-d.totalqty END,0) bal_qty,
	ISNULL(d.obd_number,'') obd_number, 
	ISNULL(d.po_number,'') po_number, 
	ISNULL(d.eway_billno,'') eway_billno, 
	ISNULL(d.eway_bill_upload,'') eway_bill_upload, 
	ISNULL(d.truck_number,'') truck_number, 
	ISNULL(d.weight_and_volume,'') weight_and_volume, 
	ISNULL(d.noOfPallet,'') noOfPallet, 
	ISNULL(d.invoicenumber,'') invoicenumber, 
	ISNULL(d.uploadinvoice,'') uploadinvoice,  
	ISNULL(TRIM(ship_user.firstname + ' ' + ship_user.lastname),'') AS ship_by, 
	ISNULL(ship_user_role.rolename,'') AS ship_byrole, 
	ISNULL(ship_user.empcode,'') AS ship_byempcode, 
	ISNULL(ship_user.profile, '') AS ship_byprofile, 
	ISNULL(CONVERT(VARCHAR(19), d.ship_date, 29),'') AS ship_date,

	ISNULL(TRIM(ack_user.suppliercode),TRIM(ship_user.firstname + ' ' + ship_user.lastname)) AS ack_by, 
	ISNULL(ack_user_role.rolename,ship_user_role.rolename) AS ack_byrole, 
	ISNULL(ack_user.gst,ship_user.empcode) AS ack_byempcode, 
	ISNULL(ack_user.profile, ship_user.profile) AS ack_byprofile, 
	ISNULL(CONVERT(VARCHAR(19), d.ack_date, 29),'') AS ack_date, 
	ISNULL(d.ack_remarks,'') ack_remarks,
	ISNULL(d.ack_rejection_remarks,'') ack_rejection_remarks,
	ISNULL(d.ack_received_qty,'') ack_received_qty,
	ISNULL(d.ack_reject_qty,'') ack_reject_qty,
	ISNULL(d.document_qty,'') document_qty,
	ISNULL(d.document_no,'') document_no,
	ISNULL(d.document_remarks,'') document_remarks
FROM planning_outward AS d 
LEFT JOIN ms_user AS ship_user ON ship_user.id = d.ship_by 
LEFT JOIN ms_role AS ship_user_role ON ship_user_role.id = ship_user.roleid
LEFT JOIN ms_supplier AS ack_user ON ack_user.id = d.ack_by 
LEFT JOIN ms_role AS ack_user_role ON ack_user_role.id = ack_user.roleid
INNER JOIN ms_supplier AS sp ON sp.id=d.supplierid
WHERE d.del_status = 0 AND 
	d.supplierid = CASE WHEN @usertype='Supplier' OR @supplierid!='' THEN @supplierid 
				   ELSE d.supplierid END AND 
	d.status IN (SELECT value FROM STRING_SPLIT(@status, ',')) AND 
	(
		d.po LIKE @search OR 
		UPPER(d.tpn) LIKE @search OR 
		d.planno LIKE @search OR 
		d.planned_requested_qty LIKE @search OR 
		sp.suppliername LIKE @search OR 
		CONVERT(VARCHAR(19), d.pick_date, 29) LIKE @search OR 
		CONVERT(VARCHAR(19), d.assigned_on, 29) LIKE @search OR 
		CONVERT(VARCHAR(19), d.qadate, 29) LIKE @search OR 
		CONVERT(VARCHAR(19), d.outward_date, 29) LIKE @search OR 
		ISNULL(d.obd_number,'') LIKE @search OR 
		ISNULL(d.po_number,'') LIKE @search OR 
		ISNULL(d.eway_billno,'') LIKE @search OR 
		ISNULL(d.truck_number,'') LIKE @search OR 
		ISNULL(d.weight_and_volume,'') LIKE @search OR 
		ISNULL(d.noOfPallet,'') LIKE @search OR 
		ISNULL(d.invoicenumber,'') LIKE @search OR 
		ISNULL(trim(ack_user.suppliername),'') LIKE @search OR 
		ISNULL(ack_user_role.rolename,'') LIKE @search OR 
		ISNULL(ack_user.gst,'') LIKE @search OR 
		ISNULL(CONVERT(VARCHAR(19), d.ack_date, 29),'') LIKE @search OR 
		ISNULL(d.ack_rejection_remarks,'') LIKE @search
	) 
ORDER BY d.id DESC`,

	// Inward


	inward_gate_entry: `
	SELECT 
	ge.id,
	ge.plantid ,
	p.plantcode + ' - ' + p.plantname AS plant,
	CASE 
		WHEN ISNULL(ge.dock_assigned,0)=0 THEN 'Not-Assigned' 
		WHEN ge.dock_assigned=1 THEN 'Assigned' 
		ELSE 'NA' 
	END dock_assigned,
	ge.security_serial_number,
	mode.mode_type AS mode_of_transport,
	ge.truck_size,
	t.truck_size truck_size1,
	ge.truck_number,
	ge.transport_name,
	ge.lr_no,ge.invoice_no,
	CONVERT(VARCHAR(10),ge.invoice_date,29) invoice_date,
	ge.no_of_package,ge.status,
	CONVERT(VARCHAR(19),ge.createddate,29) AS createddate, 
	TRIM(u.firstname +' ' +u.lastname) AS created_by, 
	u.empcode AS created_byempcode, 
	ISNULL(u.[profile],'') AS created_byprofile, 
	r.rolename AS created_byrole 
FROM inward_gate_entry as ge 
LEFT JOIN ms_user as u ON ge.createdby = u.id 
LEFT JOIN ms_role r ON u.roleid = r.id 
INNER JOIN ms_plant AS p ON p.id=ge.plantid
INNER JOIN ms_mode_of_transport AS mode ON mode.id=ge.mode_of_transport
INNER JOIN ms_truck_size AS t ON t.id=ge.truck_size
WHERE ge.del_status=0 AND ge.plantid=@plantid
AND ( 
	p.plantcode + ' - ' + p.plantname LIKE @search OR
	CASE 
		WHEN ISNULL(ge.dock_assigned,0)=0 THEN 'Not-Assigned' 
		WHEN ge.dock_assigned=1 THEN 'Assigned' 
		ELSE 'NA' 
	END LIKE @search OR 
	ge.security_serial_number LIKE @search OR 
	mode.mode_type LIKE @search OR 
	t.truck_size LIKE @search OR 
	ge.truck_number LIKE @search OR 
	ge.transport_name LIKE @search OR 
	ge.lr_no LIKE @search OR 
	ge.invoice_no LIKE @search OR 
	CONVERT(VARCHAR(10),ge.invoice_date,29) LIKE @search OR 
	CONVERT(VARCHAR(19),ge.createddate,29) LIKE @search OR 
	TRIM(u.firstname +' ' +u.lastname) LIKE @search OR 
	u.empcode LIKE @search OR 
	u.updateddate LIKE @search OR 
	r.rolename LIKE @search
)
ORDER BY ge.id DESC
	`,

	inward_dock_allocation: `
	SELECT 
	dl.id,
	dl.plantid,
	p.plantcode + ' - ' + p.plantname plant,
	dl.truck_number,
	dl.dock_id,
	d.dock_number,
	ISNULL(dl.description,'') description,
	CONVERT(VARCHAR(19),dl.dockIn,29) dockIn,
	CONVERT(VARCHAR(19),dl.dockOut,29) dockOut,
	dl.status,CONVERT(VARCHAR(19),dl.createddate,29) AS createddate, 
	TRIM(u.firstname +' ' +u.lastname) AS created_by, 
	u.empcode AS created_byempcode, 
	ISNULL(u.[profile],'') AS created_byprofile, 
	r.rolename AS created_byrole 
FROM inward_dock_allocation as dl 
INNER JOIN ms_dock AS d ON dl.dock_id = d.id 
LEFT JOIN ms_user AS u ON dl.createdby = u.id 
LEFT JOIN ms_role AS r ON u.roleid = r.id 
INNER JOIN ms_plant AS p ON p.id = dl.plantid
WHERE dl.del_status=0 
AND (
	p.plantcode + ' - ' + p.plantname LIKE @search OR
	CONVERT(VARCHAR(19),dl.dockIn,29) LIKE @search OR 
	CONVERT(VARCHAR(19),dl.dockOut,29) LIKE @search OR 
	dl.truck_number LIKE @search OR 
	d.dock_number LIKE @search OR 
	ISNULL(dl.description,'') LIKE @search OR 
	CONVERT(VARCHAR(19),dl.createddate,29) LIKE @search OR 
	TRIM(u.firstname +' ' +u.lastname) LIKE @search OR 
	u.empcode LIKE @search OR 
	u.updateddate LIKE @search OR 
	r.rolename LIKE @search
) 
ORDER BY dl.id DESC
	`,

	ops_inwarddata: `
	SELECT 
	i.id,
	i.plantid,
	p.plantcode + ' - ' + p.plantname AS plant,
	CASE 
		WHEN ISNULL(i.status,1)=1 THEN 'Not-Verified' 
		WHEN i.status=2 THEN 'Partially Verified' 
		WHEN i.status=3 THEN 'Verified' 
		ELSE 'NA' 
	END veri_status,
	i.document_type,
	doc.doc_type document_type1,
	i.mode, 
	mode.mode_type mode1, 
	i.security_serial_number, 
	CONVERT(VARCHAR(10),i.received_date,29) received_date, 
	CONVERT(VARCHAR(19),i.vehicle_in_datetime,29) vehicle_in_datetime, 
	CONVERT(VARCHAR(19),i.vehile_reporting_time,29) vehile_reporting_time, 
	i.shift, i.ots_number, 
	i.lr_number,
	i.security_serial_number, 
	i.hawb_number, 
	CONVERT(VARCHAR(10),i.hawb_date,29) hawb_date, 
	i.supplier_name, 
	i.boe_number, 
	CONVERT(VARCHAR(10),i.boe_date,29) boe_date, 
	i.invoice_number, CONVERT(VARCHAR(10),i.invoice_date,29) invoice_date, 
	i.po_number, CONVERT(VARCHAR(10),i.po_date,29) po_date, 
	i.tpn_number, 
	i.invoice_qty, 
	i.physical_qty, 
	i.difference_qty, 
	i.truck_number, 
	i.unit_price, 
	i.truck_type, 
	t.truck_size, 
	i.no_of_box, 
	i.no_of_pallet, 
	CONVERT(VARCHAR(19),i.unload_start_time,29) unload_start_time, 
	CONVERT(VARCHAR(19),i.unload_end_time,29) unload_end_time, 
	i.e_way_billno,
	CONVERT(VARCHAR(10),i.e_way_billdate,29) e_way_billdate, 
	i.remarks, ISNULL(i.upload_doc,'') upload_doc, 
	i.status,
	CONVERT(VARCHAR(19),
	CASE 
		WHEN i.updateddate IS NULL THEN i.createddate 
		ELSE i.updateddate 
	END,29
	) AS createddate, 
	TRIM(u.firstname +' ' +u.lastname) AS created_by, 
	u.empcode AS created_byempcode, 
	ISNULL(u.[profile],'') AS created_byempprofile, 
	r.rolename AS created_byrole 
FROM ops_inwarddata as i 
LEFT JOIN ms_user as u ON i.createdby = u.id 
LEFT JOIN ms_role r ON u.roleid = r.id 
INNER JOIN ms_plant AS p ON p.id=i.plantid
INNER JOIN ms_inward_doc_type AS doc ON doc.id=i.document_type
INNER JOIN ms_mode_of_transport AS mode ON mode.id=i.mode
INNER JOIN ms_truck_size AS t ON t.id=i.truck_type
WHERE i.del_status=0 AND ISNULL(i.is_transaction,0)=0 
AND (
	p.plantcode + ' - ' + p.plantname LIKE @search OR
	CASE 
		WHEN ISNULL(i.status,1)=1 THEN 'Not-Verified' 
		WHEN i.status=2 THEN 'Partially Verified' 
		WHEN i.status=3 THEN 'Verified' 
		ELSE 'NA' 
	END LIKE @search OR 
	doc.doc_type LIKE @search OR 
	mode.mode_type LIKE @search OR 
	i.security_serial_number LIKE @search OR
	CONVERT(VARCHAR(10),i.received_date,29) LIKE @search OR 
	CONVERT(VARCHAR(19),i.vehicle_in_datetime,29) LIKE @search OR 
	CONVERT(VARCHAR(19),i.vehile_reporting_time,29) LIKE @search OR 
	i.shift LIKE @search OR 
	i.ots_number LIKE @search OR 
	i.lr_number LIKE @search OR 
	i.security_serial_number LIKE @search OR 
	i.hawb_number LIKE @search OR 
	CONVERT(VARCHAR(10),i.hawb_date,29) LIKE @search OR 
	i.supplier_name LIKE @search OR 
	i.boe_number LIKE @search OR 
	CONVERT(VARCHAR(10),i.boe_date,29) LIKE @search OR 
	i.invoice_number LIKE @search OR 
	CONVERT(VARCHAR(10),i.invoice_date,29) LIKE @search OR 
	i.po_number LIKE @search OR 
	CONVERT(VARCHAR(10),i.po_date,29) LIKE @search OR 
	i.tpn_number LIKE @search OR 
	i.invoice_qty LIKE @search OR 
	i.physical_qty LIKE @search OR 
	i.difference_qty LIKE @search OR 
	i.truck_number LIKE @search OR 
	i.unit_price LIKE @search OR 
	t.truck_size LIKE @search OR 
	i.no_of_box LIKE @search OR 
	i.no_of_pallet LIKE @search OR 
	CONVERT(VARCHAR(19),i.unload_start_time,29) LIKE @search OR 
	CONVERT(VARCHAR(19),i.unload_end_time,29) LIKE @search OR 
	i.e_way_billno LIKE @search OR 
	CONVERT(VARCHAR(10),i.e_way_billdate,29) LIKE @search OR 
	i.remarks LIKE @search OR 
	i.status LIKE @search OR 
	CONVERT(VARCHAR(19),CASE WHEN i.updateddate IS NULL THEN i.createddate ELSE i.updateddate END,29) LIKE @search OR 
	TRIM(u.firstname +' ' +u.lastname) LIKE @search OR 
	u.empcode LIKE @search OR u.updateddate LIKE @search OR 
	r.rolename LIKE @search
) 
ORDER BY i.id DESC
	`,

	inward_physical_Verification: `
	SELECT 
	p.id,
	p.plantid,
	pl.plantcode + ' - ' + pl.plantname AS plant,
	p.storagelocation,
	CONCAT('LBL',p.id) label_id,
	TRIM(tlu.firstname +' '+tlu.lastname) team_leader,
	tlu.empcode team_leaderempcode,
	tlr.rolename team_leaderrole,
	ISNULL(tlu.profile,'') team_leaderprofile,
	i.supplier_name,
	p.security_serial_number, p.invoice_number,
	p.mpn_number,
	p.tpn_number,
	p.box_qty,
	p.no_of_box,
	p.no_of_box*p.box_qty total_qty,
	i.po_number,
	ISNULL(p.remarks,'') remarks,
	CONVERT(VARCHAR(19),p.createddate,29) AS createddate, 
	TRIM(u.firstname +' ' +u.lastname) AS created_by, 
	u.empcode AS created_byempcode, 
	ISNULL(u.[profile],'') AS created_byprofile, 
	r.rolename AS created_byrole 
FROM inward_physical_Verification as p 
INNER JOIN ops_inwarddata as i ON i.id = p.inward_refid
LEFT JOIN ms_user as u ON p.createdby = u.id 
LEFT JOIN ms_role r ON u.roleid = r.id 
INNER JOIN ms_user AS tlu ON tlu.id=p.team_leader 
INNER JOIN ms_role AS tlr ON tlr.id=tlu.roleid 
INNER JOIN ms_plant AS pl ON pl.id=p.plantid 
WHERE p.del_status=0 AND p.status=1 
AND (
	pl.plantcode + ' - ' + pl.plantname LIKE @search OR
	p.storagelocation LIKE @search OR
	CONCAT('LBL',p.id) LIKE @search OR 
	TRIM(tlu.firstname +' '+tlu.lastname) LIKE @search OR 
	tlu.empcode LIKE @search OR 
	tlr.rolename LIKE @search OR 
	p.supplier_name LIKE @search OR 
	p.security_serial_number LIKE @search OR 
	p.invoice_number LIKE @search OR 
	p.mpn_number LIKE @search OR 
	p.tpn_number LIKE @search OR 
	p.box_qty LIKE @search OR 
	p.no_of_box LIKE @search OR 
	p.no_of_box*p.box_qty LIKE @search OR 
	i.po_number LIKE @search OR 
	ISNULL(p.remarks,'') LIKE @search OR 
	p.box_qty LIKE @search OR 
	CONVERT(VARCHAR(19),p.createddate,29) LIKE @search OR 
	TRIM(u.firstname +' ' +u.lastname) LIKE @search OR 
	u.empcode LIKE @search OR 
	u.updateddate LIKE @search OR 
	r.rolename LIKE @search
) 
ORDER BY p.id DESC
`,

	inward_print: `
	WITH i_filtered AS (
    SELECT security_serial_number, box_qty, no_of_box
    FROM inward_physical_Verification
    WHERE del_status = 0 AND security_serial_number LIKE @search
),
i_aggregated AS (
    SELECT 
        security_serial_number,
        SUM(DISTINCT box_qty * no_of_box) AS received_qty
    FROM i_filtered
    GROUP BY security_serial_number
),
inw_aggregated AS (
    SELECT 
        security_serial_number,
        SUM(DISTINCT invoice_qty) AS invoice_qty
    FROM ops_inwarddata
    GROUP BY security_serial_number
)
SELECT 
    i.security_serial_number,
    ISNULL(inw.invoice_qty, 0) AS invoice_qty,
    ISNULL(i.received_qty, 0) AS received_qty,
    ISNULL(inw.invoice_qty, 0) - ISNULL(i.received_qty, 0) AS bal_qty
FROM i_aggregated i
LEFT JOIN inw_aggregated inw ON inw.security_serial_number = i.security_serial_number
ORDER BY i.security_serial_number

	`,

	update_grn: `
	SELECT 
	p.id,
	p.plantid,
	pl.plantcode + ' - ' + pl.plantname AS plant,
	p.storagelocation,
	p.inward_refid, 
	TRIM(tlu.firstname +' '+tlu.lastname) team_leader,
	tlu.empcode team_leaderempcode,
	tlr.rolename team_leaderrole,
	ISNULL(tlu.profile,'') team_leaderprofile,
	p.supplier_name,
	p.security_serial_number, p.invoice_number,
	p.mpn_number,
	p.tpn_number,
	p.box_qty,
	p.no_of_box,
	p.no_of_box*p.box_qty total_qty,
	ISNULL(p.remarks,'') remarks,
	CONVERT(VARCHAR(19),p.createddate,29) AS createddate, 
	TRIM(u.firstname +' ' +u.lastname) AS created_by, 
	u.empcode AS created_byempcode, 
	ISNULL(u.[profile],'') AS created_byprofile, 
	r.rolename AS created_byrole, 
	i.po_number
FROM inward_physical_Verification as p 
INNER JOIN ops_inwarddata as i ON i.id = p.inward_refid
LEFT JOIN ms_user as u ON p.createdby = u.id 
LEFT JOIN ms_role r ON u.roleid = r.id 
INNER JOIN ms_user AS tlu ON tlu.id=p.team_leader 
INNER JOIN ms_role AS tlr ON tlr.id=tlu.roleid 
INNER JOIN ms_plant AS pl ON pl.id=p.plantid 
WHERE p.del_status=0 AND p.status=1 AND p.plantid=@plantid
	AND (
		pl.plantcode + ' - ' + pl.plantname LIKE @search OR
		p.storagelocation LIKE @search OR 
		TRIM(tlu.firstname +' '+tlu.lastname) LIKE @search OR 
		tlu.empcode LIKE @search OR 
		tlr.rolename LIKE @search OR 
		p.supplier_name LIKE @search OR 
		p.security_serial_number LIKE @search OR 
		p.invoice_number LIKE @search OR 
		p.mpn_number LIKE @search OR 
		p.tpn_number LIKE @search OR 
		p.no_of_box LIKE @search OR 
		p.no_of_box*p.box_qty LIKE @search OR 
		ISNULL(p.remarks,'') LIKE @search OR 
		p.box_qty LIKE @search OR 
		CONVERT(VARCHAR(19),p.createddate,29) LIKE @search OR 
		TRIM(u.firstname +' ' +u.lastname) LIKE @search OR 
		u.empcode LIKE @search OR 
		u.updateddate LIKE @search OR 
		r.rolename LIKE @search
	) 
ORDER BY p.id DESC
	`,

	inward_grn_details: `
	SELECT 
	g.id,
	g.inward_refid,
	g.physical_refid,
	p.invoice_number,
	p.mpn_number,
	p.tpn_number,
	g.po_number,
	g.grn_number, 
	g.grn_quantity AS original_grn_quantity,
	g.grn_quantity-ISNULL(g.scanned_grn_quantity,0) grn_quantity,
	CONVERT(VARCHAR(10),g.grn_date,29) grn_date,
	ISNULL(g.remarks,'') remarks,
	i.document_type,
	doc.doc_type,
	CASE 
		WHEN g.status=1 THEN 'Pending' 
		WHEN g.status=2 THEN 'Partially Completed' 
		WHEN g.status=3 THEN 'Completed' 
		ELSE 'NA' 
	END status,
	CONVERT(VARCHAR(19),g.createddate,29) AS createddate, 
	TRIM(u.firstname +' ' +u.lastname) AS created_by, 
	u.empcode AS created_byempcode, 
	ISNULL(u.[profile],'') AS created_byprofile, 
	r.rolename AS created_byrole 
FROM inward_grn_details as g 
INNER JOIN inward_physical_Verification AS p ON p.id=g.physical_refid 
INNER JOIN ops_inwarddata as i ON i.id = g.inward_refid
INNER JOIN ms_inward_doc_type AS doc ON doc.id=i.document_type
LEFT JOIN ms_user as u ON g.createdby = u.id 
LEFT JOIN ms_role r ON u.roleid = r.id 
WHERE g.del_status=0 AND g.status!=3 AND g.plantid=@plantid
AND (
	p.invoice_number LIKE @search OR 
	p.mpn_number LIKE @search OR 
	p.tpn_number LIKE @search OR 
	g.po_number LIKE @search OR 
	g.grn_number LIKE @search OR 
	g.grn_quantity LIKE @search OR 
	CONVERT(VARCHAR(10),g.grn_date,29) LIKE @search OR 
	ISNULL(g.remarks,'') LIKE @search OR 
	CONVERT(VARCHAR(19),g.createddate,29) LIKE @search OR 
	TRIM(u.firstname +' ' +u.lastname) LIKE @search OR 
	u.empcode LIKE @search OR 
	u.updateddate LIKE @search OR 
	r.rolename LIKE @search
) 
ORDER BY g.id DESC
	`,

	inward_label_generation: `
SELECT 
    lg.id,
    lg.storagelocation,
    CONCAT('GRNLBL',lg.id) label_id,
    lg.inward_refid,
    lg.physical_refid,
    lg.grn_refid,
    i.supplier_name,
    p.box_qty,
    p.invoice_number,
    p.mpn_number,
    p.tpn_number,
    lg.po_number,
    lg.grn_number,
    lg.quantity,
    CONVERT(VARCHAR(10),lg.grn_date,29) grn_date,
    ISNULL(lg.remarks,'') remarks,
    CONVERT(VARCHAR(19),lg.createddate,29) AS createddate, 
    TRIM(u.firstname +' ' +u.lastname) AS created_by, 
    u.empcode AS created_byempcode, 
    ISNULL(u.[profile],'') AS created_byprofile, 
    r.rolename AS created_byrole,
    lg.make,
    lg.lotnumber,
    lg.serialno,
    lg.datecode,
-- Calculate Manufacture Date
    CONVERT(VARCHAR(10),DATEADD(DAY, 
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
    ),27) AS ManufactureDate,
    -- Calculate Expiry Date
    CONVERT(VARCHAR(10),DATEADD(MONTH, PT.noofmonths, 
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
    ),27) AS ExpiryDate,
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


FROM inward_label_generation as lg 
INNER JOIN inward_physical_Verification AS p ON p.id=lg.physical_refid 
INNER JOIN ops_inwarddata AS i ON i.id=lg.inward_refid 
INNER JOIN ms_part AS PT ON PT.tpn=p.tpn_number 
LEFT JOIN ms_user as u ON lg.createdby = u.id 
LEFT JOIN ms_role r ON u.roleid = r.id 
WHERE lg.del_status=0 AND PT.del_status=0 AND lg.plantid=@plantid AND lg.status IN(SELECT value from STRING_SPLIT(@status,',')) 
AND (
	lg.storagelocation LIKE @search OR 
    CONCAT('GRNLBL',lg.id) LIKE @search OR 
    i.supplier_name LIKE @search OR 
    p.box_qty LIKE @search OR 
    p.invoice_number LIKE @search OR 
    p.mpn_number LIKE @search OR 
    p.tpn_number LIKE @search OR 
    lg.po_number LIKE @search OR 
    lg.grn_number LIKE @search OR 
    lg.quantity LIKE @search OR 
    lg.serialno LIKE @search OR
    CONVERT(VARCHAR(10),lg.grn_date,29) LIKE @search OR 
    ISNULL(lg.remarks,'') LIKE @search OR 
    CONVERT(VARCHAR(19),lg.createddate,29) LIKE @search OR 
    TRIM(u.firstname +' ' +u.lastname) LIKE @search OR 
    u.empcode LIKE @search OR 
    u.updateddate LIKE @search OR 
    r.rolename LIKE @search OR 
    lg.make LIKE @search OR 
    lg.lotnumber LIKE @search
) 
ORDER BY lg.id DESC`,

	inward_iqc_report: `SELECT lg.id,CONCAT('GRNLBL',lg.id) label_id,lg.inward_refid,lg.physical_refid,lg.grn_refid,p.invoice_number,p.mpn_number,p.tpn_number,lg.po_number,lg.grn_number,lg.quantity,CONVERT(VARCHAR(10),lg.grn_date,29) grn_date,ISNULL(lg.remarks,'') remarks,CONVERT(VARCHAR(19),lg.iqc_date,29) AS iqc_date, TRIM(u.firstname +' ' +u.lastname) AS iqc_by, u.empcode AS iqc_byempcode, ISNULL(u.[profile],'') AS iqc_byprofile, r.rolename AS iqc_byrole,CASE WHEN lg.status=2 THEN 'IQC Confirmed' WHEN lg.status=3 THEN 'IQC Rejected' ELSE 'NA' END status FROM inward_label_generation as lg INNER JOIN inward_physical_Verification AS p ON p.id=lg.physical_refid LEFT JOIN ms_user as u ON lg.iqc_by = u.id LEFT JOIN ms_role r ON u.roleid = r.id WHERE lg.del_status=0 AND lg.status IN(2,3) AND (CONCAT('GRNLBL',lg.id) LIKE @search OR p.invoice_number LIKE @search OR p.mpn_number LIKE @search OR p.tpn_number LIKE @search OR lg.po_number LIKE @search OR lg.grn_number LIKE @search OR lg.quantity LIKE @search OR CONVERT(VARCHAR(10),lg.grn_date,29) LIKE @search OR ISNULL(lg.remarks,'') LIKE @search OR CONVERT(VARCHAR(19),lg.iqc_date,29) LIKE @search OR TRIM(u.firstname +' ' +u.lastname) LIKE @search OR u.empcode LIKE @search OR u.updateddate LIKE @search OR r.rolename LIKE @search) ORDER BY lg.id DESC`,

	inward_mpn: `SELECT mpn.id,mpn.tpn,mpn.description,mpn.vendor,mpn.mpn,TRIM(u.firstname + ' '+u.lastname) AS created_by,r.rolename AS created_byrole,u.empcode AS created_byempcode,ISNULL(u.profile,'') AS created_byprofile,CONVERT(VARCHAR(19),mpn.createddate,29) createddate  FROM inward_mpn AS mpn INNER JOIN ms_user AS u ON u.id=mpn.createdby INNER JOIN ms_role AS r ON r.id=u.roleid WHERE mpn.del_status=0 AND (mpn.tpn LIKE @search OR mpn.vendor LIKE @search OR mpn.mpn LIKE @search OR mpn.description LIKE @search OR ISNULL(u.firstname + ' '+u.lastname,'') LIKE @search OR r.rolename LIKE @search OR u.empcode LIKE @search OR CONVERT(VARCHAR(19),mpn.createddate,29) LIKE @search) ORDER BY mpn.id DESC`,

	inward_mpn_verification: `SELECT imv.id,imv.mpn,imv.palletno,imv.tpn,imv.location,imv.quantity,TRIM(u.firstname +' ' +u.lastname) mpn_by,u.empcode AS mpn_byempcode,r.rolename mpn_byrole,ISNULL(u.profile,'') AS mpn_byprofile,CONVERT(VARCHAR(19),u.createddate,29) mpn_date FROM inward_mpn_verification AS imv INNER JOIN ms_user AS u ON u.id=imv.createdby INNER JOIN ms_role AS r ON r.id=u.roleid WHERE imv.del_status=0 AND (imv.mpn LIKE @search OR imv.palletno LIKE @search OR imv.tpn LIKE @search OR imv.location LIKE @search OR imv.quantity LIKE @search OR TRIM(u.firstname +' ' +u.lastname) LIKE @search OR u.empcode LIKE @search OR r.rolename LIKE @search OR CONVERT(VARCHAR(19),u.createddate,29) LIKE @search) ORDER BY imv.id DESC`,

	inward_tracker_vehicle: `SELECT itv.id,itv.vehicle_number,itv.vehicle_size,itv.mode_of_transport,itv.transporter_name,itv.no_of_boxes,itv.no_of_pallets,itv.shipment_courier,itv.no_of_invoice,itv.no_of_boe,itv.mode_of_document,itv.description,itv.status,TRIM(u.firstname + ' ' + u.lastname) AS created_by,r.rolename AS created_byrole,u.empcode AS created_byempcode,ISNULL(u.profile,'') AS created_byprofile,CONVERT(VARCHAR(19),itv.createddate,29) createddate FROM inward_tracker_vehicle AS itv INNER JOIN ms_user AS u ON u.id=itv.createdby INNER JOIN ms_role AS r ON r.id=u.roleid WHERE itv.del_status=0 AND (itv.vehicle_number LIKE @search OR itv.vehicle_size LIKE @search OR itv.mode_of_transport LIKE @search OR itv.no_of_boxes LIKE @search OR itv.no_of_pallets LIKE @search OR itv.shipment_courier LIKE @search OR itv.no_of_invoice LIKE @search OR itv.no_of_boe LIKE @search OR itv.mode_of_document LIKE @search OR itv.description LIKE @search OR TRIM(u.firstname + ' ' + u.lastname) LIKE @search OR r.rolename LIKE @search OR u.empcode LIKE @search OR CONVERT(VARCHAR(19),itv.createddate,29) LIKE @search) ORDER BY itv.id DESC`,

	inward_tracker_document: `SELECT itd.id,itd.invoice_no,itd.boe_no,itd.hawb_bill_no,itd.e_way_bill_no,itd.part_no,itd.invoice_qty,itd.description,itd.status,TRIM(u.firstname + ' ' + u.lastname) AS created_by,r.rolename AS created_byrole,u.empcode AS created_byempcode,ISNULL(u.profile,'') AS created_byprofile,CONVERT(VARCHAR(19),itd.createddate,29) createddate FROM inward_tracker_document AS itd INNER JOIN ms_user AS u ON u.id=itd.createdby INNER JOIN ms_role AS r ON r.id=u.roleid WHERE itd.del_status=0 AND (itd.invoice_no LIKE @search OR itd.boe_no LIKE @search OR itd.hawb_bill_no LIKE @search OR itd.e_way_bill_no LIKE @search OR itd.part_no LIKE @search OR itd.invoice_qty LIKE @search OR itd.description LIKE @search OR TRIM(u.firstname + ' ' + u.lastname) LIKE @search OR r.rolename LIKE @search OR u.empcode LIKE @search OR CONVERT(VARCHAR(19),itd.createddate,29) LIKE @search) ORDER BY itd.id DESC`,

	inward_tracker_upload: `SELECT itu.receiving_date, itu.shift, itu.aging, itu.rs_no, itu.tejas_shift_incharge_name, itu.three_pl_incharge_name, itu.ots_no, itu.security_register, itu.sl_no, itu.hawb, itu.hawb_date, itu.supplier, itu.mode, itu.boe_no, itu.boe_date, itu.invoice_no, itu.invoice_date, itu.po_number, itu.mpn, itu.tpn, itu.invoice_qty, itu.phy_qty, itu.diff, itu.truck_no, itu.unit_price, itu.type_of_truck, itu.no_of_boxes, itu.loose_boxes, itu.rdr_status, itu.no_of_pallet, itu.uploading_start_time, itu.uploading_end_time, itu.mir_status, itu.wms_grn_no, itu.wms_grn_date, itu.wms_grn_status, itu.sap_grn, itu.sap_grn_date, itu.grn_status, itu.grn_pending_status, itu.qa_rise_to_mail_date, itu.qa_status, itu.qa_complete_date, itu.status, itu.putway_status, itu.remarks,TRIM(u.firstname +' ' +u.lastname) created_by,u.empcode AS created_byempcode,r.rolename AS created_byrole,ISNULL(u.profile,'') AS created_byprofile,CONVERT(VARCHAR(19),itu.createddate,29) AS createddate FROM inward_tracker_upload AS itu INNER JOIN ms_user AS u ON u.id=itu.createdby INNER JOIN ms_role AS r ON r.id=u.roleid WHERE u.del_status=0 ORDER BY itu.id`,


	inward_tracker_upload1: `SELECT itu.receiving_date, itu.shift, itu.aging, itu.rs_no, itu.tejas_shift_incharge_name, itu.three_pl_incharge_name, itu.ots_no, itu.security_register, itu.sl_no, itu.hawb, itu.hawb_date, itu.supplier, itu.mode, itu.boe_no, itu.boe_date, itu.invoice_no, itu.invoice_date, itu.po_number, itu.mpn, itu.tpn, itu.invoice_qty, itu.phy_qty, itu.diff, itu.truck_no, itu.unit_price, itu.type_of_truck, itu.no_of_boxes, itu.loose_boxes, itu.rdr_status, itu.no_of_pallet, itu.uploading_start_time, itu.uploading_end_time, itu.mir_status, itu.wms_grn_no, itu.wms_grn_date, itu.wms_grn_status, itu.sap_grn, itu.sap_grn_date, itu.grn_status, itu.grn_pending_status, itu.qa_rise_to_mail_date, itu.qa_status, itu.qa_complete_date, itu.status, itu.putway_status, itu.remarks,
	TRIM(u.firstname +' ' +u.lastname) created_by,u.empcode AS created_byempcode,r.rolename AS created_byrole,ISNULL(u.profile,'') AS created_byprofile,CONVERT(VARCHAR(19),itu.createddate,29) AS createddate FROM inward_tracker_upload AS itu INNER JOIN ms_user AS u ON u.id=itu.createdby INNER JOIN ms_role AS r ON r.id=u.roleid WHERE u.del_status=0 AND itu.rs_no=@rs_no AND itu.invoice_no=@invoice_no AND itu.boe_no=@boe_no AND (itu.receiving_date LIKE @search OR itu.shift LIKE @search OR itu.aging LIKE @search OR itu.rs_no LIKE @search OR itu.tejas_shift_incharge_name LIKE @search OR itu.three_pl_incharge_name LIKE @search OR itu.ots_no LIKE @search OR itu.security_register LIKE @search OR itu.sl_no LIKE @search OR itu.hawb LIKE @search OR itu.hawb_date LIKE @search OR itu.supplier LIKE @search OR itu.mode LIKE @search OR itu.boe_no LIKE @search OR itu.boe_date LIKE @search OR itu.invoice_no LIKE @search OR itu.invoice_date LIKE @search OR itu.po_number LIKE @search OR itu.mpn LIKE @search OR itu.tpn LIKE @search OR itu.invoice_qty LIKE @search OR itu.phy_qty LIKE @search OR itu.diff LIKE @search OR itu.truck_no LIKE @search OR itu.unit_price LIKE @search OR itu.type_of_truck LIKE @search OR itu.no_of_boxes LIKE @search OR itu.loose_boxes LIKE @search OR itu.rdr_status LIKE @search OR itu.no_of_pallet LIKE @search OR itu.uploading_start_time LIKE @search OR itu.uploading_end_time LIKE @search OR itu.mir_status LIKE @search OR itu.wms_grn_no LIKE @search OR itu.wms_grn_date LIKE @search OR itu.wms_grn_status LIKE @search OR itu.sap_grn LIKE @search OR itu.sap_grn_date LIKE @search OR itu.grn_status LIKE @search OR itu.grn_pending_status LIKE @search OR itu.qa_rise_to_mail_date LIKE @search OR itu.qa_status LIKE @search OR itu.qa_complete_date LIKE @search OR itu.status LIKE @search OR itu.putway_status LIKE @search OR itu.remarks LIKE @search OR TRIM(u.firstname +' ' +u.lastname) LIKE @search OR u.empcode LIKE @search OR r.rolename LIKE @search OR CONVERT(VARCHAR(19),itu.createddate,29) LIKE @search) ORDER BY itu.id`,

	// Cycle Count
	cyclecount_wall_to_wall_audit: `SELECT 
    wa.id,
    TRIM(wa.location) AS location,
    TRIM(wa.mpn_number) AS mpn_number,
    TRIM(wa.tpn_number) AS tpn_number,
    wa.no_of_reel,
    wa.quantity,
    wa.no_of_reel * wa.quantity AS total_qty,
    TRIM(wa.supplier_name) AS supplier_name,
    TRIM(wa.date_code) AS date_code,
    TRIM(wa.date_code) AS date_code_old,
    ISNULL(TRIM(wa.remarks), '') AS remarks,
    CONVERT(VARCHAR(19), wa.createddate, 29) AS createddate,
    TRIM(u.firstname + ' ' + u.lastname) AS created_by,
    u.empcode AS created_byempcode,
    ISNULL(u.[profile], '') AS created_byprofile,
    r.rolename AS created_byrole,
    ISNULL(
        STUFF((
            SELECT ',' + label_id
            FROM cyclecount_wall_to_wall_label_splitup
            WHERE label_ref_id = wa.id
            FOR XML PATH('')
        ), 1, 1, ''),
        ''
    ) AS [label],
    wa.del_status
FROM 
    cyclecount_wall_to_wall_label AS wa
LEFT JOIN 
    ms_user AS u ON wa.createdby = u.id
LEFT JOIN 
    ms_role AS r ON u.roleid = r.id
WHERE 
    wa.del_status = @del_status
    AND (
        TRIM(wa.location) LIKE @search OR
        TRIM(wa.mpn_number) LIKE @search OR
        TRIM(wa.tpn_number) LIKE @search OR
        wa.quantity LIKE @search OR
        TRIM(wa.supplier_name) LIKE @search OR
        TRIM(wa.date_code) LIKE @search OR
        ISNULL(TRIM(wa.remarks), '') LIKE @search OR
        CONVERT(VARCHAR(19), wa.createddate, 29) LIKE @search OR
        TRIM(u.firstname + ' ' + u.lastname) LIKE @search OR
        u.empcode LIKE @search OR
        u.updateddate LIKE @search OR
        r.rolename LIKE @search
    )
ORDER BY wa.id DESC;
`,

	cyclecount_wall_to_wall_audit_consolidated_report: `select wa.label_ref_id, trim(wa.location) as location, trim(wa.mpn_number) as mpn_number, trim(wa.tpn_number) as tpn_number, wa.quantity as quantity, (sum(wa.no_of_reel)*wa.quantity) as total_qty, concat(sum(wa.no_of_reel),'/',(select count(id) from cyclecount_wall_to_wall_label_splitup where label_ref_id=wa.label_ref_id)) no_of_reel from cyclecount_wall_to_wall_audit as wa left join ms_user as u on wa.createdby = u.id left join ms_role r on u.roleid = r.id where wa.del_status=0 AND (trim(wa.location) LIKE @search OR trim(wa.mpn_number) LIKE @search OR trim(wa.tpn_number) LIKE @search OR wa.quantity LIKE @search) group by wa.label_ref_id,trim(wa.location),trim(wa.mpn_number),wa.tpn_number,wa.location,wa.quantity,wa.no_of_reel order by wa.label_ref_id desc`,

	cyclecount_wall_to_wall_audit_report: `select wa.id,wa.label_id, trim(wa.location) as location, trim(wa.mpn_number) as mpn_number, trim(wa.tpn_number) as tpn_number, wa.quantity, no_of_reel*wa.quantity total_qty,'1' no_of_reel, trim(wa.supplier_name) as supplier_name, trim(wa.date_code) as date_code, isnull(trim(wa.remarks),'') as remarks, convert(varchar(19),wa.createddate,29) as created_date, trim(u.firstname +' ' +u.lastname) as created_by, u.empcode as created_byempcode, isnull(u.[profile],'') as created_byprofile, r.rolename as created_byrole from cyclecount_wall_to_wall_audit as wa left join ms_user as u on wa.createdby = u.id left join ms_role r on u.roleid = r.id where wa.del_status=0 AND (trim(wa.label_id) LIKE @search OR trim(wa.location) LIKE @search OR trim(wa.mpn_number) LIKE @search OR trim(wa.tpn_number) LIKE @search OR wa.quantity LIKE @search OR trim(wa.supplier_name) LIKE @search OR trim(wa.date_code) LIKE @search OR isnull(trim(wa.remarks),'') LIKE @search OR CONVERT(VARCHAR(19),wa.createddate,29) LIKE @search OR TRIM(u.firstname +' ' +u.lastname) LIKE @search OR u.empcode LIKE @search OR CONVERT(VARCHAR(19),wa.createddate,29) LIKE @search OR r.rolename LIKE @search) ORDER BY wa.id DESC`,

	cyclecount_wall_to_wall_label: `select wa.id,trim(wa.location) location, trim(wa.mpn_number) as mpn_number, trim(wa.tpn_number) as tpn_number,wa.no_of_reel,wa.quantity, wa.no_of_reel*wa.quantity total_qty, trim(wa.supplier_name) as supplier_name, trim(wa.date_code) as date_code,trim(wa.date_code) as date_code_old, isnull(trim(wa.remarks),'') as remarks, convert(varchar(19),wa.createddate,29) as createddate, trim(u.firstname +' ' +u.lastname) as created_by, u.empcode as created_byempcode, isnull(u.[profile],'') as created_byprofile, r.rolename as created_byrole, ISNULL(STUFF((SELECT ','+label_id FROM cyclecount_wall_to_wall_label_splitup WHERE label_ref_id=wa.id for xml path('')),1,1,''),'') [label],wa.del_status from cyclecount_wall_to_wall_label as wa left join ms_user as u on wa.createdby = u.id left join ms_role r on u.roleid = r.id where wa.del_status=@del_status AND (trim(wa.location) LIKE @search OR trim(wa.mpn_number) LIKE @search OR trim(wa.tpn_number) LIKE @search OR wa.quantity LIKE @search OR trim(wa.supplier_name) LIKE @search OR trim(wa.date_code) LIKE @search OR isnull(trim(wa.remarks),'') LIKE @search OR CONVERT(VARCHAR(19),wa.createddate,29) LIKE @search OR TRIM(u.firstname +' ' +u.lastname) LIKE @search OR u.empcode LIKE @search OR u.updateddate LIKE @search OR r.rolename LIKE @search) ORDER BY wa.id DESC`,

	// discrepancy: `SELECT 'AUDITLBL' as Type,ins.planno,ins.tpn,ins.id,ins.box_label_id,'LBL'+ins.grn_label_id as reel_id,ins.quantity,ins.ack_qty,CONVERT(VARCHAR(19),ins.rejected_date,29) as rejected_date, 
	// CASE 
	//     WHEN ins.status = 1 THEN 'Received'
	//     WHEN ins.status = 2 THEN 'Shortage'
	//     WHEN ins.status = 3 THEN 'Excess'
	//     WHEN ins.status = 4 THEN 'Damage'
	//     WHEN ins.status = 5 THEN 'Others'
	//     ELSE 'Unknown' END AS status,
	// 	ins.ack_remarks,
	// 	ISNULL(ins.ack_attachments,'') ack_attachments
	// from ops_inventory_wall_to_wall_new_splitup as ins
	// inner join ms_location as loc on loc.id=ins.locationid 
	// where ins.is_out=13 AND ins.del_status=0 AND ISNULL(ins.status,0) NOT IN (0,1) AND (ins.planno LIKE @search OR ins.tpn LIKE @search OR ins.box_label_id LIKE @search OR 'LBL'+ins.grn_label_id LIKE @search OR ins.quantity LIKE @search OR CONVERT(VARCHAR(19),ins.rejected_date,29) LIKE @search)

	// union

	// select 'GRNLBL' as Type,ins.planno,ins.tpn,ins.id,ins.box_label_id,'GRNLBL'+convert(varchar,lg.id) as reel_id,ins.quantity,ins.ack_qty,CONVERT(VARCHAR(19),ins.rejected_date,29) as rejected_date,
	// CASE 
	//     WHEN ins.status = 1 THEN 'Received'
	//     WHEN ins.status = 2 THEN 'Shortage'
	//     WHEN ins.status = 3 THEN 'Excess'
	//     WHEN ins.status = 4 THEN 'Damage'
	//     WHEN ins.status = 5 THEN 'Others'
	//     ELSE 'Unknown' END AS status,
	// 	ins.ack_remarks,
	// 	ISNULL(ins.ack_attachments,'') ack_attachments
	// from ops_inventory_new_splitup as ins
	// inner join inward_label_generation as lg on lg.id=ins.grn_label_id
	// inner join ms_location as loc on loc.id=ins.locationid 
	// where ins.is_out=13 AND ins.del_status=0 AND ISNULL(ins.status,0) NOT IN (0,1) AND (ins.planno LIKE @search OR ins.tpn LIKE @search OR ins.box_label_id LIKE @search OR 'GRNLBL'+convert(varchar,lg.id) LIKE @search OR ins.quantity LIKE @search OR CONVERT(VARCHAR(19),ins.rejected_date,29) LIKE @search) ORDER BY id DESC`,

	discrepancy: `SELECT d.planno AS id, d.po, d.planno,d.cm_refid, upper(d.tpn) AS tpn, sp.suppliername vendor, d.planned_requested_qty AS pick_qty, d.totalqty,d.confirm_qty,d.ack_received_qty,d.ack_reject_qty,ISNULL(trim(ack_user.suppliercode),'') AS ack_by, ISNULL(ack_user_role.rolename,'') AS ack_byrole, ISNULL(ack_user.gst,'') AS ack_byempcode, ISNULL(ack_user.profile, '') AS ack_byprofile, ISNULL(CONVERT(VARCHAR(19), d.ack_date, 29),'') AS ack_date,ISNULL(ins.status,'') status FROM planning_outward AS d LEFT JOIN ms_user AS ship_user ON ship_user.id = d.ship_by LEFT JOIN ms_role AS ship_user_role ON ship_user_role.id = ship_user.roleid LEFT JOIN ms_supplier AS ack_user ON ack_user.id = d.ack_by LEFT JOIN ms_role AS ack_user_role ON ack_user_role.id = ack_user.roleid INNER JOIN ms_supplier AS sp ON sp.id=d.supplierid LEFT JOIN (
    SELECT planno,
	 STRING_AGG(CAST(CASE WHEN status = 2 THEN 'Shortage' WHEN status = 3 THEN 'Excess' WHEN status = 4 THEN 'Damage' ELSE 'NA' END AS NVARCHAR(MAX)), ',') AS status
    FROM (
        SELECT status, planno FROM ops_inventory_new_splitup 
        WHERE del_status = 0 AND ISNULL(status,0) NOT IN (0,1)
        UNION ALL
        SELECT status, planno FROM ops_inventory_wall_to_wall_new_splitup 
        WHERE del_status = 0 AND ISNULL(status,0) NOT IN (0,1)
    ) AS combined
    GROUP BY planno
) AS ins ON d.planno = ins.planno WHERE d.del_status=0 AND d.status IN(15,16) AND d.supplierid=CASE WHEN @usertype='Supplier' THEN @supplierid ELSE d.supplierid END AND (d.po LIKE @search OR upper(d.tpn) LIKE @search OR d.planno LIKE @search OR d.planned_requested_qty LIKE @search OR sp.suppliername LIKE @search OR ISNULL(trim(ack_user.suppliername),'') LIKE @search OR ISNULL(ack_user_role.rolename,'') LIKE @search OR ISNULL(ack_user.gst,'') LIKE @search OR ISNULL(CONVERT(VARCHAR(19), d.ack_date, 29),'') LIKE @search) ORDER BY d.planno`,

	cycle_count_grn_labels: `
	SELECT DISTINCT 
    ins.id,
    'GRN LABEL' AS type, 
    CONCAT('GRNLBL', ins.grn_label_id) AS labelid, 
    loc.location, 
    p.mpn_number, 
    ins.tpn, 
    ins.quantity, 
    lg.datecode, 
    lg.make, 
    u.firstname + ' ' + u.lastname AS created_by, 
    u.empcode AS created_byempcode, 
    u.profile AS created_byprofile, 
    r.rolename AS created_byrole,
    ISNULL(ins.scancount, 0) AS scancount, 
    CONVERT(VARCHAR(19), ins.createddate, 29) AS createddate,
    CASE 
        WHEN ins.locationid = 13245 THEN loc.location 
        ELSE st.StatusDescription 
    END AS status 
FROM cycle_count_grn_labels AS ins 
INNER JOIN ms_location AS loc ON loc.id = ins.locationid
INNER JOIN (
    SELECT id, physical_refid, datecode, make 
    FROM inward_label_generation
) AS lg ON CAST(lg.id AS NVARCHAR) = 
    CASE 
        WHEN CHARINDEX('-', ins.grn_label_id) > 0 
            THEN LEFT(ins.grn_label_id, CHARINDEX('-', ins.grn_label_id) - 1) 
        ELSE ins.grn_label_id 
    END 
LEFT JOIN (
    SELECT grn_label_id, ISNULL(is_out, 0) AS is_out, grn_label_split_id, safetystatus 
    FROM ops_inventory_new_splitup 
    WHERE del_status = 0 AND ISNULL(safetystatus, 0) = 0
) AS inv_sp ON ins.grn_label_id = COALESCE(CAST(inv_sp.grn_label_id AS NVARCHAR), inv_sp.grn_label_split_id)
LEFT JOIN OutwardProcessReelStatusMaster AS st ON st.StatusCode = inv_sp.is_out
INNER JOIN (
    SELECT id, mpn_number 
    FROM inward_physical_Verification
) AS p ON p.id = lg.physical_refid 
INNER JOIN ms_user AS u ON u.id = ins.createdby 
INNER JOIN ms_role AS r ON r.id = u.roleid 
WHERE ins.del_status = 0 
  AND ISNULL(inv_sp.is_out, 0) < 12 
  AND (@status = '' OR st.StatusCode = @status OR (ins.locationid = @status AND ins.locationid = 13245)) 
  AND (
        @startDateTime IS NULL OR @endDateTime IS NULL OR 
        @startDateTime = '' OR @endDateTime = '' OR 
        (CAST(ins.createddate AS DATETIME) BETWEEN @startDateTime AND @endDateTime)
  )
  AND (
        CONCAT('GRNLBL', ins.grn_label_id) LIKE @search OR 
        loc.location LIKE @search OR 
        p.mpn_number LIKE @search OR 
        ins.tpn LIKE @search OR 
        ins.quantity LIKE @search OR 
        lg.datecode LIKE @search OR 
        lg.make LIKE @search OR 
        u.firstname LIKE @search OR 
        u.lastname LIKE @search OR 
        u.empcode LIKE @search OR 
        r.rolename LIKE @search OR 
        CONVERT(VARCHAR(19), ins.createddate, 29) LIKE @search
  )

UNION ALL

SELECT DISTINCT 
    ins.id,
    'AUDIT LABEL' AS type,
    CONCAT('LBL', ins.grn_label_id) AS labelid, 
    loc.location,
    wsp.mpn_number, 
    ins.tpn, 
    ins.quantity,
    wsp.datecode,
    wsp.make, 
    u.firstname + ' ' + u.lastname AS created_by, 
    u.empcode AS created_byempcode, 
    ISNULL(u.profile, '') AS created_byprofile, 
    r.rolename AS created_byrole,
    ISNULL(ins.scancount, 0) AS scancount, 
    CONVERT(VARCHAR(19), ins.createddate, 29) AS createddate,
    CASE 
        WHEN ins.locationid = 13245 THEN loc.location 
        ELSE st.StatusDescription 
    END AS status 
FROM cycle_count_wall_to_wall_labels AS ins 
LEFT JOIN cyclecount_wall_to_wall_label_splitup AS wsp 
    ON wsp.label_id = CASE 
        WHEN CHARINDEX('-', ins.grn_label_id) = 0 
            THEN ins.grn_label_id 
        WHEN LEN(SUBSTRING(ins.grn_label_id, CHARINDEX('-', ins.grn_label_id) + 1, LEN(ins.grn_label_id))) < 3 
            THEN LEFT(ins.grn_label_id, CHARINDEX('-', ins.grn_label_id) - 1)
        WHEN LEN(SUBSTRING(ins.grn_label_id, CHARINDEX('-', ins.grn_label_id) + 1, LEN(ins.grn_label_id))) >= 5 
             AND LEN(ins.grn_label_id) - LEN(REPLACE(ins.grn_label_id, '-', '')) > 1 
            THEN LEFT(ins.grn_label_id, CHARINDEX('-', ins.grn_label_id, CHARINDEX('-', ins.grn_label_id) + 1) - 1)
        ELSE ins.grn_label_id 
    END 
LEFT JOIN (
    SELECT grn_label_id, grn_label_split_id, ISNULL(is_out, 0) AS is_out, safetystatus 
    FROM ops_inventory_wall_to_wall_new_splitup 
    WHERE del_status = 0
) AS inv_sp ON COALESCE(inv_sp.grn_label_id, inv_sp.grn_label_split_id) = ins.grn_label_id
LEFT JOIN OutwardProcessReelStatusMaster AS st ON st.StatusCode = inv_sp.is_out 
INNER JOIN ms_location AS loc ON loc.id = ins.locationid 
INNER JOIN ms_user AS u ON u.id = ins.createdby 
INNER JOIN ms_role AS r ON r.id = u.roleid 
WHERE ins.del_status = 0 
  AND ISNULL(inv_sp.is_out, 0) < 12 
  AND (@status = '' OR st.StatusCode = @status OR (ins.locationid = @status AND ins.locationid = 13245))  
  AND (
        @startDateTime IS NULL OR @endDateTime IS NULL OR 
        @startDateTime = '' OR @endDateTime = '' OR 
        (CAST(ins.createddate AS DATETIME) BETWEEN @startDateTime AND @endDateTime)
  )
  AND (
        CONCAT('LBL', ins.grn_label_id) LIKE @search OR 
        loc.location LIKE @search OR 
        wsp.mpn_number LIKE @search OR 
        ins.tpn LIKE @search OR 
        ins.quantity LIKE @search OR 
        wsp.datecode LIKE @search OR 
        wsp.make LIKE @search OR 
        u.firstname + ' ' + u.lastname LIKE @search OR 
        u.empcode LIKE @search OR 
        r.rolename LIKE @search OR 
        CONVERT(VARCHAR(19), ins.createddate, 29) LIKE @search
  )

ORDER BY id

	`,

	putaway_report: `
SELECT distinct ins.id,'GRN LABEL' type,ins.inv_id,CONCAT('GRNLBL',ins.id) as labelid, ins.palletno, loc.location,p.mpn_number, ins.tpn, ins.quantity,CONVERT(VARCHAR(10),lg.grn_date,29) grn_date,lg.grn_number,lg.datecode,lg.make,lg.lotnumber,p.supplier_name,p.invoice_number, u.firstname + ' ' + u.lastname as created_by, u.empcode as created_byempcode, isnull(u.profile, '') as created_byprofile, r.rolename as created_byrole, convert(varchar(19), ins.createddate, 29)  as createddate,
-- Calculate Manufacture Date
    CONVERT(VARCHAR(10),DATEADD(DAY, 
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
    ),27) AS ManufactureDate,
    -- Calculate Expiry Date
    CONVERT(VARCHAR(10),DATEADD(MONTH, PT.noofmonths, 
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
    ),27) AS ExpiryDate,
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
	
	FROM ops_inventory_new_splitup as ins 
	 INNER JOIN (SELECT id,location FROM ms_location) as loc on loc.id = ins.locationid 
	 INNER JOIN (SELECT tpn,noofmonths FROM ms_part) AS PT ON PT.tpn = ins.tpn 
	 INNER JOIN (SELECT id,physical_refid,datecode,make,grn_number,grn_date,lotnumber FROM inward_label_generation WHERE del_status=0) as lg on lg.id = ins.grn_label_id 
	 INNER JOIN ms_user as u on u.id = ins.createdby 
	 INNER JOIN ms_role as r on r.id = u.roleid 
	 INNER JOIN (SELECT id,mpn_number,supplier_name,invoice_number FROM inward_physical_Verification WHERE del_status=0) AS p ON p.id=lg.physical_refid 
	 WHERE ins.del_status=0 AND ('GRNLBL' + convert(varchar, ins.id) like @search or ins.palletno like @search or loc.location like @search or p.mpn_number like @search or ins.tpn like @search or ins.quantity like @search or lg.datecode LIKE @search OR lg.make LIKE @search OR u.firstname + ' ' + u.lastname like @search or u.empcode like @search or r.rolename like @search or FORMAT(ins.createddate, 'dd/MM/yyyy HH:mm:ss') like @search) ORDER BY ins.id DESC`,

	inventory_picked_report: `SELECT distinct ins.id,'GRN LABEL' type,ins.inv_id,CONCAT('GRNLBL',CONVERT(VARCHAR,COALESCE(
                        CAST(ins.grn_label_id AS NVARCHAR),
                        ins.grn_label_split_id
	                ))) as labelid,ins.planno, ins.palletno, loc.location,p.mpn_number, ins.tpn, ins.quantity,lg.datecode,lg.make, u.firstname + ' ' + u.lastname as out_by, u.empcode as out_byempcode, isnull(u.profile, '') as out_byprofile, r.rolename as out_byrole, convert(varchar(19), ins.out_date, 29)  as out_date,st.StatusDescription AS status  FROM ops_inventory_new_splitup as ins 
	 INNER JOIN (SELECT id,location FROM ms_location) as loc on loc.id = ins.locationid 
	 INNER JOIN (SELECT tpn,noofmonths FROM ms_part) AS PT ON PT.tpn = ins.tpn 
	 INNER JOIN (SELECT id,physical_refid,datecode,make FROM inward_label_generation WHERE del_status=0) as lg on CAST(lg.id AS NVARCHAR) = COALESCE(
                        CAST(ins.grn_label_id AS NVARCHAR),
                        LEFT(ins.grn_label_split_id, CHARINDEX('-', ins.grn_label_split_id) - 1)
                    ) 
	 LEFT JOIN ms_user as u on u.id = ins.out_by 
	 LEFT JOIN ms_role as r on r.id = u.roleid 
	 INNER JOIN (SELECT id,mpn_number FROM inward_physical_Verification WHERE del_status=0) AS p ON p.id=lg.physical_refid 
		LEFT JOIN OutwardProcessReelStatusMaster AS st ON st.StatusCode=ins.is_out
	 WHERE ins.del_status=0 and ISNULL(ins.is_out,0)>0 AND ('GRNLBL' + convert(varchar, lg.id) like @search OR ins.planno LIKE @search OR ins.palletno like @search or loc.location like @search or p.mpn_number like @search or ins.tpn like @search or ins.quantity like @search or lg.datecode LIKE @search OR lg.make LIKE @search OR u.firstname + ' ' + u.lastname like @search or u.empcode like @search or r.rolename like @search)

	 UNION ALL

	 SELECT 
	 distinct 
	 ins.id,
	 'AUDIT LABEL' type,
	 ins.inv_id,
	 CONCAT('LBL',CONVERT(VARCHAR,COALESCE(
                        CAST(ins.grn_label_id AS NVARCHAR),
                        ins.grn_label_split_id
	                ))) as labelid,
	ins.planno, 
	ins.palletno, 
	loc.location,
	wsp.mpn_number, 
	ins.tpn, ins.quantity,wsp.datecode datecode,wsp.make,  u.firstname + ' ' + u.lastname as out_by, u.empcode as out_byempcode, isnull(u.profile, '') as out_byprofile, r.rolename as out_byrole, convert(varchar(19), ins.out_date, 29)  as out_date,st.StatusDescription AS status 
	FROM ops_inventory_wall_to_wall_new_splitup as ins 
	 LEFT JOIN (SELECT label_id,mpn_number,tpn_number,quantity,make,datecode FROM cyclecount_wall_to_wall_label_splitup) AS wsp ON wsp.label_id=CASE 
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
	LEFT JOIN OutwardProcessReelStatusMaster AS st ON st.StatusCode=ins.is_out
	 INNER JOIN (SELECT id,location FROM ms_location) as loc on loc.id = ins.locationid 
	 LEFT JOIN (SELECT tpn,noofmonths FROM ms_part) AS PT ON PT.tpn = ins.tpn 
	 LEFT JOIN ms_user as u on u.id = ins.out_by LEFT JOIN ms_role as r on r.id = u.roleid WHERE ins.del_status=0 AND ISNULL(ins.is_out,0) > 0 AND (CONCAT('LBL',ins.grn_label_id) LIKE @search OR ins.planno LIKE @search OR ins.palletno LIKE @search OR loc.location  LIKE @search OR wsp.mpn_number like @search or ins.tpn LIKE @search OR ins.quantity LIKE @search OR wsp.datecode LIKE @search OR wsp.make LIKE @search OR u.firstname + ' ' + u.lastname LIKE @search OR u.empcode LIKE @search OR r.rolename LIKE @search)
	 ORDER BY id DESC`,


	// Reports


	shelf_life_expiry: `
	${CTEQueries.shelf_life_expiry}
	SELECT * 
	FROM LabelData 
	${CTEJoinAndWhereQueries.shelf_life_expiry}`,
	shelf_life_expiry_partwise: `
	${CTEQueries.shelf_life_expiry}
	SELECT 
		datecode,
    	mpn_number,
        tpn_number,
        SUM(quantity) quantity,
		SUM(price) price,
		COUNT(*) AS noofreel,
		ManufactureDate,
		ExpiryDate,
		DaysToExpiry
		FROM LabelData  
	${CTEJoinAndWhereQueries.shelf_life_expiry_partwise}
	`,

	inward_shelf_life_expiry: `
	${CTEQueries.inward_shelf_life_expiry}
	SELECT * 
	FROM LabelData 
	${CTEJoinAndWhereQueries.inward_shelf_life_expiry}`,

	inward_shelf_life_expiry_partwise: `
	${CTEQueries.inward_shelf_life_expiry}
	SELECT 
		datecode,
    	mpn_number,
        tpn_number,
        SUM(quantity) quantity,
		SUM(price) price,
		COUNT(*) AS noofreel,
		ManufactureDate,
		ExpiryDate,
		DaysToExpiry
		FROM LabelData  
	${CTEJoinAndWhereQueries.inward_shelf_life_expiry_partwise}`,

	GetCSVData: `EXEC sp_UpdateInventory @type = ''`
}

export const limitOffset = ' OFFSET @offset ROWS FETCH FIRST @limit ROWS ONLY;'