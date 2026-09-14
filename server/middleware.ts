import jwt from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";
import type { UserJWT } from "./type";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.token as string;

    if (!token) {
        res.status(401).json({
            message: 'No token provided'
        });
        return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserJWT;
    const userId = decoded.id;

    if(userId) {
        req.userId = userId;
        next();
    } else {
        res.status(401).json({
            message: 'Invalid token'
        });
        return;
    }
}

module.exports = {
    authMiddleware
};
