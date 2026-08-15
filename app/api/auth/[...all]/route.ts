import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export async function GET(request: Request) {
  const { GET } = toNextJsHandler(await getAuth());
  return GET(request);
}

export async function POST(request: Request) {
  const { POST } = toNextJsHandler(await getAuth());
  return POST(request);
}
