import path, { dirname } from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';

import ENV from '../utils/constants.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const swaggerDomains = ENV.SWAGGER_DOMAINS?.split(',') || [
  'http://localhost:5000'
];

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'User Authentication APIs',
    version: '1.0.0',
    description:
      'A secure and scalable authentication API built with Node.js and Express.js, designed for user management and session handling.',
    contact: {
      name: 'Ajith P Mohan'
    }
  },
  servers: swaggerDomains.map((domain) => ({
    url: `${domain}/api/v1`
  }))
};

const swaggerOptions = {
  swaggerDefinition,
  apis: [path.join(__dirname, '*.yaml')]
  // apis: [path.join(__dirname, '../routes/*.js')] // Path to your route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

function setupSwagger(app) {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCssUrl: ENV.SWAGGER_CSS_URL,
      swaggerOptions: {
        withCredentials: true // Enable withCredentials for Swagger UI requests
      }
    })
  );
}

export default setupSwagger;
