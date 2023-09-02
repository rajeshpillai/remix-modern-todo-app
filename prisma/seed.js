const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // reset db
  await prisma.userRating.deleteMany({});
  await prisma.subtask.deleteMany({});
  await prisma.todo.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.category.deleteMany({});

  const personal = await prisma.category.create({
    data: {
      title : "Personal"
    }
  });

  const work = await prisma.category.create({
    data: {
      title : "Work"
    }
  });

  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      username: 'alice',
      todos: {
        create: {
          title: 'Check out Prisma with Next.js',
          status: "inprogress",
          categoryId: personal.id,
          subtasks: {
            create: [
              {
                title: "Check doc",
                status: "inprogress",
              },
              {
                title: "Enroll in a course",
                status: "pending",
              },
          ]}
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
      todos: {
        create: [
          {
            title: 'Follow Prisma on Twitter',
            status: "onhold",
            categoryId: personal.id
          },
          {
            title: 'Hiring',
            status: "inprogress",
            categoryId: work.id
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
