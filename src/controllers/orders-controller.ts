import { Request, Response } from "express";
import * as OrderService from "../services/orders/index";

export const getAllOrders = async (req: Request, res: Response) => {
    const unitId = req.params.id as string;

    let message = await OrderService.getAllOrdersByUnitIdService(unitId);

    return res.status(message.statusCode).json(message.content);
}

export const getOrderById = async (req: Request, res: Response) => {
    const orderId = req.params.id as string;

    let message = await OrderService.getOrderByIdService(orderId);

    return res.status(message.statusCode).json(message.content);
}

export const getOrderItems = async (req: Request, res: Response) => {
    const orderId = req.params.id as string;

    let message = await OrderService.getAllOrderItemsByOrderIdService(orderId);

    return res.status(message.statusCode).json(message.content);
}


export const createOrder = async (req: Request, res: Response) => {
    const data = req.body;
    const unidadeId = data.unidade_id as string;
    const canalPedido = data.canal_pedido as string;
    const formaPagamento = data.forma_pagamento as string;

    const orderData = { 
        items: data.items as Array<{ produto_id: string; quantidade: number }> 
    };

    let message = await OrderService.createOrderService(unidadeId, orderData, canalPedido, formaPagamento);

    return res.status(message.statusCode).json(message.content);
}

export const updateOrderStatus = async (req: Request, res: Response) => {
    const orderId = req.params.id as string;
    const status = req.body.status as string;

    let message = await OrderService.updateOrderStatusService(orderId, status);

    return res.status(message.statusCode).json(message.content);
}

export const cancelOrder = async (req: Request, res: Response) => {
    const orderId = req.params.id as string;

    let message = await OrderService.cancelOrderService(orderId);

    return res.status(message.statusCode).json(message.content);
}