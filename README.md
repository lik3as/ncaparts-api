## NCA parts REST application
### 📥 Installation 
```
git clone https://github.com/lik3as/ncaparts-rest
cd ncaparts-rest
```
### 🔗 Instalar Dependências 
- Necessário ```sequelize@6```
```
npm install sequelize-typescript typescript express sequelize pg pg-hstore dotenv
npm install --save-dev @types/node @types/express
```
### Variáveis de ambiente
- A aplicação utiliza o pacote ```dotenv``` para a segurança dos dados.
- Para o uso correto, defina as variáveis corretamente neste arquivo .env
### 🚀 Uso 
#### Adicionar uma nova entidade
1. Modele no arquivo disponibilizado pelo criador do repositório
2. Defina a entidade como tabela no diretório ```models/```
3. Exporte ela direto do arquivo ```models/index.ts```

### Controller para o seu novo Model
1. Crie um novo arquivo de escopo na pasta ```scopes/```
2. Adicione nele os seus métodos de escopos, nomeando seguindo o padrão indicado no arquivo ```scopes/scope-types.ts```
3. Adicione o nome do seu model ao tipo ```method_specific```
4. Crie o arquivo de controller no diretório ```controllers/``` e implemente a interface em ```contracts/IControllers.ts```
