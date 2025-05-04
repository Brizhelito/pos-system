import { mockDeep } from "jest-mock-extended";

// Mock next/router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: {},
      asPath: "",
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock iron-session
jest.mock("iron-session", () => ({
  getIronSession: jest.fn().mockResolvedValue({
    user: {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      role: "ADMIN",
    },
    save: jest.fn(),
    destroy: jest.fn(),
  }),
}));

// Mock Request and Response for Next.js API routes
if (typeof window === "undefined") {
  const { Request, Response, Headers } = await import("node-fetch");
  global.Request = Request;
  global.Response = Response;
  global.Headers = Headers;
}

// Mock PrismaClient
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => mockDeep()),
}));
