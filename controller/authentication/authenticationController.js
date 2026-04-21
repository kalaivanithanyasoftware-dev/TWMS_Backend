import { getReqUserInfo, signInToken, userSessions } from "../../config/auth.js";
import { v4 as uuidv4 } from 'uuid';
import { sql, poolPromise } from "../../config/db.js";

const registerUser = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('role', sql.NVarChar, role)
            .input('description', sql.NVarChar, description)
            .query('INSERT INTO ms_role (role,description,createdby) VALUES (@role,@description,@createdby)');
        res.status(201).send({ data: result.recordset })
    } catch (error) {
        res.status(401).send({ data: [], error: `${error}` })
    }
}

const loginUser = async (req, res) => {
    try {
        const { empcode, password, deviceInfo } = req.body
        const pool = await poolPromise;
        const result = await pool.request()
            .input('empcode', sql.NVarChar, empcode)
            .input('password', sql.NVarChar, password)
            .query(`
                SELECT 
                    u.id,
                    u.plantid,
                    u.activePlant,
                    p.plantcode + ' ' + p.plantname AS plant,
                    ISNULL(p.address, '') AS address,
                    u.firstname,
                    u.lastname,
                    u.empcode,
                    u.roleid,
                    u.departmentid,
                    ISNULL(u.profile,'') profile, 
                    u.status,
                    r.rolename, 
                    s.screenpath
                FROM ms_user AS u 
                INNER JOIN ms_role AS r ON r.id=u.roleid 
                LEFT JOIN ms_screenlist AS s ON s.id=r.homepage 
                LEFT JOIN ms_plant AS p ON p.id = u.plantid
                WHERE empcode = @empcode AND password = @password AND u.del_status = 0 

                SELECT * FROM user_sessions WHERE userid = (SELECT id FROM ms_user WHERE empcode = @empcode AND del_status = 0) 
                  AND isValid = 1 AND usertype = 'Tejas' AND expirydate > GETDATE();
`);
        if (!result.rowsAffected[0]) return res.status(401).send({ data: 'Invalid credentials' });
        if (!result.recordset[0].status) return res.status(401).send({ data: 'Your account is disabled, Please contact your administrator.' });
        // if (result.rowsAffected[1] > 0) return res.status(401).send({ data: 'Max device (1) reached logout other sessions to use.' });
        const { id, plantid, activePlant } = result.recordset[0]
        const newDeviceId = uuidv4();
        const deviceId = deviceInfo?.[id]?.deviceId || newDeviceId
        const usertype = 'Tejas'
        const payload = {
            user: {
                ...(({ password, ...rest }) => ({ ...rest, usertype, deviceId }))(result.recordset[0]),
                globalPlant: plantid === 1001 || activePlant
            } || {}
        };
        const { ip, localIp, clientHost } = await getReqUserInfo(req, res, { empcode, firstname: payload.user.firstname, id: payload.user.id, deviceId, usertype })
        const idToken = signInToken({ user: { ...payload.user, localIp, clientHost } });
        await userSessions(req, { userId: payload.user.id, deviceId, usertype, token: idToken, ip, localIp })
        res.status(201).send({
            data: {
                ...payload.user,
                empcode: empcode,
                idToken,
                localId: '',
                expiresIn: '28800000',
                // expiresIn: '10000',
                refreshToken: '',
            }
        })
    } catch (error) {
        res.status(401).send({ data: 'Invalid Credentials', error: `${error}` })
    }
}


const logoutUser = async (req, res) => {
    const token = req.headers['x-auth-token'];

    try {
        const { empcode, firstname, id, logOutDate, deviceInfo } = req.body
        let deviceActive = false
        if (empcode && firstname && id) {
            const deviceId = deviceInfo[id]?.deviceId
            await getReqUserInfo(req, res, { empcode, firstname, id, deviceId, logOutDate, usertype: 'Tejas' })
            const pool = await poolPromise;
            await pool.request()
                .input('token', sql.NVarChar, token)
                .query(`
            UPDATE user_sessions
            SET isValid = 0
            WHERE token = @token;
        `);
            const getDeviceId = await pool.request()
                .input('userId', sql.Int, id)
                .input('deviceId', sql.NVarChar, deviceId)
                .query(`SELECT COUNT(deviceId) count FROM user_sessions WHERE userId = @userId AND deviceId=@deviceId`);
            if (getDeviceId.recordset[0].count > 0) {
                deviceActive = true
            }
        }
        res.status(201).send({ data: 'success', deviceActive })
    } catch (error) {
        res.status(401).send({ data: 'failed', error: `${error}` })
    }
}
const logoutDevice = async (req, res) => {
    const { action, userId, deviceId } = req.body;

    try {
        const pool = await poolPromise;
        const query = action === 'Logout' ? `UPDATE user_sessions SET isValid = 0 WHERE userId = @userId AND deviceId = @deviceId` : action === 'Delete' ? `DELETE FROM user_sessions WHERE userId = @userId AND deviceId = @deviceId;
        DELETE FROM client_info WHERE userId = @userId AND deviceId = @deviceId` : '';

        await pool.request()
            .input('userId', sql.Int, userId)
            .input('deviceId', sql.NVarChar, deviceId)
            .query(query);

        res.json({ success: true, message: 'Logged out from the device.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred during logout.' });
    }
};

