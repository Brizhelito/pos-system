import {
  SessionOptions,
  getIronSession,
  IronSession,
  IronSessionData,
} from "iron-session";
import { user } from "@prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { AUTH_CONFIG } from "@/lib/config/env";

export const sessionOptions: SessionOptions = {
  password: AUTH_CONFIG.secretCookiePassword,
  cookieName: AUTH_CONFIG.cookieName,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * AUTH_CONFIG.sessionDurationDays, // Duración configurable
  },
};

declare module "iron-session" {
  interface IronSessionData {
    user?: user;
  }
}

declare module "next" {
  interface NextApiRequest {
    session: IronSession<IronSessionData>;
  }
}

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export const withSession = (handler: Handler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const session = await getIronSession(req, res, sessionOptions);
      req.session = session;
      return handler(req, res);
    } catch (error) {
      console.error("Session error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};
