import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { D1Database } from "@cloudflare/workers-types";

type PrismaClientWithD1 = PrismaClient;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientWithD1 | undefined;
};

/**
 * Returns a Prisma client backed by the Cloudflare D1 binding.
 *
 * The client is cached per isolate (workerd global) — the D1 binding is
 * stable for the lifetime of the isolate, so reuse is safe and cheap.
 */
export async function getPrisma(): Promise<PrismaClientWithD1> {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const { env } = await getCloudflareContext({ async: true });
  const d1 = (env as unknown as { DB: D1Database }).DB;
  const adapter = new PrismaD1(d1);

  const client = new PrismaClient({ adapter });
  globalForPrisma.prisma = client;
  return client;
}
