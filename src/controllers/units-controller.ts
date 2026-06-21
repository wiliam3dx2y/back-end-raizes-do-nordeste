import { Request, Response } from "express";
import { getAllUnitsService } from "../services/units/index";

export const getAllUnits = async (req: Request, res: Response) => {
    let message = await getAllUnitsService();

    return res.status(message.statusCode).json(message.content);
}