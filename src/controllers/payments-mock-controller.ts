import { Request, Response } from "express";
import { processPaymentService } from "../services/payments-mock/index";

export const processPaymentMock = async (req: Request, res: Response) => {
    const { order_id, cliente_email, cupom_codigo } = req.body;

    let message = await processPaymentService(order_id, cliente_email, cupom_codigo);

    return res.status(message.statusCode).json(message.content);
}