import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth.js';
import bookingRouter from './routes/booking.js';
import vansRouter from './routes/vans.js';
import paymentsRouter from './routes/payments.js';
import subscriptionsRouter from './routes/subscriptions.js';
import { attachAuth } from './middleware/auth.js';
import providerJobsRouter from './routes/provider/jobs.js';
import providerEarningsRouter from './routes/provider/earnings.js';
import adminRouter from './routes/admin/index.js';
import plannerRouter from './routes/planner.js';
import prefsRouter from './routes/prefs.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

const prisma = new PrismaClient();

// Basic telemetry model for Mongo
interface VanLocationDoc extends mongoose.Document {
  vanId: string;
  lat: number;
  lng: number;
  updatedAt: Date;
}

const VanLocationSchema = new mongoose.Schema<VanLocationDoc>({
  vanId: { type: String, required: true, index: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  updatedAt: { type: Date, default: () => new Date() }
});

const VanLocation = mongoose.model<VanLocationDoc>('VanLocation', VanLocationSchema);

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(attachAuth);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingRouter(io, prisma));
app.use('/api/vans', vansRouter(prisma));
app.use('/api/payments', paymentsRouter);
app.use('/api/subscriptions', subscriptionsRouter(prisma));
app.use('/api/provider/jobs', providerJobsRouter(prisma));
app.use('/api/provider/earnings', providerEarningsRouter(prisma));
app.use('/api/admin', adminRouter(prisma));
app.use('/api/planner', plannerRouter);
app.use('/api/prefs', prefsRouter(prisma));

io.on('connection', (socket) => {
  socket.on('van:location', async (payload: { vanId: string; lat: number; lng: number }) => {
    await VanLocation.findOneAndUpdate(
      { vanId: payload.vanId },
      { ...payload, updatedAt: new Date() },
      { upsert: true }
    );
    io.emit('van:location:update', payload);
  });
});

async function start() {
  const port = Number(process.env.PORT || 4000);
  const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/chargego';

  await mongoose.connect(mongoUrl);
  await prisma.$connect();

  server.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});

export type { VanLocationDoc };
export { VanLocation, prisma, io };