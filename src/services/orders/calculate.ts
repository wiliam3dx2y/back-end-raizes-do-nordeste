import * as MenuRepository from "../../repositories/menus-repository";

export const calculateOrderTotal = async (items: { produto_id: string; quantidade: number; }[]) => {
    let total = 0;
    for (const item of items) {
        const productResult = await MenuRepository.findProductById(item.produto_id);
        if (productResult.rows.length > 0) {
            const product = productResult.rows[0];
            total += product.preco * item.quantidade;
        }
    }
    return total;
}