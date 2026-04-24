import "dotenv/config";

export const DATABASE_URL = process.env.DATABASE_URL;
export const PORT = process.env.PORT;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const REDIS_URL = process.env.REDIS_URL;
export const RABBIT_MQ_URL = process.env.RABBIT_MQ_URL;

console.log(
   "\n",
   {
      DATABASE_URL: DATABASE_URL,
      PORT: PORT,
      REDIS_URL: REDIS_URL,
      ACCESS_TOKEN_SECRET: ACCESS_TOKEN_SECRET,
      REFRESH_TOKEN_SECRET: REFRESH_TOKEN_SECRET,
      GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: GOOGLE_CLIENT_SECRET,
      RABBIT_MQ_URL: RABBIT_MQ_URL,

   },
   "\n",
);
