import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth-middleware";
import * as UserService from "../services/users/index";

export const getLogin = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const userRole = req.user?.role;
        
        let message = await UserService.getLoginService(userId, userRole);

        return res.status(message.statusCode).json(message.content);

    } catch (error) {
        return res.status(500).json({
            error: "ERRO_INTERNO_DO_SERVIDOR",
            message: "Erro interno do servidor",
            details: [],
            timestamp: new Date().toISOString(),
            path: req.path,
            requestId: null
        });
    }
}

export const postLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    let message = await UserService.postLoginService(email, password);

    return res.status(message.statusCode).json(message.content);
}

export const postClient = async (req: Request, res: Response) => {
    const { unidade_id, name, email, password, ativo_programa_fidelidade } = req.body;

    let message = await UserService.registerClientService(unidade_id, name, email, password, ativo_programa_fidelidade);

    return res.status(message.statusCode).json(message.content);

}

export const updateMembershipPoints = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const ativoProgramaFidelidade = req.body.ativo_programa_fidelidade;

    let message = await UserService.updateMembershipPointsService(userId, ativoProgramaFidelidade);

    return res.status(message.statusCode).json(message.content);
}