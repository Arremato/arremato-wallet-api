import supabase from '../services/supabaseClient.js';
import bcrypt from 'bcrypt';

class UserController {

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
}

export default UserController;