/*
Imports Node.js modules.

fs reads the certificate files.
path creates reliable full file paths.
*/
const fs = require("fs");
const path = require("path");

/*
Creates the full path to the backend folder.

__dirname currently refers to backend/config.

Moving one level upward produces the backend folder.
*/
const backendDirectory = path.resolve(__dirname, "..");

/*
Reads the relative certificate paths from the environment
variables.

Fallback values are supplied when an environment variable is
not available.
*/
const sslKeyPath =
    process.env.SSL_KEY_PATH ||
    "certificates/privatekey.pem";

const sslCertPath =
    process.env.SSL_CERT_PATH ||
    "certificates/certificate.pem";

/*
Combines the backend directory with each relative certificate
path.

This produces full paths to the certificate files.
*/
const resolvedKeyPath = path.resolve(
    backendDirectory,
    sslKeyPath
);

const resolvedCertPath = path.resolve(
    backendDirectory,
    sslCertPath
);

/*
Reads the private key and certificate files.

The HTTPS server requires both files.
*/
const httpsOptions = {
    key: fs.readFileSync(resolvedKeyPath),
    cert: fs.readFileSync(resolvedCertPath)
};

/*
Exports the HTTPS configuration object.
*/
module.exports = httpsOptions;