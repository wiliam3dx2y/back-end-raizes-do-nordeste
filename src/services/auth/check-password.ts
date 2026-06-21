import bcrypt from "bcryptjs";

export async function checkPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);    
}