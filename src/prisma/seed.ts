/* eslint-disable no-console */
import bcrypt from "bcrypt";
import { PrismaClient, TransactionType } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

const incomeCategories = [
  { category: "Salary", description: "Monthly salary" },
  { category: "Freelance", description: "Freelance project payment" },
  { category: "Investment", description: "Return from investments" },
  { category: "Gift", description: "Received a gift" },
  { category: "Bonus", description: "Performance bonus" },
];

const expenseCategories = [
  { category: "Food", description: "Daily meals and snacks" },
  { category: "Transportation", description: "Fuel and public transport" },
  { category: "Shopping", description: "Clothes and accessories" },
  { category: "Bills", description: "Electricity, water, and internet bills" },
  {
    category: "Entertainment",
    description: "Movies, games, and subscriptions",
  },
  { category: "Health", description: "Medicine and checkups" },
  { category: "Education", description: "Online courses and books" },
  { category: "Others", description: "Miscellaneous expenses" },
];

function getRandomDate() {
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(`2025-10-${String(day).padStart(2, "0")}`);
}

function getRandomAmount(min: number, max: number) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

async function main() {
  const password = "password123";
  const passwordHash = await bcrypt.hash(password, 10);

  console.log("👤 Upserting users...");
  const usersData = [
    {
      name: "Alice Doe",
      email: "alice@example.com",
      password_hash: passwordHash,
    },
    {
      name: "Bob Smith",
      email: "bob@example.com",
      password_hash: passwordHash,
    },
    {
      name: "Charlie Brown",
      email: "charlie@example.com",
      password_hash: passwordHash,
    },
  ];

  for (const user of usersData) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  const allUsers = await prisma.user.findMany();
  console.log(`✅ Users ready: ${allUsers.length}`);

  for (const user of allUsers) {
    const transactions = [];

    for (let i = 0; i < 15; i++) {
      const isIncome = Math.random() < 0.4;
      if (isIncome) {
        const { category, description } =
          incomeCategories[Math.floor(Math.random() * incomeCategories.length)];
        transactions.push({
          user_id: user.id,
          type: TransactionType.income,
          amount: getRandomAmount(500_000, 5_000_000),
          category,
          description,
          date: getRandomDate(),
        });
      } else {
        const { category, description } =
          expenseCategories[
            Math.floor(Math.random() * expenseCategories.length)
          ];
        transactions.push({
          user_id: user.id,
          type: TransactionType.expense,
          amount: getRandomAmount(20_000, 1_000_000),
          category,
          description,
          date: getRandomDate(),
        });
      }
    }

    await prisma.transaction.createMany({
      data: transactions,
      skipDuplicates: true,
    });

    console.log(
      `💰 Ensured ${transactions.length} transactions for ${user.name}`,
    );
  }

  console.log("🌱 Seeding completed (no duplicates)!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
