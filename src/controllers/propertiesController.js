import supabase from '../services/supabaseClient.js';

class PropertiesController {

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
            payment_method,
            down_payment,
            installments,
            installment_value,
            auction_origin,
            legal_status,
            registered_in
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
                    payment_method,
                    down_payment,
                    installments,
                    installment_value,
                    auction_origin,
                    legal_status,
                    registered_in
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
}

export default PropertiesController;