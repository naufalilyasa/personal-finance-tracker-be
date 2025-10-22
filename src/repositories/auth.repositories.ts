import { Prisma } from "../../generated/prisma/index.js";
import { prisma } from "../prisma/client.js";
import { RegisterRequest } from "../validations/auth.validations.js";

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findUniqueUser(
    where: Prisma.UserWhereUniqueInput,
    omit: Prisma.UserOmit,
  ) {
    return await prisma.user.findUnique({
      omit,
      where,
    });
  }

  async registerRepo(payload: RegisterRequest) {
    const { name, password, email } = payload;

    return await prisma.user.create({
      data: {
        name,
        password_hash: password,
        email,
      },
    });
  }

  async loginRepo(email: string) {
    return prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        password_hash: true,
      },
      where: {
        email,
      },
    });
  }
}
