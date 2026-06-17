import prisma from "../../lib/prisma.js";

const userRepository = {
     getUser: async (userId: string) => {
        return await prisma.user.findFirst({
            where: {
                id: userId,
            },
            select: {
                username: true,
            }
        })
    }
}

export default userRepository;