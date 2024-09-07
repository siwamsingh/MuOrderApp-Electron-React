const { app, BrowserWindow, ipcMain } = require("electron");
const url = require("url");
const path = require("path");
const mysql = require("mysql2");
const fs = require("fs").promises;
const os = require("os");

const addBarcodeToPdf = require("../dataProcessor/genBarcode.cjs");

let win = null;

let iconName = "";
if (os.platform() === "win32") {
  iconName = "BookAPP.ico";
} else if (os.platform() === "linux") {
  iconName = "BookAPP.png";
}

const createWindow = () => {
  win = new BrowserWindow({
    title: "My Store",
    width: 800,
    height: 600,
    minWidth: 500,
    minHeight: 300,
    webPreferences: {
      preload: path.resolve(app.getAppPath(), "electron/preload.cjs"),
      contextIsolation: true,
      nodeIntegration: true,
    },
    icon: path.join(__dirname, "public", iconName),
  });

  // win.webContents.openDevTools();

  // win.loadURL("http://localhost:5173");
  win.loadFile(path.join(app.getAppPath(), "dist/index.html"));
};

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("submit", (events, args) => {
  console.log(args);
});

// local db

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "your-pasword",
//   database: "your-db-name",
// });
// db.connect((error) => {
//   if (error) {
//     console.log("error => ", error);
//     win.webContents.once('did-finish-load', () => {
//       win.webContents.send("error", 'Database not connected');
//     });
//   } else {
//     console.log("db connected");
//     win.webContents.once('did-finish-load', () => {
//       win.webContents.send("error", '');
//     });
//   }
// });

async function connectToDB() {
  try {
    const caCertPath = path.join(app.getAppPath(), "ca.pem");
    const caCert = await fs.readFile(caCertPath, "utf-8"); // Read the CA certificate file
    const db = mysql.createConnection({
      host: "your-host-name",
      user: "user-name",
      password: "password",
      database: "db-name",
      port: PORT,
      ssl: {
        ca: caCert,
        rejectUnauthorized: true,
      },
    });

    db.connect((err) => {
      if (err) {
        console.log("error => ", err);
        win.webContents.once("did-finish-load", () => {
          win.webContents.send("error", "Database not connected");
        });
        return;
      }
      console.log("db connected");
      win.webContents.once("did-finish-load", () => {
        win.webContents.send("error", "");
      });
    });

    return db;
  } catch (err) {
    console.error("Error reading CA certificate:", err);
  }
}

let db = null;
async function someFunction() {
  try {
    db = await connectToDB();
  } catch (error) {
    console.error("Failed to connect :", error);
  }
}

someFunction();

ipcMain.on("fetch:orderData", (event, data) => {
  const { orderId, postId , weight} = data;

  const query = "SELECT * FROM orders WHERE orderId = ?";

  db.query(query, [orderId], (error, results) => {
    if (error) {
      win.webContents.send(
        "error",
        "DATA NOT SAVED error while fetching order data " + error.sqlMessage
      );
    } else {
      const updateQuery = "UPDATE orders SET postId = ? WHERE orderId = ?";

      if (results.length > 0) {
        db.query(
          updateQuery,
          [postId, orderId],
          (updateError, updateResults) => {
            if (updateError) {
              win.webContents.send(
                "error",
                "error while updating post id in db " + error.sqlMessage
              );
            } else {
              results[0].postId = postId;
              results[0].weight = weight;
              win.webContents.send("recieved:orderData", results[0]);
              win.webContents.send("error", "");
            }
          }
        );
      } else {
        win.webContents.send(
          "error",
          `The Order ID : ${orderId} is not registered`
        );
      }
    }
  });
});

ipcMain.on("save:excel:data", async (events, data) => {
  const fileName = "a.JSON";
  let folderPath;
  if (os.platform() === "win32") {
    folderPath = "C:\\StoreApp\\interData";
  } else if (os.platform() === "linux") {
    folderPath = path.join(os.homedir(), "MyApp", "interData");
  } else {
    throw new Error("Unsupported OS");
  }
  const filePath = path.join(folderPath, fileName);

  if (!(await fs.stat(folderPath).catch(() => false))) {
    await fs.mkdir(folderPath, { recursive: true });
  }

  await fs.writeFile(filePath, JSON.stringify(data));
});

ipcMain.on("get:excel:data", async (event, data) => {
  const fileName = "a.JSON";

  let folderPath;
  if (os.platform() === "win32") {
    folderPath = "C:\\StoreApp\\interData";
  } else if (os.platform() === "linux") {
    folderPath = path.join(os.homedir(), "MyApp", "interData");
  } else {
    throw new Error("Unsupported OS");
  }
  const filePath = path.join(folderPath, fileName);

  try {
    const folderExists = await fs.stat(folderPath).catch(() => false);

    if (!folderExists) {
      console.log("folder doesnot exist");
    }

    const fileExists = await fs.stat(filePath).catch(() => false);

    if (fileExists) {
      const fileData = await fs.readFile(filePath, "utf-8");

      win.webContents.send("return:data:excel", JSON.parse(fileData));
    } else {
      return;
    }
  } catch (error) {
    console.error("Error handling file:", error);
    return { error: error.message };
  }
});

ipcMain.on("save:pdf", async (events, arrayBuffer) => {
  try {
    const fileName = "a.pdf";
    const buffer = Buffer.from(arrayBuffer);

    let folderPath;
    if (os.platform() === "win32") {
      folderPath = "C:\\StoreApp\\pdf";
    } else if (os.platform() === "linux") {
      folderPath = path.join(os.homedir(), "MyApp", "pdf");
    } else {
      throw new Error("Unsupported OS");
    }

    const filePath = path.join(folderPath, fileName);

    if (!(await fs.stat(folderPath).catch(() => false))) {
      await fs.mkdir(folderPath, { recursive: true });
    }

    await fs.writeFile(filePath, buffer);

    const dataArr = await addBarcodeToPdf(filePath);
    const pdfData = dataArr[1];

    win.webContents.send("modified:pdf", dataArr);

    const query = `
  INSERT INTO orders (orderId, phone, pinCode, orderDate, address) 
  VALUES ? 
  ON DUPLICATE KEY UPDATE
    phone = VALUES(phone),
    pinCode = VALUES(pinCode),
    orderDate = VALUES(orderDate),
    address = VALUES(address)
`;

    // here
    const values = pdfData
      .filter((item) => item.orderId && item.orderId.trim() !== "") // Filter out empty orderId
      .map((item) => [
        item.orderId,
        item.phone,
        item.pinCode,
        item.orderDate,
        item.address,
      ]);

    if (values.length == 0) return;

    db.query(query, [values], (error, results) => {
      if (error) {
        win.webContents.send(
          "error",
          "Some error occured in database" + error.sqlMessage
        );
      } else {
        console.log("data saved");
      }
    });

    console.log("pdf uploaded successfully");
    events.reply("save:pdf:reply", "pdf uploaded successfully");
  } catch (error) {
    console.log("Failed to save a.pdf ", error);
    win.webContents.send("error", "Some error occured while uploading");
    events.reply("save:pdf:reply", "Failed to save a.pdf ");
  }
});
