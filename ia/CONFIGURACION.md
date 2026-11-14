# Configuración de IA y seguridad

- `AGENTS.md` (<= 100 líneas) y `CLAUDE.md` (`@AGENTS.md`) configurados antes de generar código.
- `.claude/settings.json` con `permissions.deny` para `.env*`, `*.pem`, `*.key`, `*firebase-adminsdk*.json`, `*.keystore`, `*.jks` y `Edit(./.claude/**)`.
- Sandbox habilitado (`allowUnsandboxedCommands: false`, `blockReadsOutsideWorkingDirectories: true`, `denyRead: ["~/"]`).
- Red restringida a `identitytoolkit.googleapis.com`, `securetoken.googleapis.com`, `api.pwnedpasswords.com`.
- `env.example` con valores ficticios; cero secretos reales en el repositorio.
