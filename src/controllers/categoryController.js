import supabase from '../services/supabaseClient.js';

class CategoryController {

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
}

export default CategoryController;