import express from 'express';
import { generate } from './chatbot.js';

const app = express();

const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to ChatBot');
});
app.post('/chat',async(req,res)=>{
    const {message} = req.body;
    console.log('User Message : ',message);
    const result = await generate(message)
    res.json({message:result});

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

