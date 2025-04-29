import supabase from '../services/supabaseClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class IndexController {
  async getUsers(req, res) {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createUser(req, res) {
    const { name, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const { data, error } = await supabase
        .from('users')
        .insert([{ name, email, password: hashedPassword }])
        .select();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(201).json({ message: 'Usuário criado com sucesso.', user: data[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProperties(req, res) {
    try {
      const userId = req.user.id;

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserProperties(req, res) {
    try {
      const userId = req.user.id;

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createProperty(req, res) {
    const {
      name,
      postal_code,
      address,
      number,
      property_type,
      state,
      bid_value,
      market_value,
      itbi,
      registration,
      purchased_alone,
      investor_name,
      invested_amount,
      monthly_condo_fee,
      annual_iptu,
      condo_debt,
      iptu_debt,
      other_debts,
      broker_name,
      broker_commission,
      expected_months_to_sell,
      expected_renovation_cost,
      taxation_type,
      acquisition_date,
      purpose,
      payment_method, // Novo campo
      down_payment, // Novo campo
      installments, // Novo campo
      installment_value, // Novo campo
      auction_origin, // Novo campo
      legal_status, // Novo campo
      registered_in // Novo campo
    } = req.body;

    try {
      const userId = req.user.id;

      const { data, error } = await supabase
        .from('properties')
        .insert([{
          user_id: userId,
          name,
          postal_code,
          address,
          number,
          property_type,
          state,
          bid_value,
          market_value,
          itbi,
          registration,
          purchased_alone,
          investor_name,
          invested_amount,
          monthly_condo_fee,
          annual_iptu,
          condo_debt,
          iptu_debt,
          other_debts,
          broker_name,
          broker_commission,
          expected_months_to_sell,
          expected_renovation_cost,
          taxation_type,
          acquisition_date,
          purpose,
          payment_method, // Novo campo
          down_payment, // Novo campo
          installments, // Novo campo
          installment_value, // Novo campo
          auction_origin, // Novo campo
          legal_status, // Novo campo
          registered_in // Novo campo
        }])
        .select();

      if (error) {
        console.error('Erro ao cadastrar imóvel:', error);
        return res.status(400).json({ error: error.message });
      }

      res.status(201).json({ message: 'Imóvel cadastrado com sucesso.', property: data[0] });
    } catch (error) {
      console.error('Erro no servidor:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async createProcess(req, res) {
    const { property_id, activity, status, progress, description, updated_by } = req.body;

    try {
      const { data, error } = await supabase
        .from('processes')
        .insert([{ property_id, activity, status, progress, description, updated_by }]);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(201).json({ message: 'Processo criado com sucesso.', process: data[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createTransaction(req, res) {
    const { property_id, type, date, amount, category, description, receipt, funding_source } = req.body;

    try {
      const userId = req.user.id;

      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('id')
        .eq('id', property_id)
        .eq('user_id', userId)
        .single();

      if (propertyError || !property) {
        return res.status(403).json({ error: 'Você não tem permissão para adicionar transações a esta propriedade.' });
      }

      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([{ property_id, type, date, amount, category, description, receipt, funding_source }])
        .select(); 

      if (error) {
        console.error('Erro ao salvar transação:', error);
        return res.status(400).json({ error: error.message });
      }

      if (!data || data.length === 0) {
        return res.status(500).json({ error: 'Erro ao salvar transação. Nenhum dado retornado.' });
      }

      res.status(201).json({ message: 'Transação criada com sucesso.', transaction: data[0] });
    } catch (error) {
      console.error('Erro no servidor:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getFinancialSummary(req, res) {
    try {
      const userId = req.user.id;

      const { data, error } = await supabase.rpc('get_financial_summary', { user_id: userId });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createLoan(req, res) {
    const { amount, outstanding_balance, due_date } = req.body;

    try {
      const userId = req.user.id;

      const { data, error } = await supabase
        .from('loans')
        .insert([{ user_id: userId, amount, outstanding_balance, due_date }]);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(201).json({ message: 'Empréstimo criado com sucesso.', loan: data[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUser(req, res) {
    const { name, email, password } = req.body;
    const userId = req.user.id;

    try {
      const updates = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (password) updates.password = await bcrypt.hash(password, 10);

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (data.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      res.status(200).json({ message: 'Usuário atualizado com sucesso.', user: data[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, password')
        .eq('email', email)
        .single();

      if (error) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
      }

      const isPasswordValid = await bcrypt.compare(password, data.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
      }

      const token = jwt.sign({ id: data.id, email: data.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      res.status(200).json({ token, user: { id: data.id, name: data.name, email: data.email } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getExpenseTypes(req, res) {
    try {
      const { data, error } = await supabase.from('expense_types').select('*');

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTransactions(req, res) {
    try {
      const userId = req.user.id;

      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id')
        .eq('user_id', userId);

      if (propertiesError) {
        return res.status(500).json({ error: propertiesError.message });
      }
      const propertyIds = properties.map((property) => property.id);

      const { data: transactions, error: transactionsError } = await supabase
        .from('financial_transactions')
        .select(`
          id,
          property_id,
          type,
          date,
          amount,
          category,
          description,
          receipt,
          funding_source,
          properties (name, location)  -- Inclui informações da propriedade relacionada
        `)
        .in('property_id', propertyIds);

      if (transactionsError) {
        return res.status(500).json({ error: transactionsError.message });
      }

      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteTransaction(req, res) {
    const { id } = req.params; // ID da transação a ser excluída

    try {
      const userId = req.user.id;

      // Verifica se a transação pertence a uma propriedade do usuário autenticado
      const { data: transaction, error: transactionError } = await supabase
        .from('financial_transactions')
        .select('property_id')
        .eq('id', id)
        .single();

      if (transactionError || !transaction) {
        return res.status(404).json({ error: 'Transação não encontrada ou você não tem permissão para excluí-la.' });
      }

      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('id')
        .eq('id', transaction.property_id)
        .eq('user_id', userId)
        .single();

      if (propertyError || !property) {
        return res.status(403).json({ error: 'Você não tem permissão para excluir esta transação.' });
      }

      // Exclui a transação
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', id);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(200).json({ message: 'Transação excluída com sucesso.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateTransaction(req, res) {
    const { id } = req.params; // ID da transação a ser atualizada
    const { type, date, amount, category, description, receipt, funding_source } = req.body;

    try {
      const userId = req.user.id;

      // Verifica se a transação pertence a uma propriedade do usuário autenticado
      const { data: transaction, error: transactionError } = await supabase
        .from('financial_transactions')
        .select('property_id')
        .eq('id', id)
        .single();

      if (transactionError || !transaction) {
        return res.status(404).json({ error: 'Transação não encontrada ou você não tem permissão para editá-la.' });
      }

      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('id')
        .eq('id', transaction.property_id)
        .eq('user_id', userId)
        .single();

      if (propertyError || !property) {
        return res.status(403).json({ error: 'Você não tem permissão para editar esta transação.' });
      }

      // Atualiza a transação
      const { data, error } = await supabase
        .from('financial_transactions')
        .update({ type, date, amount, category, description, receipt, funding_source })
        .eq('id', id);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(200).json({ message: 'Transação atualizada com sucesso.', transaction: data[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createTask(req, res) {
    const { property_id, name, status, priority } = req.body;

    console.log('Dados recebidos:', priority);

    try {
      const userId = req.user.id;

      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('id')
        .eq('id', property_id)
        .eq('user_id', userId)
        .single();

      if (propertyError || !property) {
        return res.status(403).json({ error: 'Você não tem permissão para adicionar tarefas a esta propriedade.' });
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([{ user_id: userId, property_id, name, status, priority }])
        .select();

      if (error) {
        console.error('Erro ao salvar tarefa:', error);
        return res.status(400).json({ error: error.message });
      }

      res.status(201).json({ message: 'Tarefa criada com sucesso.', task: data[0] });
    } catch (error) {
      console.error('Erro no servidor:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async updateTaskStatus(req, res) {
    const { id } = req.params; // ID da tarefa a ser atualizada
    const { status } = req.body;

    try {
      const userId = req.user.id;

      // Valida o status
      const validStatuses = ['pending', 'in progress', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: `O status deve ser um dos seguintes valores: ${validStatuses.join(', ')}` });
      }

      // Verifica se a tarefa pertence a uma propriedade do usuário autenticado
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .select('property_id')
        .eq('id', id)
        .single();

      if (taskError || !task) {
        return res.status(404).json({ error: 'Tarefa não encontrada ou você não tem permissão para editá-la.' });
      }

      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('id')
        .eq('id', task.property_id)
        .eq('user_id', userId)
        .single();

      if (propertyError || !property) {
        return res.status(403).json({ error: 'Você não tem permissão para editar esta tarefa.' });
      }

      // Atualiza o status da tarefa
      const { data, error } = await supabase
        .from('tasks')
        .update({ status, updated_at: new Date() })
        .eq('id', id);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(200).json({ message: 'Status da tarefa atualizado com sucesso.', task: data[0] });
    } catch (error) {
      console.error('Erro no servidor:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getTasks(req, res) {
    try {
      const userId = req.user.id;

      // Busca todas as tarefas relacionadas ao usuário autenticado
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);

      if (tasksError) {
        return res.status(500).json({ error: tasksError.message });
      }

      res.status(200).json(tasks);
    } catch (error) {
      console.error('Erro no servidor:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteTask(req, res) {
    const { id } = req.params; // ID da tarefa a ser excluída

    try {
      const userId = req.user.id;

      // Verifica se a tarefa pertence a uma propriedade do usuário autenticado
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .select('property_id')
        .eq('id', id)
        .single();

      if (taskError || !task) {
        return res.status(404).json({ error: 'Tarefa não encontrada ou você não tem permissão para excluí-la.' });
      }

      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('id')
        .eq('id', task.property_id)
        .eq('user_id', userId)
        .single();

      if (propertyError || !property) {
        return res.status(403).json({ error: 'Você não tem permissão para excluir esta tarefa.' });
      }

      // Exclui a tarefa
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(200).json({ message: 'Tarefa excluída com sucesso.' });
    } catch (error) {
      console.error('Erro no servidor:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async createInstallmentFinance(req, res) {
    const {
      property_id,
      type,
      category_id,
      date,
      amount,
      total_installments,
      description
    } = req.body;

    try {
      const userId = req.user.id;

      const installmentValue = amount / total_installments;
      const transactions = [];

      for (let i = 1; i <= total_installments; i++) {
        transactions.push({
          user_id: userId,
          property_id,
          type,
          category_id,
          date: new Date(new Date(date).setMonth(new Date(date).getMonth() + i - 1)), // Incrementa os meses
          amount: installmentValue,
          status: 'pending',
          payment_method: 'installment',
          total_installments,
          current_installment: i,
          description,
          installment_value: installmentValue
        });
      }

      const { data, error } = await supabase
        .from('financial_transactions')
        .insert(transactions)
        .select();

      if (error) {
        console.error('Erro ao salvar transações parceladas:', error);
        return res.status(400).json({ error: error.message });
      }

      res.status(201).json({ message: 'Despesas parceladas criadas com sucesso.', transactions: data });
    } catch (error) {
      console.error('Erro no servidor:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getUserFinances(req, res) {
    try {
      const userId = req.user.id;

      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json(data);
    } catch (error) {
      console.error('Erro no servidor:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getPropertyFinances(req, res) {
    const { property_id } = req.params;

    try {
      const userId = req.user.id;

      // Verifica se o imóvel pertence ao usuário autenticado
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('id')
        .eq('id', property_id)
        .eq('user_id', userId)
        .single();

      if (propertyError || !property) {
        return res.status(403).json({ error: 'Você não tem permissão para acessar as finanças deste imóvel.' });
      }

      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('property_id', property_id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json(data);
    } catch (error) {
      console.error('Erro no servidor:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async createFinance(req, res) {
    const {
      property_id,
      type,
      category_id,
      date,
      amount,
      status,
      payment_method,
      total_installments,
      current_installment,
      parent_id,
      description,
      installment_value
    } = req.body;

    try {
      const userId = req.user.id;

      // Validação e conversão do campo `amount`
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ error: 'O campo "amount" deve ser um número válido maior que zero.' });
      }

      // Validação e conversão do campo `installment_value` (se aplicável)
      const parsedInstallmentValue = installment_value ? parseFloat(installment_value) : null;
      if (installment_value && (isNaN(parsedInstallmentValue) || parsedInstallmentValue <= 0)) {
        return res.status(400).json({ error: 'O campo "installment_value" deve ser um número válido maior que zero.' });
      }

      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([{
          user_id: userId,
          property_id,
          type,
          category_id,
          date,
          amount: parsedAmount,
          status,
          payment_method,
          total_installments,
          current_installment,
          parent_id,
          description,
          installment_value: parsedInstallmentValue
        }])
        .select();

      if (error) {
        console.error('Erro ao salvar transação:', error);
        return res.status(400).json({ error: error.message });
      }

      res.status(201).json({ message: 'Transação criada com sucesso.', transaction: data[0] });
    } catch (error) {
      console.error('Erro no servidor:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getCategories(req, res) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json(data);
    } catch (error) {
      console.error('Erro no servidor:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async createCategory(req, res) {
    const { name, description } = req.body;

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name, description }])
        .select();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(201).json({ message: 'Categoria criada com sucesso.', category: data[0] });
    } catch (error) {
      console.error('Erro no servidor:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async updateFinance(req, res) {
    const { id } = req.params; // ID da transação a ser atualizada
    const {
      property_id,
      type,
      category_id,
      date,
      amount,
      status,
      payment_method,
      total_installments,
      current_installment,
      parent_id,
      description,
      installment_value
    } = req.body;

    try {
      const userId = req.user.id;

      // Verifica se a transação pertence ao usuário autenticado
      const { data: transaction, error: transactionError } = await supabase
        .from('financial_transactions')
        .select('user_id')
        .eq('id', id)
        .single();

      if (transactionError || !transaction || transaction.user_id !== userId) {
        return res.status(403).json({ error: 'Você não tem permissão para editar esta transação.' });
      }

      // Validação e conversão do campo `amount`
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ error: 'O campo "amount" deve ser um número válido maior que zero.' });
      }

      // Validação e conversão do campo `installment_value` (se aplicável)
      const parsedInstallmentValue = installment_value ? parseFloat(installment_value) : null;
      if (installment_value && (isNaN(parsedInstallmentValue) || parsedInstallmentValue <= 0)) {
        return res.status(400).json({ error: 'O campo "installment_value" deve ser um número válido maior que zero.' });
      }

      // Atualiza a transação
      const { data, error } = await supabase
        .from('financial_transactions')
        .update({
          property_id,
          type,
          category_id,
          date,
          amount: parsedAmount,
          status,
          payment_method,
          total_installments,
          current_installment,
          parent_id,
          description,
          installment_value: parsedInstallmentValue
        })
        .eq('id', id)
        .select();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.status(200).json({ message: 'Transação atualizada com sucesso.', transaction: data[0] });
    } catch (error) {
      console.error('Erro no servidor:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteFinance(req, res) {
    const { id } = req.params; // ID da transação a ser excluída

    try {
      const userId = req.user.id;

      // Verifica se a transação pertence ao usuário autenticado
      const { data: transaction, error: transactionError } = await supabase
        .from('financial_transactions')
        .select('id, parent_id, user_id')
        .eq('id', id)
        .single();

      if (transactionError || !transaction || transaction.user_id !== userId) {
        return res.status(403).json({ error: 'Você não tem permissão para excluir esta transação.' });
      }

      // Determina se é uma transação "mãe" ou uma parcela
      const isParentTransaction = !transaction.parent_id;

      if (isParentTransaction) {
        // Exclui todas as parcelas relacionadas à transação "mãe"
        const { error: deleteError } = await supabase
          .from('financial_transactions')
          .delete()
          .or(`id.eq.${id},parent_id.eq.${id}`); // Exclui a transação "mãe" e todas as parcelas

        if (deleteError) {
          return res.status(400).json({ error: deleteError.message });
        }

        return res.status(200).json({ message: 'Transação e todas as parcelas relacionadas foram excluídas com sucesso.' });
      } else {
        // Exclui todas as parcelas relacionadas à mesma transação "mãe"
        const { error: deleteError } = await supabase
          .from('financial_transactions')
          .delete()
          .eq('parent_id', transaction.parent_id);

        if (deleteError) {
          return res.status(400).json({ error: deleteError.message });
        }

        return res.status(200).json({ message: 'Todas as parcelas relacionadas foram excluídas com sucesso.' });
      }
    } catch (error) {
      console.error('Erro no servidor:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default IndexController;