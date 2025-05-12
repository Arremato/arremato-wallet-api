import express from 'express';
import { authenticateUser } from '../middlewares/index.js';
import IndexController from '../controllers/index.js';
import UserController from '../controllers/userController.js';
import AuthController from '../controllers/authController.js'
import PropertiesController from '../controllers/propertiesController.js'
import TasksController from '../controllers/tasksController.js'
import TransactionController from '../controllers/transactionsController.js'
import CategoryController from '../controllers/categoryController.js';
import PropertyConstructionsController from '../controllers/propertyConstructionsController.js';

const router = express.Router();
const indexController = new IndexController();
const authController = new AuthController();
const userController = new UserController();
const propertiesController = new PropertiesController();
const tasksController = new TasksController();
const transactionController = new TransactionController();
const categoryController = new CategoryController();
const propertyConstructionsController = new PropertyConstructionsController();

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
router.get('/users', userController.getUsers.bind(userController));

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
router.post('/users', userController.createUser.bind(userController));

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
router.put('/users', userController.updateUser.bind(userController));

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
router.post('/login', authController.login.bind(authController));

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
router.get('/properties', propertiesController.getProperties.bind(propertiesController));

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
router.post('/properties', propertiesController.createProperty.bind(propertiesController));

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
router.post('/tasks', tasksController.createTask.bind(tasksController));

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
router.delete('/tasks/:id', tasksController.deleteTask.bind(tasksController));

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
router.patch('/tasks/:id/status', tasksController.updateTaskStatus.bind(tasksController));

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
router.get('/tasks', tasksController.getTasks.bind(tasksController));

/**
 * @swagger
 * /tasks/property/{id}:
 *   get:
 *     summary: Lista todas as tarefas relacionadas a um imóvel
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do imóvel
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
 *       403:
 *         description: Permissão negada para acessar as tarefas do imóvel.
 *       404:
 *         description: Imóvel não encontrado.
 */
router.get('/tasks/property/:id', tasksController.getPropertyTasks.bind(tasksController));

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Atualiza uma tarefa existente
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
 *               name:
 *                 type: string
 *                 description: Nome da tarefa
 *               status:
 *                 type: string
 *                 enum: [pending, in progress, completed]
 *                 description: Status da tarefa
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 description: Prioridade da tarefa
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso.
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
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       403:
 *         description: Permissão negada para editar a tarefa.
 *       404:
 *         description: Tarefa não encontrada.
 */
router.put('/tasks/:id', tasksController.updateTask.bind(tasksController));

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
 *                 description: ID do imóvel relacionado (pode ser NULL)
 *               type:
 *                 type: string
 *                 enum: [expense, income]
 *                 description: Tipo da transação (despesa ou receita)
 *               category_id:
 *                 type: string
 *                 description: ID da categoria da transação
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Data da transação
 *               amount:
 *                 type: number
 *                 description: Valor da transação
 *               status:
 *                 type: string
 *                 enum: [paid, pending]
 *                 description: Status da transação
 *               payment_method:
 *                 type: string
 *                 enum: [cash, financed, installment]
 *                 description: Método de pagamento
 *               total_installments:
 *                 type: integer
 *                 description: Total de parcelas (se parcelado)
 *               current_installment:
 *                 type: integer
 *                 description: Parcela atual (se parcelado)
 *               parent_id:
 *                 type: string
 *                 description: ID da transação "mãe" (se parcelado)
 *               description:
 *                 type: string
 *                 description: Descrição opcional da transação
 *               installment_value:
 *                 type: number
 *                 description: Valor da parcela (se parcelado)
 *     responses:
 *       201:
 *         description: Transação registrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 transaction:
 *                   type: object
 */
