const bcrypt = require("bcryptjs");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


async function main() {
  const passwordHash = await bcrypt.hash("test@1234", 10);
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      username: 'alice',
      passwordHash: passwordHash,
      todos: {
        create: {
          title: 'Check out Prisma with Next.js',
          status: "inprogress",
        },
      },
    },
  })

  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      username: 'bob',
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
  console.log({ alice, bob })
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
