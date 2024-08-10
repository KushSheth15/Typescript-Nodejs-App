import * as dotenv from 'dotenv';
dotenv.config();

import app from './app';
import db from './sequelize-client';

const PORT = process.env.PORT 

const startServer = async () => {
    try {
      await db.sequelize.sync({ force: false });
      console.log('Database connected successfully.');
  
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Unable to start the server:', error);
    }
  };
  
  startServer();