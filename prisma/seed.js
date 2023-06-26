const bcrypt = require("bcryptjs");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


async function main() {
  const passwordHash = await bcrypt.hash("test@1234", 10);
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      username: 'user1',
      passwordHash: passwordHash,
      todos: {
        create: {
          title: 'Check out Prisma with Next.js',
          status: "inprogress",
        },
      },
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      username: 'user2',
      passwordHash: passwordHash,
      todos: {
        create: [
          {
            title: 'Follow Prisma on Twitter',
            status: "onhold",
          },
          {
            title: 'Follow Nexus on Twitter',
            status: "done",
          },
        ],
      },
    },
  })
  console.log({ user1, user2 })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
