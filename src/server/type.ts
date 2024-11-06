import { z } from "zod";

export const uuid = z.string().uuid();

export const attachmentSchema = z.object({
  fileName: z.string().optional(),
  url: z.string(),
});

export const linkToRecordSchema = z.object({
  _id: z.string(),
  name: z.string(),
});

export const customLTRSchema = linkToRecordSchema.omit({ name: true });

export const timeSeriesSchema = z.object({
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
});

export const ownSeriesSchema = z.object({
  createdBy: z
    .union([
      z.string(),
      z.object({
        firstName: z.string(),
        lastName: z.string().nullable(),
      }),
    ])
    .nullish(),
  updatedBy: z
    .union([
      z.string(),
      z.object({
        firstName: z.string(),
        lastName: z.string().nullable(),
      }),
    ])
    .nullish(),
});

const primitiveSchema = z.union([z.string(), z.number(), z.boolean()]);

const whereRecord = <T extends z.ZodTypeAny>(key: T) =>
  z.record(
    key,
    z.union([
      primitiveSchema,
      z.object({
        $in: z.union([primitiveSchema, z.array(primitiveSchema)]).optional(),
        $nin: z.union([primitiveSchema, z.array(primitiveSchema)]).optional(),
        $ne: primitiveSchema.optional(),
        $contains: primitiveSchema.optional(),
        $notContains: primitiveSchema.optional(),
        $lt: z.union([z.number(), z.string()]).optional(),
        $lte: z.union([z.number(), z.string()]).optional(),
        $gt: z.union([z.number(), z.string()]).optional(),
        $gte: z.union([z.number(), z.string()]).optional(),
        isEmpty: z.boolean().optional(),
        isNotEmpty: z.boolean().optional(),
      }),
    ]),
  );

const sortRecord = <T extends z.ZodTypeAny>(key: T) =>
  z.record(key, z.union([z.literal(1), z.literal(-1)]));

type Lookup =
  | string
  | string[]
  | Partial<
      Record<
        "*" | "_id",
        | string
        | (
            | string
            | Partial<
                Record<
                  string,
                  {
                    $select?: string[];
                    $lookup?: Lookup;
                  }
                >
              >
          )[]
      >
    >;

const lookupRecordR: z.ZodType<Lookup> = z.union([
  z.string(),
  z.array(z.string()),
  z.record(
    z.enum(["*", "_id"]),
    z.union([
      z.string(),
      z.array(
        z.union([
          z.string(),
          z.record(
            z.string(),
            z.object({
              $select: z.array(z.string()).optional(),
              $lookup: z.lazy(() => lookupRecordR).optional(),
            }),
          ),
        ]),
      ),
    ]),
  ),
]);

const lookupRecord = <T extends z.ZodTypeAny>(key: T) =>
  z.union([
    z.literal("*"),
    key,
    z.array(key),
    z.record(
      z.enum(["*", "_id"]),
      z.union([
        z.literal("*"),
        key,
        z.array(
          z.union([
            key,
            z.record(
              key,
              z.object({
                $select: z.array(z.string()).optional(),
                $lookup: lookupRecordR.optional(),
              }),
            ),
          ]),
        ),
      ]),
    ),
  ]);

export const filterInput = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
) => {
  type Key = string & keyof T;
  const keyof = schema.keyof() as unknown as z.ZodEnum<[Key, ...Key[]]>;

  return z.object({
    limit: z.number().optional(),
    skip: z.number().optional(),
    where: whereRecord(keyof).optional(),
    sort: z.array(sortRecord(keyof)).optional(),
    select: z.array(keyof).optional(),
    lookup: lookupRecord(keyof).optional(),
    or: z.array(whereRecord(keyof)).optional(),
  });
};

export type NoStringObject<T> = Exclude<T, string>;

export type NoStringArray<T> = {
  [K in keyof T]: Exclude<T[K], string>;
};

export interface FunctionResponse<T> {
  data: T;
  message: string;
  statusCode: number;
  timestamp: Date;
}
