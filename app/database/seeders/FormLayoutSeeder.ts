import Seeder from "~/core/Seeder";
import FormLayoutFactory from "../factories/FormLayoutFactory";
import type { PrismaClient } from "~/generated/prisma/client";

export default class FormLayoutSeeder extends Seeder {
  async run(client: PrismaClient): Promise<void> {
    const factory = new FormLayoutFactory(client);
    await factory.create();
  }
}
