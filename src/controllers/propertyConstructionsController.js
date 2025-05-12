import supabase from '../services/supabaseClient.js';

class PropertyConstructionsController {

    async createConstruction(req, res) {
        const {
          property_id,
          budget,
          spent,
          delivery_days,
          responsible_name,
          responsible_phone,
          status
        } = req.body;
      
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
            return res.status(403).json({ error: 'Você não tem permissão para adicionar construções a este imóvel.' });
          }
      
          // Insere a construção
          const { data, error } = await supabase
            .from('property_constructions')
            .insert([{
              property_id,
              budget,
              spent,
              delivery_days,
              responsible_name,
              responsible_phone,
              status
            }])
            .select();
      
          if (error) {
            return res.status(400).json({ error: error.message });
          }
      
          res.status(201).json({ message: 'Construção criada com sucesso.', construction: data[0] });
        } catch (error) {
          console.error('Erro no servidor:', error);
          res.status(500).json({ error: error.message });
        }
      }

      async updateConstruction(req, res) {
        const { id } = req.params; // ID da construção a ser atualizada
        const {
          budget,
          spent,
          delivery_days,
          responsible_name,
          responsible_phone,
          status
        } = req.body;
      
        try {
          const userId = req.user.id;
      
          // Verifica se a construção pertence a um imóvel do usuário autenticado
          const { data: construction, error: constructionError } = await supabase
            .from('property_constructions')
            .select('property_id')
            .eq('id', id)
            .single();
      
          if (constructionError || !construction) {
            return res.status(404).json({ error: 'Construção não encontrada ou você não tem permissão para editá-la.' });
          }
      
          const { data: property, error: propertyError } = await supabase
            .from('properties')
            .select('id')
            .eq('id', construction.property_id)
            .eq('user_id', userId)
            .single();
      
          if (propertyError || !property) {
            return res.status(403).json({ error: 'Você não tem permissão para editar esta construção.' });
          }
      
          // Atualiza a construção
          const { data, error } = await supabase
            .from('property_constructions')
            .update({
              budget,
              spent,
              delivery_days,
              responsible_name,
              responsible_phone,
              status,
              updated_at: new Date()
            })
            .eq('id', id)
            .select();
      
          if (error) {
            return res.status(400).json({ error: error.message });
          }
      
          res.status(200).json({ message: 'Construção atualizada com sucesso.', construction: data[0] });
        } catch (error) {
          console.error('Erro no servidor:', error);
          res.status(500).json({ error: error.message });
        }
      }

      async updateConstruction(req, res) {
        const { id } = req.params; // ID da construção a ser atualizada
        const {
          budget,
          spent,
          delivery_days,
          responsible_name,
          responsible_phone,
          status
        } = req.body;
      
        try {
          const userId = req.user.id;
      
          // Verifica se a construção pertence a um imóvel do usuário autenticado
          const { data: construction, error: constructionError } = await supabase
            .from('property_constructions')
            .select('property_id')
            .eq('id', id)
            .single();
      
          if (constructionError || !construction) {
            return res.status(404).json({ error: 'Construção não encontrada ou você não tem permissão para editá-la.' });
          }
      
          const { data: property, error: propertyError } = await supabase
            .from('properties')
            .select('id')
            .eq('id', construction.property_id)
            .eq('user_id', userId)
            .single();
      
          if (propertyError || !property) {
            return res.status(403).json({ error: 'Você não tem permissão para editar esta construção.' });
          }
      
          // Atualiza a construção
          const { data, error } = await supabase
            .from('property_constructions')
            .update({
              budget,
              spent,
              delivery_days,
              responsible_name,
              responsible_phone,
              status,
              updated_at: new Date()
            })
            .eq('id', id)
            .select();
      
          if (error) {
            return res.status(400).json({ error: error.message });
          }
      
          res.status(200).json({ message: 'Construção atualizada com sucesso.', construction: data[0] });
        } catch (error) {
          console.error('Erro no servidor:', error);
          res.status(500).json({ error: error.message });
        }
      }

      async getConstructions(req, res) {
        try {
          const userId = req.user.id;
      
          // Busca os IDs dos imóveis relacionados ao usuário
          const { data: properties, error: propertiesError } = await supabase
            .from('properties')
            .select('id')
            .eq('user_id', userId);
      
          if (propertiesError) {
            return res.status(500).json({ error: propertiesError.message });
          }
      
          const propertyIds = properties.map((property) => property.id);
      
          // Busca as construções relacionadas aos imóveis do usuário
          const { data: constructions, error: constructionsError } = await supabase
            .from('property_constructions')
            .select('*')
            .in('property_id', propertyIds);
      
          if (constructionsError) {
            return res.status(500).json({ error: constructionsError.message });
          }
      
          res.status(200).json(constructions);
        } catch (error) {
          console.error('Erro no servidor:', error);
          res.status(500).json({ error: error.message });
        }
      }

      async getConstructionsByProperty(req, res) {
        const { property_id } = req.params; // ID do imóvel
      
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
            return res.status(403).json({ error: 'Você não tem permissão para acessar as construções deste imóvel.' });
          }
      
          // Busca as construções relacionadas ao imóvel
          const { data: constructions, error: constructionsError } = await supabase
            .from('property_constructions')
            .select('*')
            .eq('property_id', property_id);
      
          if (constructionsError) {
            return res.status(500).json({ error: constructionsError.message });
          }
      
          res.status(200).json(constructions);
        } catch (error) {
          console.error('Erro no servidor:', error);
          res.status(500).json({ error: error.message });
        }
      }

      async deleteConstruction(req, res) {
        const { id } = req.params; // ID da construção a ser excluída
      
        try {
          const userId = req.user.id;
      
          // Verifica se a construção pertence a um imóvel do usuário autenticado
          const { data: construction, error: constructionError } = await supabase
            .from('property_constructions')
            .select('property_id')
            .eq('id', id)
            .single();
      
          if (constructionError || !construction) {
            return res.status(404).json({ error: 'Construção não encontrada ou você não tem permissão para excluí-la.' });
          }
      
          const { data: property, error: propertyError } = await supabase
            .from('properties')
            .select('id')
            .eq('id', construction.property_id)
            .eq('user_id', userId)
            .single();
      
          if (propertyError || !property) {
            return res.status(403).json({ error: 'Você não tem permissão para excluir esta construção.' });
          }
      
          // Exclui a construção
          const { error } = await supabase
            .from('property_constructions')
            .delete()
            .eq('id', id);
      
          if (error) {
            return res.status(400).json({ error: error.message });
          }
      
          res.status(200).json({ message: 'Construção excluída com sucesso.' });
        } catch (error) {
          console.error('Erro no servidor:', error);
          res.status(500).json({ error: error.message });
        }
      }

};

export default PropertyConstructionsController;