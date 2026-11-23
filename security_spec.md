# Firestore Security Specification — Muslim Digital Academy (MDA)

## 1. Data Invariants
1. **Default Deny**: All unknown collections and paths are denied (`allow read, write: if false`).
2. **Admin-Only Photo Mutations**: Only verified administrators (`request.auth.token.email_verified == true` matching the bootstrapped admin email `TeguhAde1926@gmail.com` or registered in `/admins/{uid}`) may create, update, or delete `/site_photos/{slotId}`.
3. **Public Read / Scoped List on Photos**: Visitors may read `/site_photos/{slotId}` only for valid IDs (`isValidId(slotId)`) and list only documents explicitly marked `resource.data.isPublic == true`.
4. **Write-Once Public Forms with Strict PII Isolation**:
   - `/ppdb_registrations/{registrationId}` and `/contact_messages/{messageId}` allow unauthenticated prospective students/parents to `create` a single validated submission (strict allowlisted keys, length bounds, server `createdAt == request.time`, initial `status == 'baru'`).
   - All `get`, `list`, `update`, and `delete` operations on `/ppdb_registrations` and `/contact_messages` are strictly restricted to verified `isAdmin()` only so zero applicant PII (`studentName`, `parentName`, `whatsapp`, `email`) can ever be read or enumerated by visitors.
5. **No Client Self-Promotion**: `/admins/{adminUid}` blocks all client `create`, `update`, and `delete` operations.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated Photo Write**: Anonymous visitor attempts `create` on `/site_photos/home_hero`.
2. **Non-Admin Photo Write**: Signed-in non-admin attempts `create` on `/site_photos/home_hero`.
3. **Unverified Admin Email Spoof**: Request with `email: "TeguhAde1926@gmail.com"` and `email_verified: false` attempts `update` or reading `/ppdb_registrations`.
4. **Shadow / Ghost Field Injection**: Payload includes valid fields plus extra `isAdmin: true` on `/site_photos`, `/ppdb_registrations`, or `/contact_messages`.
5. **Path-ID Poisoning**: Write to `/ppdb_registrations/../../evil` or 200-char ID.
6. **Document ID Mismatch**: Write `{ registrationId: "OTHER" }` to `/ppdb_registrations/MDA-2026-1234`.
7. **Invalid Image URI / XSS Scheme**: Admin sends `dataUrl: "javascript:alert(1)"` to `/site_photos/home_hero`.
8. **Oversized Payload (Denial of Wallet)**: Visitor submits 50KB `notes` or `message` string to `/ppdb_registrations` or `/contact_messages`.
9. **PII Leak Attempt**: Unauthenticated or non-admin user attempts `get` or `list` on `/ppdb_registrations` or `/contact_messages`.
10. **Forged Client Timestamp**: Visitor sets `createdAt` to a client-chosen timestamp instead of `request.time`.
11. **Status Tampering on Create**: Visitor submits `status: "selesai"` instead of `"baru"` on `/ppdb_registrations`.
12. **Privilege Escalation on `/admins`**: Regular user attempts `create` on `/admins/{theirUid}` with `{ role: "admin" }`.

## 3. Red Team Audit Checklist
- Identity Spoofing: Blocked by `isVerifiedUser()` + `isAdmin()` checking `email_verified == true`.
- Shadow Updates: Blocked by `hasAll` + `hasOnly` on create and `affectedKeys().hasOnly(...)` + validation helper on every update.
- Resource Poisoning: Blocked by `isValidId(...)` and explicit `.size()` bounds on every string.
- PII Isolation: `ppdb_registrations` and `contact_messages` restrict all `get`/`list` strictly to `isAdmin()`.
- Temporal Integrity: Every `createdAt` / `updatedAt` enforces `== request.time`.
