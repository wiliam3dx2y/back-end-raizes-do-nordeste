import { errorMessage } from "../../utils/error-message";
import { getUnitByIdService } from "../units/find";
import * as CouponRepository from "../../repositories/coupons-repository";
import { findUserById, updatePoints } from "../../repositories/users-repository";
import { RedeemCoupon } from "../../models/coupon-model";
import { createPrivateCouponService } from "./create";

export const redeemCouponService = async (cupom: RedeemCoupon) => {
    try {
        const usuario_existe = await findUserById(cupom.usuario_id);
        const cupom_existe = await CouponRepository.findCouponByCodeAndUnitId(cupom.codigo_id, cupom.unidade_id);
        const unidade_existe = await getUnitByIdService(cupom.unidade_id);

        if(unidade_existe.statusCode !== 200) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "UNIDADE_NAO_ENCONTRADA",
                    "Unidade não encontrada",
                    "/cupons/redeem"
                )
            }
        }

        if(usuario_existe.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "USUARIO_NAO_ENCONTRADO",
                    "Usuário não encontrado",
                    "/cupons/redeem"
                )
            }
        } 

        if (cupom_existe.rows.length === 0) {
            return {
                statusCode: 404,
                content: errorMessage(
                    "CUPOM_NAO_ENCONTRADO",
                    "Cupom não encontrado",
                    "/cupons/redeem"
                )
            }
        }

        if (usuario_existe.rows[0].pontos < cupom_existe.rows[0].valor) {
            return {
                statusCode: 409,
                content: errorMessage(
                    "PONTOS_INSUFICIENTES",
                    "Pontos insuficientes para resgatar este cupom",
                    "/cupons/redeem"
                )
            }
        }

        if (usuario_existe.rows[0].pontos >= cupom_existe.rows[0].valor){
            await updatePoints(cupom.usuario_id, -cupom_existe.rows[0].valor);
            await createPrivateCouponService({
                unidade_id: cupom.unidade_id,
                usuario_id: cupom.usuario_id,
                cupom_id: cupom_existe.rows[0].id
            });

            return {
                statusCode: 201,
                content: { message: "Cupom resgatado com sucesso", cupom: cupom_existe.rows[0] }
            }
        }

        return {
            statusCode: 400,
            content: errorMessage(
                "REQUISICAO_DE_RESGATE_FALHOU",
                "Requisição de resgate de cupom falhou",
                "/cupons/redeem"
            )
        };
        
    } catch(error){
        console.log(error);
        return {
            statusCode: 500,
            content: errorMessage(
                "ERRO_INTERNO_DO_SERVIDOR",
                "Erro interno do servidor",
                "/cupons/redeem"
            )
        }   
    }
}