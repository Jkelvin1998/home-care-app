import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/db.js';

const port = process.env.PORT || 4000;

async function start() {
   try {
      if (!process.env.JWT_SECRET) {
         throw new Error('JWT_SECRET is missing. Add it to server/.env');
      }

      await connectDatabase();

      app.listen(port, () => {
         console.log(`API listening on http://localhost:${port}`);
      });
   } catch (error) {
      console.error('Failed to start server', error.message);
      process.exit(1);
   }
}

start();
