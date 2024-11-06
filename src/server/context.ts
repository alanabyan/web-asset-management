import { TRPCError } from "@trpc/server";
import axios from "axios";
import { addHours } from "date-fns";
import { MicrogenClient } from "microgen-v3-sdk";

import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

import { config } from "./config";

/**
 * Defines your inner context shape.
 * Add fields here that the inner context brings.
 */
interface CreateInnerContextOptions extends Partial<CreateNextContextOptions> {
  token: string | undefined;
}

/**
 * System authorization
 */
const systemMicrogen = new MicrogenClient({ apiKey: config.microgenApiKey });
let tokenExpiredAt: Date | undefined;
let systemToken: string | undefined;

/**
 * Inner context. Will always be available in your procedures, in contrast to the outer context.
 *
 * Also useful for:
 * - testing, so you don't have to mock Next.js' `req`/`res`
 * - tRPC's `createServerSideHelpers` where we don't have `req`/`res`
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export async function createContextInner(opts?: CreateInnerContextOptions) {
  const microgen = new MicrogenClient({ apiKey: config.microgenApiKey });

  if (opts?.token) {
    microgen.auth.saveToken(opts.token);
  }

  const now = new Date();

  if (!tokenExpiredAt || tokenExpiredAt.getTime() <= now.getTime()) {
    console.log("== Generating System Token ==");
    const response = await systemMicrogen.auth.login({
      email: config.microgenAdminEmail,
      password: config.microgenAdminPassword,
    });

    if (!response.token) {
      console.log("== Failed Generating System Token ==");
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    console.log("== Success Generating System Token ==");
    tokenExpiredAt = addHours(new Date(), config.accessTokenExpiresInHour);
    systemToken = response.token;
  }

  return { microgen, systemToken };
}

/**
 * Outer context. Used in the routers and will e.g. bring `req` & `res` to the context as "not `undefined`".
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export async function createContext(opts: CreateNextContextOptions) {
  let token;

  if (opts.req.headers.authorization?.startsWith("Bearer")) {
    token = opts.req.headers.authorization.split(" ")[1];
  } else if (opts.req.cookies.token) {
    token = opts.req.cookies.token;
  }

  const contextInner = await createContextInner({ token });

  return {
    ...contextInner,
    req: opts.req,
    res: opts.res,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
