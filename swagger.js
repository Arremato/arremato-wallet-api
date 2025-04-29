import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Arremato Wallet API',
    version: '1.15.4',
    description: 'API para gerenciamento de propriedades.',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Local server',
    },
    {
      url: 'https://arremato-wallet-api-27b8277f775f.herokuapp.com/api',
      description: 'Online server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/index.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default function setupSwagger(app) {
  app.use('/arremato-api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}