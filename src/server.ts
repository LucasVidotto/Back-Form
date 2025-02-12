import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import cors from '@fastify/cors';
import { FastifyRequest } from 'fastify';


const app = Fastify();
const prisma = new PrismaClient();

interface FormData {
  name: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string; // Se você estiver passando como string, caso contrário, use Date
}

app.register(cors, { 
  origin: '*' // Permite qualquer origem acessar a API (ajuste conforme necessário)
});

app.get('/users', async (request, reply) => {
  try {
    const users = await prisma.user.findMany(); // Obtém todos os usuários
    return reply.send({ success: true, users });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ success: false, message: 'Erro ao buscar os dados.' });
  }
});


// Rota para receber os dados do formulário
app.post('/submit-form', async (request: FastifyRequest<{ Body: FormData }>, reply) => {
  try {
    // Agora TypeScript sabe que request.body é do tipo FormData
    const { name, email, phone, gender, birthDate } = request.body;

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        gender,
        birthDate: new Date(birthDate), // Certifique-se de que o formato de birthDate seja compatível
      },
    });

    return reply.send({ success: true, user: newUser });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ success: false, message: 'Erro ao salvar os dados.' });
  }
});



// Inicia o servidor
app.listen({ port: 4000, host: '0.0.0.0' }, () => {
  console.log('Server is running on http://0.0.0.0:4000');
});