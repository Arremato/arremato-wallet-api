import supabase from '../services/supabaseClient.js';

class IndexController {

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

}

export default IndexController;