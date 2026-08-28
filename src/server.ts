import app from "./app";
import { prisma } from "./lib/prisma";
import { initSocket } from "./socket/socketManager";

const PORT = process.env.PORT || 3000;

async function main() {
    try{
        await prisma.$connect();
        console.log("Database connected");
       
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        // Attach Socket.io to the underlying HTTP server
        initSocket(server);
        console.log("Socket.io attached");
        
    } catch (error) {
        console.log(error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();