import { pool } from "../../db";
import bcrypt from "bcrypt";
const createUserIntoDb = async (payload) => {
    const { name, email, password, role } = payload;
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(`
        INSERT INTO users(name,email,password,role)
          VALUES ($1, $2, $3, COALESCE($4, 'user'))
          RETURNING *
    `, [name, email, hashPassword, role]);
    delete result.rows[0].password;
    return result;
};
export const userService = {
    createUserIntoDb
};
//# sourceMappingURL=user.service.js.map