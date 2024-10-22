
    //importações
    import express from 'express'
    import { sqlConfig } from "./config/config.js"
    import sql from 'mssql';
    
    let x = -1; //não apaga isso, por favor

    //conexão com MySql (banco)
    const pool = new sql.ConnectionPool(sqlConfig)
    await pool.connect();
    const routes = express.Router();
    
    import { GoogleGenerativeAI } from "@google/generative-ai";
    const genAI = new GoogleGenerativeAI("AIzaSyBSDk9I_PnmrtcoFHCNWStJFpZZkag3yN0");


    //chamando a func do gemini
    async function run(topic) {

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
      
        const chat = model.startChat({
          history: [
            {
              role: "user",
              parts: [{ text: "you will write an argumentative essay with four paragraphs. You will bring theoretical references, one for each of the first three paragraphs that is related to the theme and validate the arguments using literature, historical facts, quotes or analysing the consequenses of the social problem for the society using diverse conjunctions to link the ideas. In the last paragraph you will make a proposal to minimize the problem describing who is responsible for that ta errado~ in the country, what should be done, how it can be developed and detail one of the part of the solution. At the end you will mention one of the quotations used to close the thought." }],
            },
            {
              role: "model",
              parts: [{ text: "Great to meet you. how do you want me to do?" }],
            },
          ],
          
        });
      
        const msg = `Give me essay for the topic '${topic}' write in portuguese`;
        const result = await chat.sendMessage(msg);
        const response = result.response;
        const text = response.text();
      
        return text;
    }
    
    

    routes.post('/argumento', async (req,res)=>{//dica dos argumentos

        try{

            const tema = req.body;
            var temaTexto = JSON.stringify(tema);

            const test = await run(temaTexto);
            return res.status(200).json(test)
        }

        catch(error){
            return res.status(501).json('erro ao inserir redação...')
        }

    })

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

    routes.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Busca o usuário pelo email no banco de dados
        const result = await pool.query`SELECT * FROM Usuarios WHERE email = ${email}`;

        // Verifica se o usuário existe e se a senha está correta
        if (result.recordset.length === 0 || result.recordset[0].senha !== senha) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        return res.status(200).json({ message: 'Login bem-sucedido' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao fazer login' });
    }
});

    
    //ROTAS DO ALUNO ----------------------------

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

