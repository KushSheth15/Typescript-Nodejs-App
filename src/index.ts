import * as dotenv from 'dotenv';
dotenv.config();

import app from './app';
import db from './sequelize-client';
import setupViews from './utils/setup-views';
import { refreshMaterializedView } from './utils/refresh-materialized-view';

const PORT = process.env.PORT

const startServer = async () => {

  try {
    const setup = await setupViews(db.sequelize);
    if (setup) {
      console.log('Views were created.');
    } else {
      console.log('Views already existed, no need to create them.');
    }
  } catch (error) {
    console.log('Error during view setup:', error);
  }

  try {
    await db.sequelize.sync({ force: false });
    console.log('Database connected successfully.');

    refreshMaterializedView();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start the server:', error);
  }
};

startServer();