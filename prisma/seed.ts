import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

    const categories = [
        { name: "Beverages" },
        { name: "Snacks" },
        { name: "Canned Goods" },
        { name: "Instant Noodles" },
        { name: "Condiments" },
        { name: "Household Supplies" },
        { name: "Personal Care" },
        { name: "Others" },
    ];

    for (const category of categories) {
        await prisma.category.upsert({
            where: { name: category.name },
            update: {},
            create: category,
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
