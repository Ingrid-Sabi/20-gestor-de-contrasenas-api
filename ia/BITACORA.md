# Bitácora de revisión de IA

1. **Rechazo de `as` en errores de Zod:** se reemplazó cualquier cast inseguro por `safeParse` y `jsonZodError`.
2. **Aislamiento de `uid`:** se verificó que `GET/PUT /api/respaldo` obtengan `uid` exclusivamente del token verificado (`verifyIdToken`), nunca del cuerpo o parámetros.
3. **Sin secretos en logs:** se prohibió `console.log` mediante ESLint (`no-console: error`) para evitar fugas de tokens o contraseñas.
