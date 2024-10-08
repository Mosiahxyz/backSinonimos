# Sinônimos 

Um api que funciona integrada ao projeto mobile, desenvolvido em parceria com o Senai

# Configuração do Ambiente para Projeto Node.js

Para rodar este projeto, é necessário instalar as seguintes ferramentas:

## Pré-requisitos

1. **Node.js** - Para rodar o backend, você precisa ter o [Node.js](https://nodejs.org/) instalado.
   - Versão recomendada: >= 14.x
   - Verifique a instalação com o comando:
     ```bash
     node -v
     ```

2. **NPM ou Yarn** - Você também precisará do NPM (gerenciador de pacotes do Node.js) ou do [Yarn](https://yarnpkg.com/):
   - O NPM já é instalado automaticamente com o Node.js.
   - Verifique a instalação com o comando:
     ```bash
     npm -v
     ```
   - Se preferir instalar o Yarn:
     ```bash
     npm install --global yarn
     ```

3. **Banco de Dados** - Configure o banco de dados necessário para o projeto.
   - O projeto pode usar **MongoDB**, **PostgreSQL**, ou outro banco de dados. Verifique o `.env.example` para definir as variáveis de ambiente.
   - Certifique-se de que o serviço do banco de dados está em execução.

## Instalação de Dependências

Após clonar o repositório, navegue até o diretório do projeto e execute:

```bash
npm install
# ou
yarn install

