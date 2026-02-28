import app from './app.js';
import { connectRedis } from './config/redis.js';

const PORT = process.env.PORT || 4000;

async function startServer() {
    await connectRedis();
    app.listen(PORT, () => {
        console.log(`🧊 Kori API Gateway listening on port ${PORT}`);
    });
}

startServer().catch((error) => {
    console.error('Failed to boot server', error);
    process.exit(1);
});