router.post('/transactions', transactionController.createTransaction.bind(transactionController));

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Atualiza uma transação financeira existente
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da transação financeira
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               property_id:
 *                 type: string
 *                 description: ID do imóvel relacionado (pode ser NULL)
 *               type:
 *                 type: string
 *                 enum: [expense, income]
 *                 description: Tipo da transação (despesa ou receita)
 *               category_id:
 *                 type: string
 *                 description: ID da categoria da transação
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Data da transação
 *               amount:
 *                 type: number
 *                 description: Valor da transação
 *               status:
 *                 type: string
 *                 enum: [paid, pending]
 *                 description: Status da transação
 *               payment_method:
 *                 type: string
 *                 enum: [cash, financed, installment]
 *                 description: Método de pagamento
 *               total_installments:
 *                 type: integer
 *                 description: Total de parcelas (se parcelado)
 *               current_installment:
 *                 type: integer
 *                 description: Parcela atual (se parcelado)
 *               parent_id:
 *                 type: string
 *                 description: ID da transação "mãe" (se parcelado)
 *               description:
 *                 type: string
 *                 description: Descrição opcional da transação
 *               installment_value:
 *                 type: number
 *                 description: Valor da parcela (se parcelado)
 *     responses:
 *       200:
 *         description: Transação atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 transaction:
 *                   type: object
 */
router.put('/finances/:id', transactionController.updateFinance.bind(transactionController));

/**
 * @swagger
 * /finances/{id}:
 *   delete:
 *     summary: Exclui uma transação financeira ou todas as parcelas relacionadas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da transação financeira
 *     responses:
 *       200:
 *         description: Transação excluída com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Permissão negada para excluir a transação.
 *       404:
 *         description: Transação não encontrada.
 */
router.delete('/finances/:id', transactionController.deleteFinance.bind(transactionController));

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
router.get('/financial-summary', transactionController.getFinancialSummary.bind(transactionController));

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
router.get('/user-properties', propertiesController.getUserProperties.bind(propertiesController));

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
router.get('/transactions', transactionController.getTransactions.bind(transactionController));

/**
 * @swagger
 * /finances:
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
 *                 description: ID do imóvel relacionado (pode ser NULL)
 *               type:
 *                 type: string
 *                 enum: [expense, income]
 *                 description: Tipo da transação (despesa ou receita)
 *               category_id:
 *                 type: string
 *                 description: ID da categoria da transação
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Data da transação
 *               amount:
 *                 type: number
 *                 description: Valor da transação
 *               status:
 *                 type: string
 *                 enum: [paid, pending]
 *                 description: Status da transação
 *               payment_method:
 *                 type: string
 *                 enum: [cash, financed, installment]
 *                 description: Método de pagamento
 *               total_installments:
 *                 type: integer
 *                 description: Total de parcelas (se parcelado)
 *               current_installment:
 *                 type: integer
 *                 description: Parcela atual (se parcelado)
 *               parent_id:
 *                 type: string
 *                 description: ID da transação "mãe" (se parcelado)
 *               description:
 *                 type: string
 *                 description: Descrição opcional da transação
 *               installment_value:
 *                 type: number
 *                 description: Valor da parcela (se parcelado)
 *     responses:
 *       201:
 *         description: Transação registrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 transaction:
 *                   type: object
 */
router.post('/finances', transactionController.createFinance.bind(transactionController));

/**
 * @swagger
 * /finances/installments:
 *   post:
 *     summary: Registra uma nova despesa parcelada
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
 *                 description: ID do imóvel relacionado (pode ser NULL)
 *               type:
 *                 type: string
 *                 enum: [expense]
 *                 description: Tipo da transação (apenas despesa permitida)
 *               category_id:
 *                 type: string
 *                 description: ID da categoria da transação
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Data inicial da transação
 *               amount:
 *                 type: number
 *                 description: Valor total da despesa
 *               total_installments:
 *                 type: integer
 *                 description: Total de parcelas
 *               description:
 *                 type: string
 *                 description: Descrição opcional da transação
 *     responses:
 *       201:
 *         description: Despesas parceladas registradas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       installment_value:
 *                         type: number
 *                         description: Valor da parcela
 */
router.post('/finances/installments', transactionController.createInstallmentFinance.bind(transactionController));

/**
 * @swagger
 * /finances:
 *   get:
 *     summary: Lista todas as transações financeiras relacionadas ao usuário autenticado
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de transações financeiras retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   property_id:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [expense, income]
 *                   category_id:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   amount:
 *                     type: number
 *                   status:
 *                     type: string
 *                     enum: [paid, pending]
 *                   payment_method:
 *                     type: string
 *                     enum: [cash, financed, installment]
 *                   total_installments:
 *                     type: integer
 *                   current_installment:
 *                     type: integer
 *                   parent_id:
 *                     type: string
 *                   description:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 */
router.get('/finances', transactionController.getUserFinances.bind(transactionController));

