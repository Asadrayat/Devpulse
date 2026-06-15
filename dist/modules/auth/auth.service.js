import config from "../../config";
import { pool } from "../../db";
import bcrypt from "bcrypt";
import jwt, {} from 'jsonwebtoken';
const loginUserIntoDB = async (payload) => {
    const { email, password } = payload;
    //   check if user exists
    // compare the password
    // Generate Token 
    const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
    // console.log(userData);
    if (userData.rows.length === 0) {
        throw new Error("Invalid Credentials");
    }
    const user = userData.rows[0];
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
        throw new Error("Invalid Credentials");
    }
    const jwtPayload = {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email
    };
    const accessToken = jwt.sign(jwtPayload, config.secret, {
        expiresIn: '15m'
    });
    const refreshToken = jwt.sign(jwtPayload, config.refresh_secret, {
        expiresIn: '7d'
    });
    return { accessToken, refreshToken };
};
const generateRefrshToken = async (token) => {
    if (!token) {
        throw new Error("Unauthorized");
    }
    const decoded = jwt.verify(token, config.refresh_secret);
    const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [decoded.email]);
    const user = userData.rows[0];
    if (userData.rows.length === 0) {
        throw new Error("User Not Found!!");
    }
    const jwtPayload = {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email
    };
    const accessToken = jwt.sign(jwtPayload, config.secret, {
        expiresIn: '15m'
    });
    return { accessToken };
};
export const authService = {
    loginUserIntoDB,
    generateRefrshToken
};
//# sourceMappingURL=auth.service.js.map