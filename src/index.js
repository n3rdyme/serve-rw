const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const bodyParser = require('body-parser');
const { program } = require('commander');

// Setup command line options using Commander
program
    .option('-p, --port <port>', 'Port to listen on', 8080)
    .requiredOption('-d, --directory <directory>', 'Root directory for files')
    .parse(process.argv);

const options = program.opts();
const app = express();
const PORT = options.port;
const rootDirectory = path.resolve(process.cwd(), options.directory);

// Enable CORS for all origins
app.use(cors());
app.use(bodyParser.raw({ type: '*/*', limit: '50mb' }));

// Error handling middleware
function handleError(res, err) {
    console.error(err);
    res.status(500).send(`<html><body><h1>Error</h1><p>${err.message}</p></body></html>`);
}

// Helper function to generate HTML for directory listing
function generateDirectoryListing(dirPath, relativePath) {
    let items = fs.readdirSync(dirPath);
    let parentPath = relativePath !== '/' ? path.dirname(relativePath) : null;

    let html = '<html><body><h1>Directory Listing</h1><ul>';
    if (parentPath) {
        html += `<li><a href="${parentPath === '.' ? '/' : parentPath}">.. (parent directory)</a></li>`;
    }
    items.forEach(item => {
        const itemPath = path.join(relativePath, item);
        const fullPath = path.join(dirPath, item);
        const isDir = fs.lstatSync(fullPath).isDirectory();
        html += `<li><a href="${itemPath}${isDir ? '/' : ''}">${item}${isDir ? '/' : ''}</a></li>`;
    });
    html += '</ul></body></html>';
    return html;
}

app.get('/favicon.ico', (_, res) => res.status(404).send("Not Found"));

// Serve files and directories from the rootDirectory
app.get('/*', (req, res) => {
    console.log(`GET ${req.path}`);
    let filePath = path.join(rootDirectory, req.path);

    // Check if the requested path is a directory
    fs.stat(filePath, (err, stats) => {
        if (err) {
            return handleError(res, err);
        }

        if (stats.isDirectory()) {
            // If it's a directory, serve an HTML page listing its contents
            try {
                const html = generateDirectoryListing(filePath, req.path);
                res.status(200).send(html);
            } catch (err) {
                handleError(res, err);
            }
        } else {
            // If it's a file, serve it with the correct MIME type
            const mimeType = mime.lookup(filePath) || 'application/octet-stream';
            res.setHeader('Content-Type', mimeType);

            fs.createReadStream(filePath)
                .on('error', (err) => handleError(res, err))
                .pipe(res);
        }
    });
});

// Handle file uploads via PUT
app.put('/*', (req, res) => {
    let filePath = path.join(rootDirectory, req.path);

    // Create directories if they don't exist
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });

    // Write the file
    fs.writeFile(filePath, req.body, (err) => {
        if (err) {
            return handleError(res, err);
        }
        res.status(200).send('File uploaded successfully');
    });
});

// Handle file deletion via DELETE
app.delete('/*', (req, res) => {
    let filePath = path.join(rootDirectory, req.path);

    // Check if the file exists
    fs.stat(filePath, (err, stats) => {
        if (err) {
            return handleError(res, err);
        }

        if (stats.isDirectory()) {
            return res.status(400).send(`<html><body><h1>Error</h1><p>Cannot delete a directory</p></body></html>`);
        }

        // Delete the file
        fs.unlink(filePath, (err) => {
            if (err) {
                return handleError(res, err);
            }
            res.status(200).send('File deleted successfully');
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running: http://localhost:${PORT}`);
    console.log(`Serving files from: ${rootDirectory}`);
});
