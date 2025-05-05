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
  return NextResponse.json(
    {
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR",
    },
    { status: 500 }
  );
};
