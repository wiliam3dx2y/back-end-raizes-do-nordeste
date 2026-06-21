
export interface Payment {
    id?: string;
    unidadeId: string;
    pedidoId: string;
    metodoPagamento: string;
    valor: number;
    status: string;
}