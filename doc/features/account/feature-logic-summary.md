# Feature logic summary — account

| Behavior | Doc file | Notes |
|----------|----------|--------|
| Profile GET/PUT, OTP contact change, uploads, session | [features/profile-put-and-contact-otp.md](features/profile-put-and-contact-otp.md) | `/api/session` 401 vs `/api/auth/me` |
| Upcoming/past bookings BFF | (inline) | Mock lists |
| `profile.service` client helpers | (inline) | Uses `/api/session` |
