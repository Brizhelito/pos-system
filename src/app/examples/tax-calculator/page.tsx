import TaxCalculator from "@/components/examples/tax-calculator";
import config from "@/lib/config/env";

export default function TaxCalculatorPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Ejemplo de Calculadora de Impuestos
      </h1>

      <div className="bg-amber-50 dark:bg-slate-700/50 p-4 rounded-lg mb-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">Configuración Actual</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Impuestos:{" "}
            <strong>
              {config.tax.enabled ? "Habilitados" : "Deshabilitados"}
            </strong>
          </li>
          {config.tax.enabled && (
            <>
              <li>
                Tipo de impuesto: <strong>{config.tax.label}</strong>
              </li>
              <li>
                Tasa: <strong>{config.tax.percentage}</strong>
              </li>
            </>
          )}
          <li>
            Moneda:{" "}
            <strong>
              {config.currency.code} ({config.currency.symbol})
            </strong>
          </li>
          <li>
            Formato regional: <strong>{config.currency.locale}</strong>
          </li>
        </ul>
      </div>

      <TaxCalculator />

      <div className="mt-8 bg-slate-100 dark:bg-slate-800 p-6 rounded-lg shadow max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">
          Cómo usar la configuración de impuestos
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">
              1. Importar la configuración
            </h3>
            <pre className="bg-slate-800 text-green-400 p-3 rounded mt-2 overflow-x-auto">
              <code>import config from &quot;@/lib/config/env&quot;;</code>
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              2. Verificar si los impuestos están habilitados
            </h3>
            <pre className="bg-slate-800 text-green-400 p-3 rounded mt-2 overflow-x-auto">
              <code>{`if (config.tax.enabled) {
  // Calcular impuestos
} else {
  // No aplicar impuestos
}`}</code>
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              3. Calcular impuestos para un monto
            </h3>
            <pre className="bg-slate-800 text-green-400 p-3 rounded mt-2 overflow-x-auto">
              <code>{`// Calcular solo el impuesto
const taxAmount = config.tax.calculate(subtotal);

// Calcular el total incluyendo impuestos
const total = config.tax.calculateTotal(subtotal);`}</code>
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              4. Formatear montos como moneda
            </h3>
            <pre className="bg-slate-800 text-green-400 p-3 rounded mt-2 overflow-x-auto">
              <code>{`// Formatear un monto como moneda
const formattedPrice = config.currency.format(price);
// Ejemplo: "$123.45"`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
