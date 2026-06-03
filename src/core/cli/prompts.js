const inquirer = require('inquirer');
const sfCli = require('../infra/SfCli');
const logger = require('../infra/Logger');

/**
 * Resolve a org alvo. Se não for passada via flag, abre um prompt interativo.
 * @param {string} targetOrgFlag - O valor da flag --target-org (se existir).
 * @returns {Promise<string>} O alias ou username da org selecionada.
 */
async function resolveTargetOrg(targetOrgFlag) {
    if (targetOrgFlag) {
        return targetOrgFlag;
    }

    logger.info('Nenhuma org informada. Buscando orgs autenticadas...');
    const result = await sfCli.run('sf org list --json');

    if (result.exitCode !== 0) {
        await logger.errorWithStack('Prompts:resolveTargetOrg', result.stderr);
        const detailedErrorMsg = `Falha ao listar orgs do Salesforce via CLI. Detalhes: ${result.stderr}`;
        throw new Error(detailedErrorMsg);
    }

    const data = JSON.parse(result.stdout);
    const allOrgs = [
        ...(data.result.nonScratchOrgs || []),
        ...(data.result.scratchOrgs || [])
    ];

    if (allOrgs.length === 0) {
        throw new Error('Nenhuma org autenticada encontrada. Use "sf org login web" para autenticar uma org.');
    }

    const choices = allOrgs.map(org => ({
        name: org.alias ? `${org.alias} (${org.username})` : org.username,
        value: org.alias || org.username
    }));

    const { selectedOrg } = await inquirer.default.prompt([
        {
            type: 'select',
            name: 'selectedOrg',
            message: 'Selecione a Org alvo:',
            choices
        }
    ]);

    return selectedOrg;
}

module.exports = { resolveTargetOrg };