import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

export const config = {
  PORT: parseInt(process.env.PORT, 10) || 3000,
  HERE_APP_ID: process.env.HERE_APP_ID,
  HERE_APP_CODE: process.env.HERE_APP_CODE,
};
