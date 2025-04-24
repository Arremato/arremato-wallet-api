import supabase from '../services/supabaseClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class IndexController {
  async getUsers(req, res) {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data);
  }

  async createUser(req, res) {
    const { name, email, password } = req.body;
    const { data, error } = await supabase.from('users').insert([{ name, email, password }]);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data);
  }

  async getProperties(req, res) {
    const { data, error } = await supabase.from('properties').select('*');
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data);
  }

  async getUserProperties(req, res) {
    const { user_id } = req.query;

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', user_id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  }

  async createProperty(req, res) {
    const { user_id, name, location, valuation, payment_method, acquisition_date, purpose } = req.body;

    const { data, error } = await supabase
      .from('properties')
      .insert([{ user_id, name, location, valuation, payment_method, acquisition_date, purpose }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  }

  async createProcess(req, res) {
    const { property_id, activity, status, progress, description, updated_by } = req.body;

    const { data, error } = await supabase
      .from('processes')
      .insert([{ property_id, activity, status, progress, description, updated_by }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  }

  async createTransaction(req, res) {
    const { property_id, type, date, amount, category, description, receipt, funding_source } = req.body;

    const { data, error } = await supabase
      .from('financial_transactions')
      .insert([{ property_id, type, date, amount, category, description, receipt, funding_source }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  }

  async getFinancialSummary(req, res) {
    const { user_id } = req.query;

    const { data, error } = await supabase
      .rpc('get_financial_summary', { user_id });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  }

  async createLoan(req, res) {
    const { user_id, amount, outstanding_balance, due_date } = req.body;

    const { data, error } = await supabase
      .from('loans')
      .insert([{ user_id, amount, outstanding_balance, due_date }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  }

  async updateUser(req, res) {
    const { name, email, password } = req.body;
    const userId = req.user.id; // Supondo que o ID do usuário esteja no token JWT

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

        console.log(data);
        console.log(error);

      if (error || !data) {
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
}

export default IndexController;