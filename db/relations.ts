import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  user: {
    sessions: r.many.session(),
    accounts: r.many.account(),
  },
  sessions: {
    user: r.one.user({ from: r.session.userId, to: r.user.id }),
  },
  accounts: {
    user: r.one.user({ from: r.account.userId, to: r.user.id }),
  },

  // tomorrow i will add relations for organization, member and other tables
}));
