import categoryRepository from "./categories.repository.js";

const categoryService = {
    getCategories: async () => {
        return await categoryRepository.getCategories();
    },
}

export default categoryService;