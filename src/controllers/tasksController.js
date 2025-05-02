import supabase from '../services/supabaseClient.js';

class TasksController {

    async createTask(req, res) {
        const { property_id, name, status, priority } = req.body;

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
        const { id } = req.params;
        const { status } = req.body;

        try {
            const userId = req.user.id;

            const validStatuses = ['pending', 'in progress', 'completed'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ error: `O status deve ser um dos seguintes valores: ${validStatuses.join(', ')}` });
            }

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
        const { id } = req.params;

        try {
            const userId = req.user.id;

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

    async getPropertyTasks(req, res) {
        const { id } = req.params;

        try {
            const userId = req.user.id;

            const { data: property, error: propertyError } = await supabase
                .from('properties')
                .select('id')
                .eq('id', id)
                .eq('user_id', userId)
                .single();

            if (propertyError || !property) {
                return res.status(403).json({ error: 'Você não tem permissão para acessar as tarefas deste imóvel.' });
            }

            const { data: tasks, error: tasksError } = await supabase
                .from('tasks')
                .select('*')
                .eq('property_id', id);

            if (tasksError) {
                return res.status(500).json({ error: tasksError.message });
            }

            res.status(200).json(tasks);
        } catch (error) {
            console.error('Erro no servidor:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateTask(req, res) {
        const { id } = req.params;
        const { name, status, priority } = req.body;

        try {
            const userId = req.user.id;

            const validStatuses = ['pending', 'in progress', 'completed'];
            if (status && !validStatuses.includes(status)) {
                return res.status(400).json({ error: `O status deve ser um dos seguintes valores: ${validStatuses.join(', ')}` });
            }

            const validPriorities = ['low', 'medium', 'high'];
            if (priority && !validPriorities.includes(priority)) {
                return res.status(400).json({ error: `A prioridade deve ser um dos seguintes valores: ${validPriorities.join(', ')}` });
            }

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

            const updates = {};
            if (name) updates.name = name;
            if (status) updates.status = status;
            if (priority) updates.priority = priority;

            const { data, error } = await supabase
                .from('tasks')
                .update({ ...updates, updated_at: new Date() })
                .eq('id', id)
                .select();

            if (error) {
                return res.status(400).json({ error: error.message });
            }

            res.status(200).json({ message: 'Tarefa atualizada com sucesso.', task: data[0] });
        } catch (error) {
            console.error('Erro no servidor:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

export default TasksController;