const bwipjs = require("bwip-js");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");

const processPDF = require("./readPdfData.cjs");

async function generateBarcode(orderId) {
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer(
      {
        bcid: "code128", // Barcode type
        text: orderId, // Text to encode
        textsize: 6,
        textfont: "Monospace-Bold",
        textfont: "Bold",
        textyoffset: 1,
        textgaps: 1,
        scale: 2, // 3x scaling factor
        height: 5, // Barcode height in mm
        includetext: true, // Show human-readable text
        textxalign: "center", // Align text to the center
      },
      (err, png) => {
        if (err) {
          reject(err);
        } else {
          resolve(png.toString("base64"));
        }
      }
    );
  });
}

// Function to add the barcode to each page of the PDF
async function addBarcodeToPdf(inputPdfPath, outputPdfPath) {
  const pdfBytes = fs.readFileSync(inputPdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const arrayOfPdfData = await processPDF(inputPdfPath);

  const pages = pdfDoc.getPages();

  if (arrayOfPdfData.length != pages.length) {
    console.log("Length of pdf and data generated dont match");
    return;
  }

  for (let index = 0; index < pages.length; index++) {
    const page = pages[index];
    const orderId = arrayOfPdfData[index].orderId;

    // Generate barcode image
    if(orderId === "") continue;
    const barcodeData = await generateBarcode(orderId); // needs orderId
    const barcodeImage = await pdfDoc.embedPng(
      Buffer.from(barcodeData, "base64")
    );

    const { width, height } = page.getSize();

    // Place the barcode in the top-right corner of each page
    const barcodeWidth = 230; // Adjust as needed
    const barcodeHeight = 40; // Adjust as needed
    page.drawImage(barcodeImage, {
      x: width - barcodeWidth - 8, // 5px from the right
      y: height - barcodeHeight - 8, // 5px from the top
      width: barcodeWidth,
      height: barcodeHeight,
    });
  }

  // Save the modified PDF
  const pdfBytesModified = await pdfDoc.save();

  if (outputPdfPath) {
    fs.writeFileSync(outputPdfPath, pdfBytesModified);
    console.log("new file at : ", outputPdfPath);
  }

  return [pdfBytesModified,arrayOfPdfData];
}

// Run the function
// addBarcodeToPdf("./pdfs/single.pdf", "./output/single-edited.pdf")
//   .then(() => console.log("Barcode added to PDF successfully!"))
//   .catch((err) => console.error("Error adding barcode to PDF:", err));

module.exports = addBarcodeToPdf;
