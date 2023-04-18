import dotenv from 'dotenv';
dotenv.config({ path: __dirname + `/../../.env.${process.env.NODE_ENV}` });

const config = {
  jwtSecret: 'Ifta7ya5emSem',
  apiPort: 3001,
  dbHost: process.env.RDS_HOSTNAME,
  dbPort: process.env.RDS_PORT,
  dbName: 'soccer_db',
  dbUsername: process.env.RDS_USERNAME,
  dbPassword: process.env.RDS_PASSWORD,
};

export default config;
