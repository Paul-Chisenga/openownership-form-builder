import Seeder from "~/core/Seeder";
import InputDataTypeSeeder from "./InputDataTypeSeeder";
import prisma from "~/lib/prisma.server";
import ValidationRuleSeeder from "./ValidationRuleSeeder";
import FormLayoutSeeder from "./FormLayoutSeeder";
import FormFieldSeeder from "./FormFieldSeeder";

export class DatabaseSeeder extends Seeder {
  protected seederChunks: Seeder[][] = [
    [
      new ValidationRuleSeeder(),
      new InputDataTypeSeeder(),
      new FormLayoutSeeder(),
      new FormFieldSeeder(),
    ],
  ];
  async run() {
    console.log("Running database seeder...");

    await prisma.$transaction(
      async (tx) => {
        await this.call(tx, this.seederChunks.flat());
      },
      {
        timeout: 180000, // 3 minutes
      },
    );
    console.log("Database seeding completed.");
  }
}
