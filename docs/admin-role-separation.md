# Administrator role separation

Waypoint administrator accounts are deliberately separate from professional accounts.

An account with the `admin` role is not authorised to use privileged professional-management functions if a professional account also exists for the same user. This prevents an administrator from reviewing or approving their own professional credentials and keeps the administrative identity distinct from clinical access.

The initial Waypoint administrator is therefore an admin-only account. Professional testing and clinical use should use a separate login.

Legacy admin route handling

`/admin/professional` is treated as a legacy singular route and redirects to the canonical `/admin/professionals` route. Sign-in and MFA return paths also normalise the legacy route before redirecting.
