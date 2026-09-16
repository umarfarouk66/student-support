---
name: Student Support Hub authentication
description: Durable role-assignment and data-boundary decisions for the support hub.
---

The support hub treats Clerk authentication as the identity source. A user's `publicMetadata.role` may be `student`, `counselor`, or `administrator`; missing or unrecognized values default to Student. Counselor and Administrator access must be assigned deliberately outside the client.

**Why:** The previous role switcher was only a local browser control and could not provide security. Defaulting to Student prevents an unassigned account from receiving elevated access.

**How to apply:** Keep role checks in both the protected UI and authenticated API endpoints. When replacing browser demo storage with a database, preserve the same role and privacy boundary: students see their own shared information, counselors see assigned care, and administrators see operational data without private note content.