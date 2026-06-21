import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function generateToken(userId: number, role: string) {
    return jwt.sign(
    { id: userId, role },
    JWT_SECRET,
    { expiresIn: "1h" }
    );
}