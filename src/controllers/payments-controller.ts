import { Request, Response } from "express";
import { getPaymentsLogByUnitIdService } from "../services/payments/index";

export const getPaymentLog = async (req: Request, res: Response) => {
    const unitId = req.params.id as string;

    let message = await getPaymentsLogByUnitIdService(unitId);

    return res.status(message.statusCode).json(message.content);
}