export const config = {
  accessTokenExpiresInHour: 24,
  microgenApiKey: process.env.MICROGEN_API_KEY as string,
  microgenAdminEmail: process.env.MICROGEN_ADMIN_EMAIL as string,
  microgenAdminPassword: process.env.MICROGEN_ADMIN_PASSWORD as string,
};
