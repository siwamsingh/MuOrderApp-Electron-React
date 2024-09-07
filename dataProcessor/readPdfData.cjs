const PDFParser = require("pdf2json");

async function parsePDF(pathOfPdf) {
  const pdfParser = new PDFParser(this, 1);

  return new Promise((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", (errData) => {
      console.error(errData.parserError);
      reject(errData.parserError); // Reject on error
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      const data = pdfParser.getRawTextContent();
      resolve(data);
    });

    pdfParser.loadPDF(pathOfPdf);
  });
}

async function processPDF(pathOfPdf) {
  try {
    const data = await parsePDF(pathOfPdf);

    let pattern = /----------------Page \(\d+\) Break----------------/;

    let tempArray = data.split(pattern);
    tempArray.pop();

    const addressPattern =
      /Delivery address:\s([\s\S]*?)Order Date:\s([\s\S]*?)Seller Name:\s([\s\S]*?)Ship to:/;
    const orderIdPattern = /Order ID:\s([^\n]+)/;
    const phonePattern = /Phone :\s([^\n]+)/;

    let dataArr = [];

    tempArray.map((entry, index) => {
      const match = entry.match(addressPattern);
      const match2 = entry.match(orderIdPattern);
      const match3 = entry.match(phonePattern);

      let orderObj = {
        address: "",
        pinCode: "",
        orderId: "",
        phone: "",
        orderDate: ""
      };

      if (match) {
        // Extract and clean up address and seller details
        const addressLines = match[1]
          .replace(/[\n\r]+/g, "\n")
          .trim()
          .split("\n");
        
          const addressLinesWithName = [
            addressLines[0], // First element
            `<name>`,        // Insert <name>
            ...addressLines.slice(1) // Add the rest of the elements
          ];

        const address = addressLinesWithName.join(" ").trim();
        const pinCode = address.slice(-6);
        const sellerDetails = match[3].trim();
        const orderDate = sellerDetails.split("\r\n")[0].trim();

        if (address) orderObj.address = address;

        if (orderDate) orderObj.orderDate = orderDate;

        function isValidPinCode(pin) {
          return /^\d{6}$/.test(pin);
        }

        if (isValidPinCode(pinCode)) {
          orderObj.pinCode = pinCode;
        }
      }

      if (match2) {
        const orderId = match2[1].trim();
        orderObj.orderId = orderId;
      }

      if (match3) {
        const phone = match3[1].trim();
        orderObj.phone = phone;
      }

      if (
        orderObj.address == "" ||
        orderObj.orderId == "" ||
        orderObj.phone == "" ||
        orderObj.pinCode == ""||
        orderObj.orderDate == ""
      ) {
        
      }

      dataArr.push(orderObj);

      // orderObj.allData = entry;
    });

    // console.log(dataArr);

    return dataArr;
  } catch (error) {
    console.error("Error processing PDF:", error);
  }
}

module.exports = processPDF;
// processPDF("./pdfs/bbbb.pdf");

// pdfParser.loadPDF("./pdfs/ee.pdf");
