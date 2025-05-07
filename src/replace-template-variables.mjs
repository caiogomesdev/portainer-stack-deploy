import * as core from '@actions/core';
import Handlebars from 'handlebars';
import path from 'path';
import fs from 'fs';

/**
 * @param {string} stackDefinitionFile
 * @param {Object} templateVariables
 * @returns {string}
 */
export function replaceTemplateVariables(
  stackDefinitionFile,
  templateVariables
) {
  const stackDefFilePath = path.join(
    process.env.GITHUB_WORKSPACE,
    stackDefinitionFile
  );
  core.info(`Reading stack definition file from ${stackDefFilePath}`);
  let stackDefinition = fs.readFileSync(stackDefFilePath, 'utf8');
  if (!stackDefinition) {
    throw new Error(
      `Could not find stack-definition file: ${stackDefFilePath}`
    );
  }
  if (templateVariables) {
    core.info(
      `Applying template variables for keys: ${Object.keys(templateVariables)}`
    );
    stackDefinition = Handlebars.compile(stackDefinition)(templateVariables);
  }
  core.info(`No new image provided. Will use image in stack definition.`);
  core.info(templateVariables);
  core.info(stackDefinition);
  return stackDefinition;
}
