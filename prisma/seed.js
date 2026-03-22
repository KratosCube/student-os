const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function at(dayOffset, hour, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function main() {
  // smažeme data ve správném pořadí kvůli vazbám
  await prisma.studySession.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.subject.deleteMany();

  // předměty
  const dma = await prisma.subject.create({
    data: {
      name: 'DMA',
      color: '#f59e0b',
    },
  });

  const uur = await prisma.subject.create({
    data: {
      name: 'UUR',
      color: '#6366f1',
    },
  });

  const alg = await prisma.subject.create({
    data: {
      name: 'ALG',
      color: '#10b981',
    },
  });

  const osy = await prisma.subject.create({
    data: {
      name: 'OSY',
      color: '#f43f5e',
    },
  });

  // termíny zkoušek
  await prisma.exam.createMany({
    data: [
      // dnešní aktivní termín, aby něco bylo na dashboardu
      {
        subjectId: dma.id,
        date: at(0, 14, 0),
        type: 'confirmed',
        duration: 90,
        isDone: false,
      },

      // budoucí potvrzené
      {
        subjectId: uur.id,
        date: at(2, 9, 30),
        type: 'confirmed',
        duration: 120,
        isDone: false,
      },
      {
        subjectId: alg.id,
        date: at(5, 11, 0),
        type: 'confirmed',
        duration: 90,
        isDone: false,
      },

      // budoucí možný termín
      {
        subjectId: osy.id,
        date: at(7, 15, 30),
        type: 'potential',
        duration: 60,
        isDone: false,
      },

      // hotové starší termíny
      {
        subjectId: dma.id,
        date: at(-6, 8, 0),
        type: 'confirmed',
        duration: 90,
        isDone: true,
      },
      {
        subjectId: uur.id,
        date: at(-3, 10, 0),
        type: 'confirmed',
        duration: 90,
        isDone: true,
      },
    ],
  });

  // studijní sessiony za posledních 7 dní + něco navíc
  await prisma.studySession.createMany({
    data: [
      { subjectId: dma.id, duration: 45, createdAt: at(-6, 17, 30) },
      { subjectId: uur.id, duration: 30, createdAt: at(-5, 18, 0) },
      { subjectId: alg.id, duration: 60, createdAt: at(-4, 16, 15) },
      { subjectId: dma.id, duration: 45, createdAt: at(-3, 19, 0) },
      { subjectId: osy.id, duration: 25, createdAt: at(-2, 20, 0) },
      { subjectId: uur.id, duration: 45, createdAt: at(-1, 17, 33) },
      { subjectId: dma.id, duration: 45, createdAt: at(0, 17, 35) },

      // starší sessiony pro "celkem" statistiky
      { subjectId: alg.id, duration: 90, createdAt: at(-10, 14, 0) },
      { subjectId: osy.id, duration: 40, createdAt: at(-12, 13, 30) },
      { subjectId: dma.id, duration: 50, createdAt: at(-15, 18, 0) },
    ],
  });

  console.log('✅ Seed hotový');
}

main()
  .catch((e) => {
    console.error('❌ Seed selhal');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });