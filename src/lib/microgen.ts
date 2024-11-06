import { MicrogenClient } from "microgen-v3-sdk";

export const microgen = new MicrogenClient({
  apiKey: String(process.env.NEXT_PUBLIC_MICROGEN_API_KEY),
});
