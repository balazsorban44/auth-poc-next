import { NextRequest } from "next/server";
import { updateSession } from "./lib";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
