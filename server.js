require("dotenv").config();

const https = require("https");
const fs = require("fs");
const path = require("path");

const app = require("./app");
const connectDB = require("./src/config/db");


// SERVER CONFIGURATION

const PORT =
    process.env.PORT ||
    3000;

// SSL CONFIGURATION

const sslKeyPath =
    process.env.SSL_KEY_PATH ||
    "./ssl/server.key";

const sslCertPath =
    process.env.SSL_CERT_PATH ||
    "./ssl/server.crt";


const sslOptions = {
    key: fs.readFileSync(
        path.resolve(
            sslKeyPath
        )
    ),

    cert: fs.readFileSync(
        path.resolve(
            sslCertPath
        )
    )
};


// START SERVER

const startServer = async () => {
    try {

        // Connect to MongoDB before accepting requests should be able to see MongoDB succesfuly connected
        await connectDB();


        https
            .createServer(
                sslOptions,
                app
            )
            .listen(
                PORT,
                () => {
                    console.log(
                        `HustleHub HTTPS API is running on port ${PORT}`
                    );
                }
            );

    } catch (error) {
        console.error(
            "Unable to start HustleHub server:",
            error.message
        );

        process.exit(1);
    }
};


startServer();