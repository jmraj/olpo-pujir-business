# Security Specification (`security_spec.md`) — অল্প পুঁজির ব্যবসা

## 1. Data Invariants
1. **Default-Deny Catch-All**: Every unmatched path is strictly denied (`allow read, write: if false;`).
2. **PII Isolation & User Profile Protection**: `/users/{userId}` contains PII (`email`, `phone`). Only `isOwner(userId)` or `isAdmin()` may `get` or `list` the document. Users cannot self-assign `role != 'user'`, `membershipTier != 'free'`, or non-zero initial balances on creation, nor can users modify `walletBalance`, `points`, `role`, `status`, or `membershipTier` during updates.
3. **Strict Temporal Integrity**: Every `createdAt` and `updatedAt` timestamp on write operations is validated against `request.time`.
4. **Path Variable Hardening**: Every single-document operation (`get`, `create`, `update`, `delete`) validates `isValidId(docId)` (`^[a-zA-Z0-9_\-]+$`, max 128 chars).
5. **Terminal State Locking**: Once a `WithdrawalRequest` (`approved`, `rejected`, `cancelled`) or `MembershipRequest` (`verified`, `failed`) reaches a terminal state, standard users cannot mutate it.
6. **Secure List Queries**: Every `allow list` rule evaluates `resource.data` (e.g., `resource.data.userId == request.auth.uid` for private collections, or `resource.data.enabled == true` / `resource.data.published == true` for public catalogs) without calling `get()` or `exists()` inside `list`.

## 2. The "Dirty Dozen" Payloads
1. **Self-Assigned Admin Role on Signup**: Creating `/users/u1` with `role: "super_admin"` -> `PERMISSION_DENIED`.
2. **Wallet Balance Inflation on Update**: Updating `/users/u1` with `walletBalance: 999999` as non-admin -> `PERMISSION_DENIED`.
3. **Shadow Field Injection**: Updating `/users/u1` with `{ fullName: "Valid", isVerifiedAdmin: true }` -> `PERMISSION_DENIED`.
4. **PII Blanket Read**: Authenticated user `u2` attempting `get(/users/u1)` -> `PERMISSION_DENIED`.
5. **Spoofed Email Admin Bypass**: User with `email == "hasanmehedy670@gmail.com"` but `email_verified == false` attempting admin write -> `PERMISSION_DENIED`.
6. **ID Poisoning Attack**: Creating document with 500-char ID or invalid characters -> `PERMISSION_DENIED`.
7. **Seller Identity Spoofing**: User `u1` creating `/products/p1` with `sellerId: "u2"` -> `PERMISSION_DENIED`.
8. **Self-Approving Withdrawal**: User `u1` updating `/withdrawals/w1` to `status: "approved"` -> `PERMISSION_DENIED`.
9. **Terminal State Re-opening**: User `u1` updating `/withdrawals/w1` from `status: "rejected"` back to `status: "pending"` -> `PERMISSION_DENIED`.
10. **Fake Timestamp Injection**: Creating `/orders/o1` with a past/future `createdAt != request.time` -> `PERMISSION_DENIED`.
11. **Unbounded Array Poisoning**: Updating `/users/u1` `favorites` with > 100 items -> `PERMISSION_DENIED`.
12. **Self-Verified Membership**: User `u1` creating `/memberships/m1` with `status: "verified"` -> `PERMISSION_DENIED`.
