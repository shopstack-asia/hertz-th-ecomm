# Feature logic summary — auth

| Behavior | Doc file | Notes |
|----------|----------|--------|
| Login, logout, `/me`, magic OTP login | [features/credentials-and-magic-otp-session.md](features/credentials-and-magic-otp-session.md) | Cookie `hertz_session` |
| Signup: consent, OTP verify/resend, password complete | [features/signup-consent-otp-and-complete.md](features/signup-consent-otp-and-complete.md) | Complete route cookie gap documented |
| Forgot password OTP + reset | [features/forgot-password-otp-flow.md](features/forgot-password-otp-flow.md) | Mock reset does not update password store |
| OAuth start + callback (Google/Apple) | [features/oauth-start-callback-and-session.md](features/oauth-start-callback-and-session.md) | Mock client id; real IdP URLs |
| `AuthProvider` refresh behavior | (inline) | Failed `/me` fetch keeps prior state |
