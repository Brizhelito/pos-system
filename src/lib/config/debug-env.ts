export function debugEnv() {
  console.log("===== VARIABLES DE ENTORNO =====");
  console.log(
    "DATABASE_URL:",
    process.env.DATABASE_URL ? "DEFINIDO" : "NO DEFINIDO"
  );
  console.log("COMPANY_NAME:", process.env.COMPANY_NAME);
  console.log("CURRENCY_LOCALE:", process.env.CURRENCY_LOCALE);
  console.log("================================");
}