const logoutUserAllDevice = async (req, res) => {
    const { action, userId } = req.body;

    try {
        const query = action === 'Logout' ? `UPDATE user_sessions SET isValid = 0 WHERE userId = @userId` : action === 'Delete' ? `DELETE FROM user_sessions WHERE userId = @userId;
        DELETE FROM client_info WHERE userId = @userId` : '';
        const pool = await poolPromise;
        await pool.request()
            .input('userId', sql.Int, userId)
            .query(query);

        res.json({ message: 'Logged out from all devices' });
    } catch (err) {
        res.status(500).send(err.message);
    }
}


const logoutAllUser = async (req, res) => {

    try {
        const pool = await poolPromise;
        await pool.request()
            .query(`
                UPDATE user_sessions
                SET isValid = 0
            `);

        res.json({ message: 'Logged out from all devices' });
    } catch (err) {
        res.status(500).send(err.message);
    }
}
const unlockUserScreen = async (req, res) => {
    try {
        const { empcode, password } = req.body
        const pool = await poolPromise;
        const result = await pool.request()
            .input('empcode', sql.NVarChar, empcode)
            .input('password', sql.NVarChar, password)
            .query(`SELECT u.id,u.firstname,u.lastname,u.empcode,u.roleid,u.departmentid,isnull(u.profile,'') profile,u.status,r.rolename, s.screenpath FROM ms_user AS u INNER JOIN ms_role AS r ON r.id=u.roleid LEFT JOIN ms_screenlist AS s ON s.id=r.homepage WHERE empcode=@empcode AND password=@password AND u.del_status=0`);
        if (result.recordset.length > 0) {
            res.status(201).send({ data: 'success' })
        } else {
            res.status(401).send({ data: 'failed' })
        }
    } catch (error) {
        res.status(401).send({ data: 'Invalid Credentials', error: `${error}` })
    }
}


const checkAutoLogin = async (req, res) => {
    try {
        const { userId, deviceId } = req.body
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .input('deviceId', sql.NVarChar, deviceId)
            .query(`SELECT COUNT(id) AS count FROM user_sessions WHERE userId=@userId AND deviceId=@deviceId AND del_status=0`);
        if (result.recordset[0]?.count > 0) {
            return res.status(201).send({ userSessionActive: true })
        } else {
            return res.status(201).send({ userSessionActive: false })
        }
    } catch (error) {
        res.status(401).send({ data: 'Invalid Credentials', error: `${error}` })
    }
}


const loginSupplier = async (req, res) => {
    try {
        const { gst, gstpassword, deviceInfo } = req.body
        const pool = await poolPromise;
        const result = await pool.request()
            .input('gst', sql.NVarChar, gst)
            .input('password', sql.NVarChar, gstpassword)
            .query(`SELECT s.id,s.suppliername firstname,'' lastname,s.suppliercode empcode,s.email,s.roleid,isnull(s.profile,'') profile,s.status,r.rolename, sl.screenpath FROM ms_supplier AS s INNER JOIN ms_role AS r ON r.id=s.roleid LEFT JOIN ms_screenlist AS sl ON sl.id=r.homepage WHERE gst=@gst AND password=@password;`);
        if (!result.rowsAffected[0]) return res.status(401).send({ data: 'Invalid credentials' });
        if (!result.recordset[0].status) return res.status(401).send({ data: 'Your account is disabled, Please contact your administrator.' });
        const { id } = result.recordset[0]
        const newDeviceId = uuidv4();
        const deviceId = deviceInfo?.[id]?.deviceId || newDeviceId
        const usertype = 'Supplier'
        const payload = { user: (({ password, ...rest }) => ({ ...rest, usertype, deviceId }))(result.recordset[0]) || {} };
        const { ip, localIp } = await getReqUserInfo(req, res, { empcode: gst, firstname: payload.user.firstname, id: payload.user.id, deviceId, usertype })
        const idToken = signInToken(payload);
        await userSessions(req, { userId: payload.user.id, usertype, deviceId, token: idToken, ip, localIp })
        res.status(201).send({
            data: {
                ...payload.user,
                empcode: gst,
                idToken,
                localId: '',
                expiresIn: '28800000',
                refreshToken: '',
            }
        })
    } catch (error) {
        res.status(401).send({ data: 'Invalid Credentials', error: `${error}` })
    }
}

export { registerUser, loginUser, logoutUser, logoutDevice, logoutUserAllDevice, logoutAllUser, unlockUserScreen, checkAutoLogin, loginSupplier }