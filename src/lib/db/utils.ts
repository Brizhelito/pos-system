/**
 * Función de utilidad para convertir IDs de string a number cuando sea necesario
 */
export const parseId = (id: string | number): number => {
  return typeof id === "string" ? parseInt(id, 10) : id;
};

/**
 * Utilidad para manejar errores de base de datos
 */
export const handleDbError = (error: unknown): Error => {
  console.error("Database error:", error);
  if (error instanceof Error) {
    return error;
  }
  return new Error("Ocurrió un error al acceder a la base de datos");
};
