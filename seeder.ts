import "dotenv/config";
import { DatabaseSeeder } from "./app/database/seeders/DatabaseSeeder";

const seeder = new DatabaseSeeder();
seeder.run();
console.log("Seeding Completed");
