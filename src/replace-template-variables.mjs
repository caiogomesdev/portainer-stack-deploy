/**
 * @param {string} content
 * @param {Object} variables
 * @returns {string}
 */
export function replaceTemplateVariables(content, variables) {
  // Validar entrada
  if (!content) {
    console.warn('Conteúdo vazio fornecido para substituição');
    return '';
  }

  if (!variables || typeof variables !== 'object') {
    console.warn(
      `Nenhuma variável de template válida fornecida: ${JSON.stringify(
        variables
      )}`
    );
    return content;
  }

  let result = content;
  let replacementCount = 0;

  try {
    // Realizar substituições para cada variável
    Object.entries(variables).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        console.warn(
          `Valor indefinido para a chave "${key}", pulando substituição`
        );
        return;
      }

      const placeholder = `{{${key}}}`;
      const stringValue = String(value); // Converter para string em caso de números

      // Usar abordagem mais direta para substituição
      const parts = result.split(placeholder);
      if (parts.length > 1) {
        result = parts.join(stringValue);
        replacementCount += parts.length - 1;
      }
    });
    return result;
  } catch (error) {
    console.error(`Erro durante substituição de variáveis: ${error.message}`);
    return content; // Retornar conteúdo original em caso de erro
  }
}
