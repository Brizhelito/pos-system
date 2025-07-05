"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  XCircle,
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Lock,
  CheckCircle,
} from "lucide-react";

import { LoginRequest, LoginRequestSchema } from "@/types/User";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="ml-2">{message}</AlertDescription>
      </Alert>
    </motion.div>
  );
};

const FieldErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-1 text-red-500 dark:text-red-400 text-sm mt-1"
    >
      <XCircle className="h-4 w-4" />
      <span>{message}</span>
    </motion.div>
  );
};

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const form = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginRequest) {
    setErrorMessage(null);
    try {
      const response = await axios.post("/api/login", data);
      console.log("Inicio de sesión exitoso", response.data);
      setLoginSuccess(true);
      setTimeout(() => {
        setLoginSuccess(false);
        window.location.assign("/dashboard");
      }, 2000);
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Ocurrió un error inesperado. Por favor intenta nuevamente.";
      setErrorMessage(message);
      console.error("Error al iniciar sesión", error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-sm p-6 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <motion.div
              animate={{ y: loginSuccess ? -10 : 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <CardTitle className="text-center text-2xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent dark:from-primary-dark dark:to-blue-400">
                ¡Estamos felices de verte de nuevo!
              </CardTitle>
            </motion.div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
              Inicia sesión para acceder a tu cuenta
            </p>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {loginSuccess && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-600 dark:text-green-400 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>¡Autenticación exitosa!</span>
                  </motion.div>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-300">
                        Correo electrónico
                      </FormLabel>
                      <FormControl>
                        <motion.div whileHover={{ scale: 1.01 }}>
                          <div className="relative">
                            <Input
                              id="email"
                              type="email"
                              placeholder="ejemplo@correo.com"
                              className="focus-visible:ring-primary pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                              {...field}
                            />
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                          </div>
                        </motion.div>
                      </FormControl>
                      <FormMessage>
                        <FieldErrorMessage
                          message={form.formState.errors.email?.message}
                        />
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel className="dark:text-gray-300">
                          Contraseña
                        </FormLabel>
                      </div>
                      <FormControl>
                        <motion.div whileHover={{ scale: 1.01 }}>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="focus-visible:ring-primary pl-10 pr-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                              {...field}
                            />
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-primary-dark"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </motion.div>
                      </FormControl>
                      <FormMessage>
                        <FieldErrorMessage
                          message={form.formState.errors.password?.message}
                        />
                        <ErrorMessage message={errorMessage ?? undefined} />
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark flex gap-2 items-center justify-center relative overflow-hidden 
                      dark:bg-primary-dark dark:hover:bg-primary-700"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting && (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer dark:via-slate-700/30" />
                      </>
                    )}
                    {form.formState.isSubmitting
                      ? "Iniciando sesión..."
                      : "Iniciar sesión"}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
