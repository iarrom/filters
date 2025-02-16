import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Serve files from the dev directory
app.use(express.static('dev'));
app.use(express.static('src'));

app.listen(port, () => {
  console.log(`Development server running at http://localhost:${port}`);
});
