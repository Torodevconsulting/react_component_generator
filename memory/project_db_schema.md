---
name: Database schema reference
description: The database schema is defined in prisma/schema.prisma — always reference it to understand stored data structures
type: feedback
---

Always read `prisma/schema.prisma` to understand the structure of data stored in the database.

**Why:** User explicitly instructed this as the source of truth for data models.

**How to apply:** Any time a task involves database queries, models, migrations, or data shapes — open `prisma/schema.prisma` first before making assumptions.
