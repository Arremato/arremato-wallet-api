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
    const { name, location, valuation, payment_method, acquisition_date, purpose } = req.body;

    try {
      const userId = req.user.id;
      console.log('User ID:', userId);

      const { data, error } = await supabase
        .from('properties')
        .insert([{ user_id: userId, name, location, valuation, payment_method, acquisition_date, purpose }])
        .select();

      console.log('Resposta do Supabase:', { data, error });

      if (error) {
        console.error('Supabase Error:', error);
        return res.status(400).json({ error: error.message });
      }

      if (!data || data.length === 0) {
        return res.status(500).json({ error: 'Erro ao criar propriedade. Nenhum dado retornado.' });
      }

      res.status(201).json({ message: 'Imóvel criado com sucesso.', property: data[0] });
    } catch (error) {
      console.error('Catch Error:', error);
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

      // Verifica se a propriedade pertence ao usuário autenticado
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('id')
        .eq('id', property_id)
        .eq('user_id', userId)
        .single();

      if (propertyError || !property) {
        return res.status(403).json({ error: 'Você não tem permissão para adicionar transações a esta propriedade.' });
      }

      // Insere a transação financeira
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([{ property_id, type, date, amount, category, description, receipt, funding_source }])
        .select(); // Garante que os dados inseridos sejam retornados

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
}

export default IndexController;