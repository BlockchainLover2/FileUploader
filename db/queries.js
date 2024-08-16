// instantiate the client
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


async function createUser(){
    await prisma.users.create({
        data: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@doe.com',
            password: 'password',
        }
    })
    await prisma.$disconnect()
}




// when fetching all messages
const messages = await prisma.users.findMany();