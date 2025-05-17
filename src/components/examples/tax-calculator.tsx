"use client";

import { useState } from "react";
import config from "@/lib/config/env";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function TaxCalculator() {
  const [amount, setAmount] = useState<number>(100);
  const [useCustomTaxSettings, setUseCustomTaxSettings] =
    useState<boolean>(false);
  const [taxEnabled, setTaxEnabled] = useState<boolean>(config.tax.enabled);
  const [taxRate, setTaxRate] = useState<number>(config.tax.rate);

  // Calcular usando la configuración actual o la global
  const calculateTax = (baseAmount: number) => {
    if (useCustomTaxSettings) {
      return taxEnabled ? baseAmount * taxRate : 0;
    }
    return config.tax.calculate(baseAmount);
  };

  const calculateTotal = (baseAmount: number) => {
    if (useCustomTaxSettings) {
      return taxEnabled ? baseAmount * (1 + taxRate) : baseAmount;
    }
    return config.tax.calculateTotal(baseAmount);
  };

  const taxAmount = calculateTax(amount);
  const totalAmount = calculateTotal(amount);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Calculadora de Impuestos</h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Monto Base</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">
              {config.currency.symbol}
            </span>
            <Input
              id="amount"
              type="number"
              className="pl-8"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="custom-settings"
            checked={useCustomTaxSettings}
            onCheckedChange={setUseCustomTaxSettings}
          />
          <Label htmlFor="custom-settings">
            Usar configuración personalizada
          </Label>
        </div>

        {useCustomTaxSettings && (
          <div className="space-y-4 border-l-4 border-blue-500 pl-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="tax-enabled"
                checked={taxEnabled}
                onCheckedChange={setTaxEnabled}
              />
              <Label htmlFor="tax-enabled">Impuestos habilitados</Label>
            </div>

            {taxEnabled && (
              <div className="space-y-2">
                <Label htmlFor="tax-rate">Tasa de Impuesto</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="tax-rate"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                  />
                  <span>({(taxRate * 100).toFixed(2)}%)</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configuración actual:
              </p>
              <p className="text-sm">
                <span className="font-medium">
                  Impuestos:{" "}
                  {useCustomTaxSettings
                    ? taxEnabled
                      ? "Habilitados"
                      : "Deshabilitados"
                    : config.tax.enabled
                    ? "Habilitados"
                    : "Deshabilitados"}
                </span>
              </p>
              {(useCustomTaxSettings ? taxEnabled : config.tax.enabled) && (
                <p className="text-sm">
                  <span className="font-medium">
                    Tasa:{" "}
                    {useCustomTaxSettings
                      ? `${(taxRate * 100).toFixed(2)}%`
                      : config.tax.percentage}
                  </span>
                </p>
              )}
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Subtotal:
              </p>
              <p className="font-medium">{config.currency.format(amount)}</p>

              {(useCustomTaxSettings ? taxEnabled : config.tax.enabled) && (
                <>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {useCustomTaxSettings
                      ? `Impuesto (${(taxRate * 100).toFixed(2)}%):`
                      : `${config.tax.label} (${config.tax.percentage}):`}
                  </p>
                  <p className="font-medium">
                    {config.currency.format(taxAmount)}
                  </p>
                </>
              )}

              <p className="text-lg font-bold mt-2">
                Total: {config.currency.format(totalAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
