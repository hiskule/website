# 📜 Database Seeding Rules & Conventions

Because our platform uses a unified login system without requiring users to manually select a competition, we rely heavily on the integrity of our seed data (`competitions.json`). 

Whenever you add a new competition to `competitions.json`, you **MUST** follow these rules to ensure the backend routing does not break.

## 1. Globally Unique Usernames (CRITICAL)
Every single `username` for a Judge or Team must be **globally unique across all time and all competitions**. If two users have the same username, the backend will always log them into the first competition it finds.

**Naming Convention:**
`[Identifier]_[CompetitionAbbreviation]_[Year]`

**Examples:**
- Judge Alice judging UTHSDC in 2026: `"username": "alice_uthsdc_26"`
- Team 5 competing in UTHSDC in 2026: `"username": "team5_uthsdc_26"`
- Judge Alice judging UTHSDC in 2027: `"username": "alice_uthsdc_27"`

## 2. The `isActive` Flag
The `Competition` model has an `isActive` boolean flag. This is used by the backend to determine if users belonging to this competition are currently allowed to log in.

- Only **ONE** competition in the `competitions.json` file should ever have `"isActive": true`.
- If you set `"isActive": false` for all competitions, the platform effectively goes into "Maintenance / Lockdown" mode and no one can log in.

## 3. Password Standards
For simplicity during the event, universal passwords can be used (e.g., all judges use `"password": "judgepassword"`), but remember that the `username` is what secures their specific profile.
