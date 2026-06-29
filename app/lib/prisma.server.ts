import { PrismaClient } from "~/generated/prisma/client";

// Ensure we are using a test database when running tests
if (process.env.NODE_ENV === "test") {
  if (!process.env.DATABASE_URL?.includes("test")) {
    throw new Error("Refusing to run tests on a non-test database");
  }
}

// prevent test env from loading when not in test mode
if (
  process.env.NODE_ENV !== "test" &&
  process.env.DATABASE_URL?.includes("test")
) {
  throw new Error(
    "Refusing to load test database environment outside of test mode",
  );
}

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient();
  }
  prisma = global.__db__;
  prisma.$connect();
}

export default prisma;
