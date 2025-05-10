import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
  showPrintButton?: boolean;
  onPrint?: () => void;
}

/**
 * Componente de diálogo reutilizable para mostrar detalles de entidades
 * como productos, clientes, etc.
 */
const DetailDialog: React.FC<DetailDialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-2xl",
  showPrintButton = false,
  onPrint,
}) => {
  const dropIn = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence mode="wait">
        {isOpen && (
          <DialogContent
            className={`${maxWidth} max-h-[85vh] overflow-auto p-0 border-none shadow-xl bg-white dark:bg-gray-900`}
            onEscapeKeyDown={onClose}
            forceMount
          >
            <motion.div
              variants={dropIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="p-6"
            >
              <DialogHeader className="pb-4 border-b dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-bold">
                    {title}
                  </DialogTitle>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="rounded-full p-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              </DialogHeader>

              <div className="py-6">{children}</div>

              <DialogFooter className="gap-2 pt-4 border-t dark:border-gray-800">
                {showPrintButton && onPrint && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      onClick={onPrint}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 flex items-center gap-1"
                    >
                      <Printer size={16} />
                      Imprimir
                    </Button>
                  </motion.div>
                )}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X size={16} />
                    Cerrar
                  </Button>
                </motion.div>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default DetailDialog;
