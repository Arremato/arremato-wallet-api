import express from 'express';
import IndexController from '../controllers/index.js';

const router = express.Router();
const indexController = new IndexController();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     responses:
 *       200:
 *         description: Lista de usuários.
 */
router.get('/users', indexController.getUsers.bind(indexController));

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 */
router.post('/users', indexController.createUser.bind(indexController));

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Atualiza informações de um usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 */
router.put('/users', indexController.updateUser.bind(indexController));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login de um usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *       401:
 *         description: Credenciais inválidas.
 */
router.post('/auth/login', indexController.login.bind(indexController));

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: Lista todos os imóveis
 *     responses:
 *       200:
 *         description: Lista de imóveis.
 */
router.get('/properties', indexController.getProperties.bind(indexController));

/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Cria um novo imóvel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               valuation:
 *                 type: number
 *               payment_method:
 *                 type: string
 *               acquisition_date:
 *                 type: string
 *                 format: date
 *               purpose:
 *                 type: string
 *                 enum: [sale, rental, residence]
 *     responses:
 *       201:
 *         description: Imóvel criado com sucesso.
 */
router.post('/properties', indexController.createProperty.bind(indexController));

/**
 * @swagger
 * /processes:
 *   post:
 *     summary: Cria uma nova tarefa para um imóvel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               property_id:
 *                 type: string
 *               activity:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, in progress, completed, blocked]
 *               progress:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *               description:
 *                 type: string
 *               updated_by:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso.
 */
router.post('/processes', indexController.createProcess.bind(indexController));

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Registra uma nova transação financeira
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               property_id:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [expense, income]
 *               date:
 *                 type: string
 *                 format: date
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               receipt:
 *                 type: string
 *               funding_source:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transação registrada com sucesso.
 */
router.post('/transactions', indexController.createTransaction.bind(indexController));

/**
 * @swagger
 * /financial-summary:
 *   get:
 *     summary: Obtém o resumo financeiro do usuário
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Resumo financeiro retornado com sucesso.
 */
router.get('/financial-summary', indexController.getFinancialSummary.bind(indexController));

/**
 * @swagger
 * /loans:
 *   post:
 *     summary: Registra um novo empréstimo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               amount:
 *                 type: number
 *               outstanding_balance:
 *                 type: number
 *               due_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Empréstimo registrado com sucesso.
 */
router.post('/loans', indexController.createLoan.bind(indexController));

/**
 * @swagger
 * /user-properties:
 *   get:
 *     summary: Lista os imóveis do usuário
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de imóveis retornada com sucesso.
 */
router.get('/user-properties', indexController.getUserProperties.bind(indexController));

export function setRoutes(app) {
  app.use('/api', router);
}

export default router;