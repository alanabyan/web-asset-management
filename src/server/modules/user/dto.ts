import { z } from "zod";

import { ownSeriesSchema, timeSeriesSchema } from "@/server/type";

export const storageSchema = z.object({
  _id: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  url: z.string(),
});

export const loginUserInput = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Your Password must be 8 characters or longer." }),
});

export type LoginUserInput = z.infer<typeof loginUserInput>;

export const userSchema = z
  .object({
    _id: z.string(),
    firstName: z.string(),
    lastName: z.string().nullable(),
    email: z.string(),
    phoneNumber: z.string().nullable(),
    role: z.array(z.string()),
    avatar: z.array(storageSchema).optional(),
  })
  .merge(timeSeriesSchema)
  .merge(ownSeriesSchema);

export type LoginUser = z.infer<typeof userSchema>;

export const loginQrUserInput = z.object({
  token: z.string({ required_error: "Token is required" }),
  user: userSchema,
  deviceId: z.string(),
});

export type LoginQrUserInput = z.infer<typeof loginQrUserInput>;

export const generateQRInput = z.object({
  deviceId: z.string(),
  deviceModel: z.string(),
  deviceName: z.string(),
  deviceOs: z.string(),
  deviceVersion: z.string(),
  platformName: z.string(),
});

export type GenerateQRInput = z.infer<typeof generateQRInput>;

export const logoutInput = z.object({
  sessionId: z.string().optional(),
});

export type LogoutInput = z.infer<typeof logoutInput>;
