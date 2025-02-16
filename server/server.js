import express from 'express';
import coinRoutes from './routes/coinRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors'
import { notFound, errorHandler} from './middleware/errorMiddleware.js';
dotenv.config();
import connectDB from './config/db.js';
connectDB();

const port = 7000;
const app = express();
app.use(cors())
app.use(express.json());

app.use('/api/coins', coinRoutes)

app.use(notFound);

app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on ${port}`));