/**
 * @swagger
 * /finances/property/{property_id}:
 *   get:
 *     summary: Lista todas as transações financeiras relacionadas a um imóvel
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: property_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do imóvel
 *     responses:
 *       200:
 *         description: Lista de transações financeiras retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   property_id:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [expense, income]
 *                   category_id:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date
 *                   amount:
 *                     type: number
 *                   status:
 *                     type: string
 *                     enum: [paid, pending]
 *                   payment_method:
 *                     type: string
 *                     enum: [cash, financed, installment]
 *                   total_installments:
 *                     type: integer
 *                   current_installment:
 *                     type: integer
 *                   parent_id:
 *                     type: string
 *                   description:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 */
router.get('/finances/property/:property_id', transactionController.getPropertyFinances.bind(transactionController));

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lista todas as categorias
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 */
router.get('/categories', categoryController.getCategories.bind(categoryController));

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Cria uma nova categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome da categoria
 *               description:
 *                 type: string
 *                 description: Descrição da categoria
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 */
router.post('/categories', categoryController.createCategory.bind(categoryController));

/**
 * @swagger
 * /constructions:
 *   post:
 *     summary: Cria uma nova construção
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
 *                 description: ID do imóvel relacionado
 *               budget:
 *                 type: number
 *                 description: Orçamento da construção
 *               spent:
 *                 type: number
 *                 description: Valor gasto na construção
 *               delivery_days:
 *                 type: integer
 *                 description: Dias para entrega
 *               responsible_name:
 *                 type: string
 *                 description: Nome do responsável
 *               responsible_phone:
 *                 type: string
 *                 description: Telefone do responsável
 *               status:
 *                 type: string
 *                 description: Status da construção
 *     responses:
 *       201:
 *         description: Construção criada com sucesso.
 */
router.post('/constructions', propertyConstructionsController.createConstruction.bind(propertyConstructionsController));

/**
 * @swagger
 * /constructions/{id}:
 *   put:
 *     summary: Atualiza uma construção existente
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da construção
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               budget:
 *                 type: number
 *                 description: Orçamento da construção
 *               spent:
 *                 type: number
 *                 description: Valor gasto na construção
 *               delivery_days:
 *                 type: integer
 *                 description: Dias para entrega
 *               responsible_name:
 *                 type: string
 *                 description: Nome do responsável
 *               responsible_phone:
 *                 type: string
 *                 description: Telefone do responsável
 *               status:
 *                 type: string
 *                 description: Status da construção
 *     responses:
 *       200:
 *         description: Construção atualizada com sucesso.
 */
router.put('/constructions/:id', propertyConstructionsController.updateConstruction.bind(propertyConstructionsController));

/**
 * @swagger
 * /constructions/{id}:
 *   delete:
 *     summary: Exclui uma construção existente
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da construção
 *     responses:
 *       200:
 *         description: Construção excluída com sucesso.
 */
router.delete('/constructions/:id', propertyConstructionsController.deleteConstruction.bind(propertyConstructionsController));

/**
 * @swagger
 * /constructions:
 *   get:
 *     summary: Lista todas as construções relacionadas aos imóveis do usuário autenticado
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de construções retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   property_id:
 *                     type: string
 *                   budget:
 *                     type: number
 *                   spent:
 *                     type: number
 *                   delivery_days:
 *                     type: integer
 *                   responsible_name:
 *                     type: string
 *                   responsible_phone:
 *                     type: string
 *                   status:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 */
router.get('/constructions', propertyConstructionsController.getConstructions.bind(propertyConstructionsController));

/**
 * @swagger
 * /constructions/property/{property_id}:
 *   get:
 *     summary: Lista todas as construções relacionadas a um imóvel específico
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: property_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do imóvel
 *     responses:
 *       200:
 *         description: Lista de construções retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   property_id:
 *                     type: string
 *                   budget:
 *                     type: number
 *                   spent:
 *                     type: number
 *                   delivery_days:
 *                     type: integer
 *                   responsible_name:
 *                     type: string
 *                   responsible_phone:
 *                     type: string
 *                   status:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       403:
 *         description: Permissão negada para acessar as construções do imóvel.
 *       404:
 *         description: Imóvel não encontrado.
 */
router.get('/constructions/property/:property_id', propertyConstructionsController.getConstructionsByProperty.bind(propertyConstructionsController));

export function setRoutes(app) {
  app.use('/api', router);
}

export default router;