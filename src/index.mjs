// import 'dotenv/config';
import * as core from '@actions/core';
import { loadStackFile } from './load-stack-file.mjs';
import { replaceTemplateVariables } from './replace-template-variables.mjs';
import { deploy } from './deploy.mjs';

async function processStackFile({ stackDefinitionFile, templateVariables }) {
  if (!stackDefinitionFile) {
    console.error('Erro: parâmetro --stack-file é obrigatório');
    process.exit(1);
  }

  if (!templateVariables) {
    console.warn(
      'Aviso: nenhuma variável de template (--template-vars) especificada'
    );
  }
  const processedContent = replaceTemplateVariables(
    stackDefinitionFile,
    templateVariables
  );

  return processedContent;
}

export const run = async () => {
  const portainerHost = core.getInput('portainer-host', {
    required: true,
  });
  const portainerApiKey = core.getInput('portainer-api-key', {
    required: true,
  });
  const stackName = core.getInput('stack-name', {
    required: true,
  });
  const stackDefinitionFile = core.getInput('stack-definition', {
    required: true,
  });
  const templateVariables = core.getInput('template-variables', {
    required: false,
  });
  const stackFile = await processStackFile({
    stackFilePath: stackDefinitionFile,
    templateVariables,
  });
  const result = await deploy({
    host: portainerHost,
    apiKey: portainerApiKey,
    stackName: stackName,
    stackFile,
  });
  return result;
};

run();
