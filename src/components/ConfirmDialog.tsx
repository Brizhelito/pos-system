import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, X, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "destructive";
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmVariant = "default",
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onConfirm();
      onClose();
    }
  };

  const slideUp = {
    hidden: {
      opacity: 0,
      y: 20,
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
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence mode="wait">
        {isOpen && (
          <AlertDialogContent
            onKeyDown={handleKeyDown}
            className="p-0 border-none shadow-xl overflow-hidden"
            forceMount
          >
            <motion.div
              variants={slideUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="p-6"
            >
              <AlertDialogHeader className="gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`rounded-full p-2 ${
                      confirmVariant === "destructive"
                        ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {confirmVariant === "destructive" ? (
                      <AlertTriangle size={24} />
                    ) : (
                      <AlertCircle size={24} />
                    )}
                  </div>
                  <div>
                    <AlertDialogTitle className="text-xl font-semibold mb-2">
                      {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                      {description}
                    </AlertDialogDescription>
                  </div>
                </div>
              </AlertDialogHeader>

              <AlertDialogFooter className="gap-2 mt-6 flex justify-end sm:justify-end">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <AlertDialogCancel
                    onClick={onClose}
                    className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X size={16} />
                    {cancelText}
                  </AlertDialogCancel>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <AlertDialogAction
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                    className={`flex items-center gap-1 ${
                      confirmVariant === "destructive"
                        ? "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                        : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                    }`}
                  >
                    <CheckCircle size={16} />
                    {confirmText}
                  </AlertDialogAction>
                </motion.div>
              </AlertDialogFooter>
            </motion.div>
          </AlertDialogContent>
        )}
      </AnimatePresence>
    </AlertDialog>
  );
};

export default ConfirmDialog;
 