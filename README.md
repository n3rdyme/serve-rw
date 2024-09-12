# serve-rw

**Serve-RW** is a lightweight file server that supports reading, writing, and deleting files via HTTP requests. It allows you to easily expose a directory over HTTP with MIME types, directory listings, and full CORS support. You can use `PUT` requests to upload or replace files and `DELETE` requests to remove them.

## 🚀 Features

- **Dynamic File Serving**: Serve files with correct MIME types.
- **Directory Listing**: Auto-generates an HTML listing for directories.
- **File Uploads**: Upload or replace files via `PUT` requests.
- **File Deletion**: Remove files using `DELETE` requests.
- **CORS Enabled**: Open to any origin, making it accessible for external resources.
- **Command-Line Configurable**: Easily configure the port and root directory.
- **Error Handling**: Errors are shown in HTML and logged to the console.

## 📦 Installation

You can install **serve-rw** globally using npm:

```bash
npm install -g serve-rw
```

Alternatively, you can clone the repository:

```bash
git clone https://github.com/n3rdyme/serve-rw.git
cd serve-rw
npm install
```

## 🛠️ Usage

Once installed, you can run the server with:

```bash
serve-rw --port <port> --directory <path>
```

### Command-Line Options:

- `--port <port>`: Specify the port the server listens on (default: `3000`).
- `--directory <path>`: Set the root directory for serving files (default: `./config`).

**Example:**

```bash
serve-rw --port 8080 --directory /path/to/your/directory
```

## 🌐 API Endpoints

### 1. **GET** - Retrieve Files and Directories

Access any file or directory via a GET request. If the path is a directory, an HTML page listing its contents will be returned.

Example:

```bash
curl http://localhost:8080/myfile.txt
```

### 2. **PUT** - Upload or Replace Files

Use a PUT request to upload a new file or replace an existing one.

Example:

```bash
curl -X PUT --data-binary @yourfile.txt http://localhost:8080/uploadedfile.txt
```

### 3. **DELETE** - Remove Files

Use a DELETE request to remove a specific file.

Example:

```bash
curl -X DELETE http://localhost:8080/myfile.txt
```

## 📂 Directory Listing

When a directory is requested, an HTML page with a listing of its contents will be returned. The page includes navigation links to subdirectories and a link to the parent directory (if applicable).

## ⚠️ Error Handling

If an error occurs (e.g., a file is not found or the server encounters an issue), a user-friendly HTML error page will be returned, and the error will be logged to the console for easy debugging.

## 🛠 Development

If you'd like to contribute:

1. Fork the repository.
2. Create your feature branch:
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. Commit your changes:
   ```bash
   git commit -am 'Add new feature'
   ```
4. Push the branch:
   ```bash
   git push origin feature/my-new-feature
   ```
5. Submit a pull request.

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/n3rdyme/serve-rw/blob/main/LICENSE) file for details.

---

Find this project on GitHub: [n3rdyme/serve-rw](https://github.com/n3rdyme/serve-rw)

---

Now you can easily expose directories over HTTP with full read-write capabilities using **serve-rw**. Happy serving!

--- 

Feel free to update any links or additional information as needed!