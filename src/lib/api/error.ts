import { NextResponse } from "next/server";

export class APIError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

export const createError = (
  message: string,
  statusCode: number,
  code: string
) => {
  return new APIError(message, statusCode, code);
};

export const handleError = (error: unknown) => {
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        message: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  console.error("Unhandled error:", error);
  const errorMessage =
    error instanceof Error ? error.message : "Internal Server Error";
  return NextResponse.json(
    {
      message: errorMessage,
      code: "INTERNAL_SERVER_ERROR",
    },
    { status: 500 }
  );
};
