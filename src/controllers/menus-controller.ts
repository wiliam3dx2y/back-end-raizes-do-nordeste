import { Request, Response } from "express";
import * as MenuService from "../services/menus/index";
import { MenuItem, RecipeItem } from "../models/menu-model";

export const getMenuByUnitId = async (req: Request, res: Response) => {
    const unitId = req.params.id as string;

    let message = await MenuService.getMenuService(unitId);

    return res.status(message.statusCode).json(message.content);
}

export const createMenuItem = async (req: Request, res: Response) => {
    const item: MenuItem = req.body;

    let message = await MenuService.createMenuItemService(item);

    return res.status(message.statusCode).json(message.content);
}

export const createRecipeItem = async (req: Request, res: Response) => {
    const item: RecipeItem = req.body;

    let message = await MenuService.createRecipeItemService(item);

    return res.status(message.statusCode).json(message.content);
}

export const getRecipeByProductId = async (req: Request, res: Response) => {
    const productId = req.params.id as string;

    let message = await MenuService.getRecipeByProductIdService(productId);

    return res.status(message.statusCode).json(message.content);
}