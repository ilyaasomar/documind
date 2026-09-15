import { db } from "@/db"
import {betterAuth} from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { organization } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js"
export const auth = betterAuth({
database: drizzleAdapter(db,{
provider: "pg"
}),

emailAndPassword: {
    enabled: true,
},

plugin: [
    organization(),
    nextCookies(),
]

})