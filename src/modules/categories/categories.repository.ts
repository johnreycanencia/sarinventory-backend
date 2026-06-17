import prisma from "../../lib/prisma.js";

const categoryRepository = {
  getCategories: () => {
    return prisma.category.findMany();
  },
};

export default categoryRepository;