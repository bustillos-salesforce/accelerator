FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Evita prompts interativos durante a instalação
ENV DEBIAN_FRONTEND=noninteractive

# Instalar o Salesforce CLI globalmente
RUN npm install -g @salesforce/cli

# Definir versão do PMD
ARG PMD_VERSION=7.0.0

# Instalar dependências básicas e baixar/configurar PMD
RUN apt-get update && apt-get install -y wget unzip \
    && wget https://github.com/pmd/pmd/releases/download/pmd_releases%2F${PMD_VERSION}/pmd-dist-${PMD_VERSION}-bin.zip \
    && unzip pmd-dist-${PMD_VERSION}-bin.zip -d /opt \
    && mv /opt/pmd-bin-${PMD_VERSION} /opt/pmd \
    && rm pmd-dist-${PMD_VERSION}-bin.zip \
    && ln -s /opt/pmd/bin/pmd /usr/local/bin/pmd

# Limpeza de cache do apt
RUN apt-get clean && rm -rf /var/lib/apt/lists/*