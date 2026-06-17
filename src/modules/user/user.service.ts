import userRepository from "./user.repository.js";

const userService = {
    getUser: async (userId: string) => {
        const user = await userRepository.getUser(userId);
        return user;
    }
}

export default userService;