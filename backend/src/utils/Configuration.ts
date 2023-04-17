import dotenv from 'dotenv';
dotenv.config({ path: __dirname + `/../../.env.${process.env.NODE_ENV}` });

const config = {
  jwtSecret: process.env.JWT_SECRET,
  apiPort: process.env.API_PORT,
  dbHost: process.env.RDS_HOSTNAME,
  dbPort: process.env.RDS_PORT,
  dbName: process.env.DB_NAME,
  dbUsername: process.env.RDS_USERNAME,
  dbPassword: process.env.RDS_PASSWORD,
};

export default config;
