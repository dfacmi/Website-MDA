# Firestore Security Specification — Muslim Digital Academy (MDA)

## 1. Data Invariants
1. **Default Deny**: All unknown collections and paths are denied (`allow read, write: if false`).
2. **Admin-Only Mutations**: Only verified administrators (`request.auth.token.email_verified == true` matching the bootstrapped admin email `TeguhAde1926@gmail.com` or registered in `/admins/{uid}`) may create, update, or delete `/site_photos/{slotId}`.
3. **Public Read / Scoped List**: Visitors may read `/site_photos/{slotId}` only for valid IDs (`isValidId(slotId)`) and list only documents explicitly marked `resource.data.isPublic == true`.
4. **Strict Payload & Size Caps**: `slotId` must match `^[a-zA-Z0-9_\-]+$` (1–64 chars) and equal the path `{slotId}`; `dataUrl` must match `^data:image/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$` (32–750,000 chars); `isPublic` must be `true`; `updatedBy` must equal `request.auth.uid`; `updatedAt` must equal `request.time`.
5. **No Client Self-Promotion**: `/admins/{adminUid}` blocks all client `create`, `update`, and `delete` operations.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Unauthenticated Write**: Anonymous visitor attempts `create` on `/site_photos/home_hero`.
2. **Non-Admin Authenticated Write**: Regular signed-in user (`other@gmail.com`) attempts `create` on `/site_photos/home_hero`.
3. **Unverified Admin Email Spoof**: Request with `email: "TeguhAde1926@gmail.com"` and `email_verified: false` attempts `update`.
4. **Shadow / Ghost Field Injection**: Admin sends valid `SitePhoto` plus extra field `isAdmin: true`.
5. **Path-ID Poisoning**: Admin attempts write to `/site_photos/../../evil` or 200-char ID.
6. **SlotId Mismatch**: Admin writes `{ slotId: "gallery_1", ... }` to `/site_photos/home_hero`.
7. **Invalid Image URI / XSS Scheme**: Admin sends `dataUrl: "javascript:alert(1)"` or `data:image/svg+xml;base64,...`.
8. **Oversized Payload (Denial of Wallet)**: Admin sends `dataUrl` exceeding 750,000 characters.
9. **Identity Spoofing on `updatedBy`**: Admin sets `updatedBy: "another-uid"` instead of `request.auth.uid`.
10. **Forged Client Timestamp**: Admin sets `updatedAt` to a client-chosen timestamp instead of `request.time`.
11. **Visibility Tampering**: Admin sets `isPublic: false` on `/site_photos/home_hero`.
12. **Privilege Escalation on `/admins`**: Regular user attempts `create` on `/admins/{theirUid}` with `{ role: "admin" }`.

## 3. Red Team Audit Checklist
- Identity Spoofing: Blocked by `incoming().updatedBy == request.auth.uid` and `isAdmin()` checking `email_verified == true`.
- Shadow Updates: Blocked by `hasAll` + `hasOnly` on create and `affectedKeys().hasOnly(['dataUrl', 'isPublic', 'updatedBy', 'updatedAt'])` + `isValidSitePhoto(incoming())` on update.
- Resource Poisoning: Blocked by `isValidId(slotId)` and explicit `.size()` bounds on every string.
- Query Scraping: `allow list` explicitly checks `resource.data.isPublic == true`.
- PII Isolation: `/admins/{adminUid}` restricts `get` strictly to `isSignedIn() && request.auth.uid == adminUid` and blocks `list`.
