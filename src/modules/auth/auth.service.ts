import config from "../../config";
import { pool } from "../../db";
import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from 'jsonwebtoken';


const loginUserIntoDB = async (payload: {
    email: string, password: string
}) => {
    const { email, password } = payload;
    //   check if user exists
    // compare the password
    // Generate Token 

    const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [email])
    // console.log(userData);
    
    if (userData.rows.length === 0) {
        throw new Error("Invalid Credentials");
    }

    const user = userData.rows[0];
    const matchPassword = await bcrypt.compare(password, user.password)

    if (!matchPassword) {
        throw new Error("Invalid Credentials");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email
    }

    const accessToken = jwt.sign(jwtPayload, config.secret as string, {
        expiresIn: '1d'
    })

    const refreshToken = jwt.sign(jwtPayload, config.refresh_secret as string, {
        expiresIn: '1d'
    })

    return { accessToken, refreshToken };

}

    const generateRefrshToken = async (token: string) => {

        if (!token) {
            throw new Error("Unauthorized")
        }

        const decoded = jwt.verify(token as string, config.refresh_secret as string) as JwtPayload;

        const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [decoded.email]);
        const user = userData.rows[0];
        if (userData.rows.length === 0) {
            throw new Error("User Not Found!!")
        }

        const jwtPayload = {
            id: user.id,
            name: user.name,
            role: user.role,
            email: user.email
        }    

        const accessToken = jwt.sign(jwtPayload, config.secret as string, {
            expiresIn: '1d'
        })

        return {accessToken}

    }

export const authService = {
    loginUserIntoDB,
    generateRefrshToken
}