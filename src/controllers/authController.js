import supabase from '../services/supabaseClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthController {

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
}

export default AuthController;