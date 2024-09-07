# MyOrderApp - Electron Desktop Application

This is actually a App to read Orders from particular type of Pdf. *** So this is basically a template for other users. ***
This Electron app is built using Vite and React for a smooth desktop experience. 

## Configurations
- **Mac:** Configuration is not yet done.
- **Linux:** The app works, but the icon doesn't display.
- **Windows:** The app functions correctly.

## Database Setup

To configure the database, modify `electron/main.js` to read from a file or a link, depending on your preference:

1. **For Development Mode**:
   - Use this line in `main.js`:
     ```js
     win.loadURL("http://localhost:5173");
     ```
   - Then run:
     ```bash
     npm install
     npm run dev
     npm run electron
     ```

2. **For Production Mode**:
   - Use this line in `main.js`:
     ```js
     win.loadFile(path.join(app.getAppPath(), "dist/index.html"));
     ```
   - Then run:
     ```bash
     npm install
     npm run build
     npm run electron
     ```

## Building the App

To build/package the app, use the following command:
```bash
npx electron-builder

Ensure that when using the `npx electron-builder` command, the `main.js` file contains the following setup for loading the app:

```js
win.loadFile(path.join(app.getAppPath(), "dist/index.html"));
