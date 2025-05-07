/**
 * Processa os argumentos da linha de comando
 * Suporta argumentos com valores em múltiplas linhas
 */
export function parseArguments() {
  const args = {};
  let currentKey = null;
  let currentValue = '';

  // Percorrer todos os argumentos
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];

    // Se começa com -- e não estamos processando um valor, é uma nova chave
    if (arg.startsWith('--') && !currentKey) {
      // Encontra apenas a primeira ocorrência de =
      const equalIndex = arg.indexOf('=');

      if (equalIndex === -1) {
        // Se não tem =, começamos a capturar o valor
        currentKey = arg.substring(2);
        currentValue = '';
      } else {
        // Extrai a chave (key) e o valor completo após o primeiro =
        const key = arg.substring(2, equalIndex);
        const value = arg.substring(equalIndex + 1); // Preserva todos os caracteres após o =
        args[key] = value;
      }
    }
    // Se estamos processando um valor multi-linha
    else if (currentKey) {
      // Se encontramos outro argumento começando com --, terminamos o valor atual
      if (arg.startsWith('--')) {
        // Salvar o valor anterior
        try {
          // Tentar converter para JSON se parecer JSON
          if (
            currentValue.trim().startsWith('{') &&
            currentValue.trim().endsWith('}')
          ) {
            args[currentKey] = JSON.parse(currentValue);
          } else {
            args[currentKey] = currentValue;
          }
        } catch (e) {
          args[currentKey] = currentValue;
        }

        // Começar novo argumento - usar indexOf em vez de split
        const equalIndex = arg.indexOf('=');
        if (equalIndex === -1) {
          currentKey = arg.substring(2);
          currentValue = '';
        } else {
          const key = arg.substring(2, equalIndex);
          const value = arg.substring(equalIndex + 1);
          args[key] = value;
          currentKey = null;
        }
      } else {
        // Continuar acumulando o valor
        currentValue += (currentValue ? ' ' : '') + arg;
      }
    }
  }

  // Se terminou com um valor sendo processado
  if (currentKey) {
    try {
      // Tentar converter para JSON se parecer JSON
      if (
        currentValue.trim().startsWith('{') &&
        currentValue.trim().endsWith('}')
      ) {
        args[currentKey] = JSON.parse(currentValue);
      } else {
        args[currentKey] = currentValue;
      }
    } catch (e) {
      args[currentKey] = currentValue;
    }
  }

  return args;
}
