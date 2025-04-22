import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Arremato Wallet API',
      version: '1.0.0',
      description: 'API para gerenciamento da carteira de imóveis',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor local',
      },
      {
        url: 'https://arremato-wallet-api-27b8277f775f.herokuapp.com/api',
        description: 'Servidor Homolog',
      },
    ],
  },
  apis: ['./src/routes/index.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default function setupSwagger(app) {
  app.use('/arremato-api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}