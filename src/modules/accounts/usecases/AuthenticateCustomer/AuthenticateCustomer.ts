import { prisma } from "../../../../database/prisma";
import { compare } from "bcrypt";
import { auth } from "../../../../config/auth";

interface IAuthenticateCustomerRequest {
  email: string;
  password: string;
}

export class AuthenticateCustomer {
  async execute({ email, password }: IAuthenticateCustomerRequest) {
    const customer = await prisma.customer.findFirst({
      where: {
        email
      },
    });

    if (!customer) {
      throw new Error("400|Email or password is invalid!");
    }

    const passwordMatch = await compare(password, customer.password);

    if (!passwordMatch) {
      throw new Error("400|Email or password is invalid!");
    }

    const token = auth.sign({
      userId: customer.id, type: "customer", data: {
        email
      }
    });

    return { token, customer };
  }
}
