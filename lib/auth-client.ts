import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  // baseURL: "http://localhost:3000", // the reason is to access also from the phone
});
export const { signIn, signUp, signOut, useSession } = createAuthClient();
