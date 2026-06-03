# Accelerator CLI 🚀

**Accelerator** é uma ferramenta de linha de comando (CLI) desenvolvida em Node.js para automatizar a complexa tarefa de migração de **Profiles** para **Permission Sets** no ecossistema Salesforce.

O objetivo principal é facilitar a transição para o modelo de permissões baseado em "Least Privilege" (Menor Privilégio), seguindo as melhores práticas da Salesforce, realizando não apenas a conversão, mas também a limpeza e otimização dos arquivos XML resultantes.

## 📋 Funcionalidades

O comando principal `profile-to-ps` (ou o alias `p2ps`) executa um fluxo de 4 etapas:

1.  **Listagem**: Identifica todos os Profiles customizados na Org selecionada.
2.  **Retrieve**: Baixa os arquivos XML dos Profiles em lotes (batches) para garantir estabilidade.
3.  **Conversão**: Utiliza o plugin Shane para transformar os Profiles em Permission Sets.
4.  **Limpeza**: Otimiza os Permission Sets removendo entradas redundantes ou de acesso negado (`false`), mantendo o repositório limpo.

## ⚙️ Pré-requisitos

Antes de usar o Accelerator, certifique-se de ter instalado:

*   **Node.js**: Versão 18 ou superior.
*   **Salesforce CLI (`sf`)**: Instalado e atualizado.
*   **Plugins do Salesforce CLI**:
    *   `shane-sfdx-plugins`
    *   `sfdx-plugin-source-read`

O Accelerator validará a presença desses plugins ao iniciar. Caso não os tenha, instale-os com:
```bash
sf plugins install shane-sfdx-plugins
sf plugins install sfdx-plugin-source-read
```

## 🚀 Instalação

Para utilizar o comando globalmente no seu sistema enquanto desenvolve:

1.  Acesse o diretório do projeto:
    ```bash
    cd /accelerator
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Crie o link global:
    ```bash
    npm link
    ```

Agora você pode chamar `accelerator` de qualquer diretório dentro do seu computador.

## 🛠️ Como usar

### Fluxo Completo

Para executar a migração completa:
```bash
accelerator p2ps -o NomeDaMinhaOrg
```
*Se você omitir o `-o`, a CLI abrirá um menu interativo para você escolher entre suas Orgs conectadas.*

### Opções e Flags

*   `-o, --target-org <alias>`: Define a Org alvo para consulta e retrieve.
*   `-d, --source-dir <path>`: Caminho para o diretório de metadados (Default: `./force-app/main/default/`).
*   `--skip-query`: Pula a etapa 1 (assume que o JSON de profiles já existe em `./temp`).
*   `--skip-retrieve`: Pula a etapa 2 (assume que os XMLs dos profiles já estão em `./temp/profiles`).

### Sub-comandos (Uso isolado)

Você também pode executar as etapas individualmente para testes ou correções pontuais:

*   **Listar:** `accelerator p2ps list -o MyOrg`
*   **Baixar:** `accelerator p2ps retrieve -o MyOrg`
*   **Converter:** `accelerator p2ps convert -d ./force-app/main/default/`
*   **Limpar XMLs:** `accelerator p2ps clean -d ./force-app/main/default/`

## 📂 Estrutura de Arquivos Gerados

Durante a execução, a ferramenta utiliza um diretório temporário `./temp` que é limpo automaticamente ao final do processo (com sucesso ou falha):

*   `temp/profiles_to_migrate.json`: Lista de profiles identificados.
*   `temp/profiles/`: Arquivos XML recuperados da Org.

## 🧹 Regras de Limpeza (Etapa 4)

A etapa de limpeza remove automaticamente os seguintes nós dos Permission Sets se o acesso for desativado, reduzindo o tamanho dos arquivos em até 70%:

*   `fieldPermissions` onde `readable` e `editable` são false.
*   `objectPermissions` onde todas as permissões (read, create, etc) são false.
*   `userPermissions`, `classAccesses` e `pageAccesses` onde `enabled` é false.
*   `tabSettings` onde a visibilidade é `None`.

## 📝 Logs e Diagnóstico

Caso ocorra algum erro, a CLI exibirá a mensagem no terminal e registrará o stack trace completo no arquivo `error.log` na raiz onde o comando foi executado.

---
**Nota**: Esta ferramenta foi desenhada para ser executada na raiz de um projeto Salesforce DX (onde se encontra o arquivo `sfdx-project.json`).