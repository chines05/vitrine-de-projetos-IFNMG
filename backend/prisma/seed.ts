import bcrypt from 'bcryptjs'
import { prisma } from '../src/lib/prisma'

async function main() {
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@ifnmg.edu.br' },
  })

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('Chines05', 10)

    await prisma.user.create({
      data: {
        nome: 'Admin IFNMG',
        email: 'admin@ifnmg.edu.br',
        senha: hashedPassword,
        role: 'ADMIN',
      },
    })
    console.log('✅ Admin criado com sucesso!')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

export {}
