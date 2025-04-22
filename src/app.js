import express from 'express';
import setupSwagger from '../swagger.js';
import {setRoutes} from './routes/index.js';

const app = express();
app.use(express.json());
setRoutes(app);
setupSwagger(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${port}!`);
  console.log(`Documentação disponível em /arremato-api-docs`);
});