import express from 'express';
import cors from 'cors';
import setupSwagger from '../swagger.js';
import {setRoutes} from './routes/index.js';

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://arremato-front-b3e87156c692.herokuapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
setRoutes(app);
setupSwagger(app);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}!`);
  console.log(`Documentação disponível em /arremato-api-docs`);
});