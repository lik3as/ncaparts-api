export default interface IMercadoria{
  produto: string,
  skus_relacionados: string,
  kit: string | null,
  importada: boolean,
  disponivel: boolean,
  valor_real: number,
  valor_real_revenda: number | null,
}