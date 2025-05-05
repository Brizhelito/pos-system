import { Customer } from "@/types/Customer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, User } from "lucide-react";
import { motion } from "framer-motion";

interface CustomerDetailsProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onContinue: () => void;
}

export function CustomerDetails({ customer, onEdit, onContinue }: CustomerDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className="p-4 border-green-200 bg-green-50">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="text-green-600" size={20} />
              <h3 className="text-lg font-medium">{customer.name}</h3>
            </div>
            
            <div className="text-sm space-y-1 text-slate-700">
              <p><span className="font-medium">Cédula:</span> {customer.cedula || "No especificada"}</p>
              <p><span className="font-medium">Teléfono:</span> {customer.phone || "No especificado"}</p>
              <p><span className="font-medium">Email:</span> {customer.email || "No especificado"}</p>
            </div>
          </div>
          
          <Button variant="outline" size="sm" onClick={() => onEdit(customer)}>
            <Edit size={16} className="mr-2" />
            Editar
          </Button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-green-200 flex justify-between items-center">
          <p className="text-sm text-green-700">Cliente seleccionado correctamente</p>
          <Button onClick={onContinue}>
            Continuar con este cliente
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
