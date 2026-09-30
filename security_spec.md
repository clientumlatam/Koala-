# Security Specification & Threat Model — Firebase Firestore Security Rules

## 1. Core Data Invariants & Security Guarantees
1. **RBAC & User Isolation**:
   * Users can only read/write their own user profile document `/users/$(request.auth.uid)`.
   * Roles (`role: 'admin'`) can only be modified by existing admins or initialized during initial user boot.
2. **Product Catalog Security**:
   * Products `/products/{productId}` are publicly readable by any client.
   * Product mutations (create/update/delete) are restricted to authenticated admins or backend sync service.
3. **Order Placement Security**:
   * Any authenticated or guest user can create an order `/orders/{orderId}`, provided required schema keys match and `status == 'pending'`.
   * Order status updates to `completed` or `cancelled` require `isAdmin()` or owner verification.
4. **ICXN Webhook Events Audit Log**:
   * `/webhookEvents/{eventId}` can only be written by authenticated admin/gateway services and read by authenticated admin/operator roles.

---

## 2. The "Dirty Dozen" Vulnerability Payloads

1. **Payload 1 (Ghost Field / Shadow Key Attack)**: Attempting to update a product with an unapproved key `{ "sku": "POL-1", "name": "Item", "price": 100, "isFree": true }`.
2. **Payload 2 (Self-Elevated Privilege Attack)**: Customer creating profile with `{ "role": "admin" }`.
3. **Payload 3 (Id Poisoning Attack)**: Writing to `/products/../../../etc/passwd`.
4. **Payload 4 (Over-sized Payload Attack)**: Injecting 2MB string into `description`.
5. **Payload 5 (Unauthenticated Product Mutation)**: Guest user attempting `setDoc` on `/products/p1`.
6. **Payload 6 (Terminal State Bypass)**: Customer updating completed order status back to `pending`.
7. **Payload 7 (Timestamp Spoofing Attack)**: Sending client-clock fake timestamp `{ "createdAt": "2099-01-01T00:00:00.000Z" }`.
8. **Payload 8 (PII Leak Attack)**: Unauthenticated user listing all `/users` documents.
9. **Payload 9 (Order Price Tampering)**: Creating order with negative total `{ "total": -500 }`.
10. **Payload 10 (Webhook Log Injection)**: Non-admin writing fake success webhooks to `/webhookEvents/ev1`.
11. **Payload 11 (Invalid Enum State Attack)**: Setting order status to `"invalid_status"`.
12. **Payload 12 (Owner UID Spoofing Attack)**: Creating user document for another UID.
