import express from 'express';
import setupSwagger from '../swagger.js';
import {setRoutes} from './routes/index.js';

const app = express();
app.use(express.json());
setRoutes(app);
setupSwagger(app);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:3000`);
  console.log(`Documentação disponível em http://localhost:3000/api-docs`);
});