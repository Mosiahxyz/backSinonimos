
    //importações
    import express from 'express'
    import { sqlConfig } from "./config/config.js"
    import sql from 'mssql';
    
    //conexão com MySql (banco)
    const pool = new sql.ConnectionPool(sqlConfig)
    await pool.connect();
    const routes = express.Router();

    //função de string para txt
    import exportar from "./functions/fdp.js";
    
    let x = -1; //não apaga isso, por favor
    
    //ROTAS DO PROFESSOR ----------------------------

    routes.get('/modelos', async (req,res)=>{//exibir os modelos já existentes

        try{
            const { recordset }  = await pool.query`select * from Modelo_redacao `
            return res.status(200).json(recordset)
        }

        catch{
            return res.status(501).json('erro')
        }

    })

    routes.post('/novomodelo', async (req,res)=>{//criar um modelo de redação novo

        try{
            const {  imagem, titulo, corpo_redacao} = req.body;
            
            await pool.query`INSERT INTO Modelo_redacao (imagem, titulo, corpo_redacao)
             VALUES (${imagem}, ${titulo}, ${corpo_redacao})`;

            return res.status(201).json(`ok, foi`)
        }

        catch(error){
            return res.status(501).json('erro ao inserir redação...')
        }

    })

    routes.put('/editar/:id', async (req, res)=>{//editar modelos já existentes
        try {

            const { id } = req.params;
            const { imagem, titulo, corpo_redacao } = req.body

            await pool.query`UPDATE Modelo_redacao SET imagem = ${imagem}, titulo = ${titulo}, corpo_redacao = ${corpo_redacao} WHERE id = ${id}`;
            return res.status(201).json('atualizado')
        } 
        
        catch (error) {
            console.log(error)
            return res.status(501).json('erro ao atualizar produto...')
        }
    })

    routes.delete('/deletar/:id', async (req, res) => {//deletar redação
        try {
            
            const { id } = req.params;
    
            await pool.query`DELETE FROM Modelo_redacao WHERE id = ${id}`;
            return res.status(200).json('deletado com sucesso');
        } 
        
        catch (error) {
            console.log(error);
            return res.status(500).json('erro ao deletar o registro...');
        }
    });
    
    //ROTAS DO ALUNO ----------------------------

    routes.post('/exportar', async (req,res)=>{//permitir o aluno exportar para txt

        try{
            const { filename, redacao } = req.body;
            const { recordset }  =  exportar(redacao, filename);// código que exporta a redação para txt
            return res.status(200).json(recordset)
        }

        catch{
            return res.status(501).json('erro')
        }

    })
       
    routes.get('/sinonimos', async (req, res) => {//selecionar todas as palavras e seus sinonimos
        try {
            
            const { recordset } = await pool.query`SELECT * FROM sinonimos;`;
    
            let dicionarioSinonimos = {};
            const palavras = recordset;
    
            let x = 0;  // inicialize o contador x
            let anterior = "";
    
            for (let i = 0; i < palavras.length; i++) {
    
                if (palavras[i].palavra !== anterior) {
                    x++;
    
                    // Inicialize o objeto da palavra
                    dicionarioSinonimos[palavras[i].palavra] = {
                        sinonimos: [palavras[i].sinonimo] // adicione o primeiro sinônimo
                    };
                } else {
                    // Adicione o sinônimo à lista de sinônimos já existente
                    dicionarioSinonimos[palavras[i].palavra].sinonimos.push(palavras[i].sinonimo);
                }
    
                anterior = palavras[i].palavra;
            }
    
            return res.status(200).json(dicionarioSinonimos);
    
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar os sinônimos.' });
        }
    });

    routes.get('/busca/:palavra', async (req, res) => {//selecionar sinonimos de uma palavra especificas

        const palavra = req.params.palavra;
    
        try {
            const { recordset } = await pool.query`select sinonimo from sinonimos where palavra like 'importante%'`;
            
            const sinonimos = recordset.reduce((nova_lista,item)=>{
                nova_lista.push(item.sinonimo)
                return nova_lista;
            }, [])
            console.log(sinonimos) // 6

            return res.status(200).json(sinonimos)
        } 
        
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao buscar sinônimos.' });
        }
    });
    
    
    //exportar para o app
    export default routes

