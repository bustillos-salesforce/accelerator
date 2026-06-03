# Permission Set Cleaner 🧹

O `PermissionSetCleanService` é o componente responsável pela última etapa do fluxo de migração. Seu objetivo é otimizar os arquivos `.permissionset-meta.xml` gerados, removendo declarações de permissões negativas ou redundantes.

## 🧠 Lógica de Funcionamento

Diferente dos Profiles, que costumam carregar a estrutura completa de permissões (mesmo as marcadas como `false`), os **Permission Sets** seguem o princípio de privilégio mínimo. Se uma permissão não está explicitamente concedida (como `true`), ela não precisa constar no XML.

O Cleaner executa os seguintes passos:
1. **Leitura**: Localiza todos os arquivos na pasta `permissionsets/` do diretório de metadados.
2. **Parsing**: Converte o XML em um objeto JSON gerenciável.
3. **Filtragem Dinâmica**: Percorre as chaves definidas no arquivo de configuração `permission-set-clean-rules.json`.
4. **Remoção**: Para cada entrada (ex: um campo específico em `fieldPermissions`), o serviço verifica se **pelo menos uma** das chaves de acesso (como `readable` ou `editable`) é verdadeira. Se todas forem falsas, a entrada inteira é deletada.
5. **Reconstrução**: Gera um novo XML limpo e formatado.

## ⚙️ Configuração de Regras

As regras de limpeza estão centralizadas em `/src/core/services/permission-set-clean-rules.json`. Este arquivo mapeia qual nó do XML deve ser verificado e quais atributos definem a "positividade" da permissão:

```json
{
    "fieldPermissions": ["readable", "editable"],
    "tabSettings": ["visibility"],
    "applicationVisibilities": ["visible"]
}
```
*   **Chave (ex: `fieldPermissions`)**: O nome da tag XML pai.
*   **Valor (ex: `["readable", "editable"]`)**: As propriedades que, se forem todas falsas (ou nulas), resultam na exclusão do item.

## 📊 Exemplos de Limpeza

### Antes (XML Sujo/Original)
```xml
<fieldPermissions>
    <editable>false</editable>
    <field>Account.AccountNumber</field>
    <readable>false</readable>
</fieldPermissions>
```

### Depois (Otimizado)
*O nó acima é removido por completo, pois não concede nenhum acesso real.*

## 📈 Logs e Estatísticas

Ao final de cada limpeza, o serviço emite um log informando a eficácia da otimização:

`[INFO] Otimizado: PS_Sales_Profile.permissionset-meta.xml | Entradas removidas: 15 (fieldPermissions: 10, recordTypeVisibilities: 5)`

## 🚀 Benefícios
* **Performance**: Deploy de metadados mais rápido devido ao tamanho reduzido dos arquivos.
* **Legibilidade**: Facilita a revisão de código em Pull Requests, focando apenas no que mudou de fato.

## 🛠️ Como Estender as Regras

Para adicionar suporte a novos metadados, basta editar o arquivo `permission-set-clean-rules.json`:

1. Identifique a tag XML pai (ex: `externalDataSourceAccesses`).
2. Identifique quais campos internos definem se o acesso está ativo (ex: `enabled`).
3. Adicione a nova regra ao JSON: `"externalDataSourceAccesses": ["enabled"]`.

O serviço processará a nova regra automaticamente na próxima execução.