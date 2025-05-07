import path from 'path';
import fs from 'fs';

/**
 * Carrega o conteúdo do arquivo de stack
 * @param {string} stackFilePath - Caminho para o arquivo de stack
 * @returns {string} - Conteúdo do arquivo
 */
export function loadStackFile(stackFilePath) {
  // Resolver caminho absoluto do arquivo
  const resolvedPath = path.isAbsolute(stackFilePath)
    ? stackFilePath
    : path.resolve(process.cwd(), stackFilePath);

  try {
    // Verificar se o arquivo existe
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Arquivo não encontrado: ${resolvedPath}`);
    }

    // Ler conteúdo do arquivo
    const content = fs.readFileSync(resolvedPath, 'utf-8');
    return content;
  } catch (error) {
    console.error('Erro ao carregar arquivo:', error.message);
    process.exit(1);
  }
}
