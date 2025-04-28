import express from 'express';
import IndexController from '../controllers/index.js';
import { authenticateUser } from '../middlewares/index.js';

const router = express.Router();
const indexController = new IndexController();

router.use((req, res, next) => {
  const openRoutes = [
    { method: 'POST', path: '/users' },
    { method: 'POST', path: '/login' },
  ];

  const isOpenRoute = openRoutes.some(
    (route) =>
      route.method === req.method &&
      req.originalUrl.endsWith(route.path) 
  );

  if (isOpenRoute) {
    return next(); 
  }

  authenticateUser(req, res, next); 
});


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     security:
 *       - BearerAuth: []
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
 *     security:
 *       - BearerAuth: []
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
router.post('/login', indexController.login.bind(indexController));

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: Lista todos os imóveis
 *     security:
 *       - BearerAuth: []
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
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               postal_code:
 *                 type: string
 *               address:
 *                 type: string
 *               number:
 *                 type: string
 *               property_type:
 *                 type: string
 *               state:
 *                 type: string
 *               bid_value:
 *                 type: number
 *               market_value:
 *                 type: number
 *               acquisition_date:
 *                 type: string
 *                 format: date
 *               purpose:
 *                 type: string
 *                 enum: [sale, rental, residence]
 *     responses:
 *       201:
 *         description: Imóvel criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 property:
 *                   type: object
 */
router.post('/properties', indexController.createProperty.bind(indexController));

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Cria uma nova tarefa
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               property_id:
 *                 type: string
 *                 description: ID da propriedade à qual a tarefa está vinculada
 *               name:
 *                 type: string
 *                 description: Nome da tarefa
 *               status:
 *                 type: string
 *                 enum: [pending, in progress, completed]
 *                 description: Status inicial da tarefa
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 description: Prioridade da tarefa
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 task:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     property_id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     status:
 *                       type: string
 *                     priority:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 */
router.post('/tasks', indexController.createTask.bind(indexController));

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Exclui uma tarefa
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa excluída com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Tarefa não encontrada ou permissão negada.
 *       403:
 *         description: Permissão negada para excluir a tarefa.
 */
router.delete('/tasks/:id', indexController.deleteTask.bind(indexController));

/**
 * @swagger
 * /tasks/{id}/status:
 *   patch:
 *     summary: Atualiza o status de uma tarefa
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in progress, completed]
 *                 description: Novo status da tarefa
 *     responses:
 *       200:
 *         description: Status da tarefa atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 task:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     property_id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     status:
 *                       type: string
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 */
router.patch('/tasks/:id/status', indexController.updateTaskStatus.bind(indexController));

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Lista todas as tarefas relacionadas ao usuário autenticado
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tarefas retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   property_id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [pending, in progress, completed]
 *                   priority:
 *                     type: string
 *                     enum: [low, medium, high]
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 */
router.get('/tasks', indexController.getTasks.bind(indexController));

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Registra uma nova transação financeira
 *     security:
 *       - BearerAuth: []
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
 * /transactions/{id}:
 *   put:
 *     summary: Atualiza uma transação financeira
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da transação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *       200:
 *         description: Transação atualizada com sucesso.
 */
router.put('/transactions/:id', indexController.updateTransaction.bind(indexController));

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Exclui uma transação financeira
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da transação
 *     responses:
 *       200:
 *         description: Transação excluída com sucesso.
 */
router.delete('/transactions/:id', indexController.deleteTransaction.bind(indexController));

/**
 * @swagger
 * /financial-summary:
 *   get:
 *     summary: Obtém o resumo financeiro do usuário
 *     security:
 *       - BearerAuth: []
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
 *     security:
 *       - BearerAuth: []
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
 *     security:
 *       - BearerAuth: []
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

/**
 * @swagger
 * /expense-types:
 *   get:
 *     summary: Lista todos os tipos de despesas
 *     responses:
 *       200:
 *         description: Lista de tipos de despesas.
 */
router.get('/expense-types', indexController.getExpenseTypes.bind(indexController));

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Lista todas as transações financeiras relacionadas ao usuário
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de transações financeiras.
 */
router.get('/transactions', indexController.getTransactions.bind(indexController));

export function setRoutes(app) {
  app.use('/api', router);
}

export default router;