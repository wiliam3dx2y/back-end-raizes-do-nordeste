import { Request, Response } from "express";
import * as InventoryService from "../services/inventories/index";
import { InventoryItem } from "../models/inventory-model";

export const getInventoryItems = async (req: Request, res: Response) => {
    const unidade_id = req.params.id as string;

    let message = await InventoryService.getInventoryItemsByUnitIdService(unidade_id);

    return res.status(message.statusCode).json(message.content);
}

export const updateInventoryItem = async (req: Request, res: Response) => {
    const { unidade_id, item_id, quantidade, acao } = req.body;

    let message = await InventoryService.updateInventoryItemService(unidade_id, item_id, quantidade, acao);

    return res.status(message.statusCode).json(message.content);
}

export const createInventoryItem = async (req: Request, res: Response) => {
    const { unidade_id, nome, unidade_de_medida, estoque_minimo } = req.body;
    
    const item: InventoryItem = {
        unidade_id,
        nome,
        unidade_de_medida,
        estoque_minimo
    };

    let message = await InventoryService.createInventoryItemService(item);

    return res.status(message.statusCode).json(message.content);
}

export const getInventoryLog = async (req: Request, res: Response) => {
    const unidade_id = req.params.id as string;

    let message = await InventoryService.getInventoryLogByUnitIdService(unidade_id);

    return res.status(message.statusCode).json(message.content);
}