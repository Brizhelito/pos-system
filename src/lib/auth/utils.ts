import { NextApiRequest } from "next";
import { user } from "@prisma";
import { createError } from "../api/error";

export const requireAuth = async (req: NextApiRequest) => {
  if (!req.session.user) {
    throw createError("Unauthorized", 401, "UNAUTHORIZED");
  }
  return req.session.user;
};

export const login = async (req: NextApiRequest, user: user) => {
  req.session.user = user;
  await req.session.save();
};

export const logout = async (req: NextApiRequest) => {
  req.session.destroy();
};

export const getCurrentUser = (req: NextApiRequest): user | null => {
  return req.session.user || null;
};
