/**
 * Função para redirecionar o usuário para uma rota específica
 * @param path - Caminho para redirecionar
 */
export function redirectTo(path: string) {
  // Tenta usar o router primeiro
  try {
    // Força um redirecionamento completo para garantir que a página seja recarregada
    window.location.href = path;
  } catch (error) {
    console.error("[redirectTo] Erro ao redirecionar:", error);
    // Fallback para window.location
    window.location.href = path;
  }
} 