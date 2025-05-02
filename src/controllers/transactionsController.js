import supabase from '../services/supabaseClient.js';

class TransactionController {

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
                    date: new Date(new Date(date).setMonth(new Date(date).getMonth() + i - 1)),
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

            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                return res.status(400).json({ error: 'O campo "amount" deve ser um número válido maior que zero.' });
            }

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

    async updateFinance(req, res) {
        const { id } = req.params;
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

            const { data: transaction, error: transactionError } = await supabase
                .from('financial_transactions')
                .select('user_id')
                .eq('id', id)
                .single();

            if (transactionError || !transaction || transaction.user_id !== userId) {
                return res.status(403).json({ error: 'Você não tem permissão para editar esta transação.' });
            }

            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                return res.status(400).json({ error: 'O campo "amount" deve ser um número válido maior que zero.' });
            }

            const parsedInstallmentValue = installment_value ? parseFloat(installment_value) : null;
            if (installment_value && (isNaN(parsedInstallmentValue) || parsedInstallmentValue <= 0)) {
                return res.status(400).json({ error: 'O campo "installment_value" deve ser um número válido maior que zero.' });
            }

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
        const { id } = req.params; 

        try {
            const userId = req.user.id;

            const { data: transaction, error: transactionError } = await supabase
                .from('financial_transactions')
                .select('id, parent_id, user_id')
                .eq('id', id)
                .single();

            if (transactionError || !transaction || transaction.user_id !== userId) {
                return res.status(403).json({ error: 'Você não tem permissão para excluir esta transação.' });
            }

            const isParentTransaction = !transaction.parent_id;

            if (isParentTransaction) {
                const { error: deleteError } = await supabase
                    .from('financial_transactions')
                    .delete()
                    .or(`id.eq.${id},parent_id.eq.${id}`); 

                if (deleteError) {
                    return res.status(400).json({ error: deleteError.message });
                }

                return res.status(200).json({ message: 'Transação e todas as parcelas relacionadas foram excluídas com sucesso.' });
            } else {
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

export default TransactionController;