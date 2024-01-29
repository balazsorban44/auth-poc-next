import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export function encrypt(input: any): string {
  return JSON.stringify(input);
}

export function decrypt(input: string): any {
  return JSON.parse(input);
}

export async function login(formData: FormData) {
  "use server";
  // Verify credentials && get the user

  const user = { email: formData.get("email"), name: "John" };

  // Create the session
  const expires = new Date(Date.now() + 10 * 1000);
  const session = encrypt({ user, expires });

  // Save the session in a cookie
  cookies().set("session", session, { expires, httpOnly: true });
}

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
