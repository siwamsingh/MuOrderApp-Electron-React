import React, { useEffect, useState } from 'react';


function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const [pdfData, setPdfData] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [modifiedPdf, setModifiedPdf] = useState(null);
  const [error, setError] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [emptyPdfData, setEmptyPdfData] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please upload a valid PDF file.');
      setSelectedFile(null);
    }
  };

  useEffect(() => {
    ir.on('modified:pdf', (evt, message) => {
      setModifiedPdf(evt[0]);
      setPdfData(evt[1]);
      setUploading(false);
      setError("");
    });

    ir.on('error', (evt, message) => {
        setError(evt);
    });

  }, [])

  useEffect(() => {
    if (modifiedPdf != null) {
      const blob = new Blob([modifiedPdf], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);

      setPdfUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [modifiedPdf])

  useEffect(() => {
    if (pdfData.length > 0) {
      let empty = [];

      for (let i = 0; i < pdfData.length; i++) {
        const ele = pdfData[i];

        if (ele.address == "" ||
          ele.orderId == "" ||
          ele.phone == "" ||
          ele.pinCode == "" ||
          ele.orderDate == "") {
          empty.push(i + 1);
        }
      }
      setEmptyPdfData(empty);
    }
  }, [pdfData])

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a PDF file.');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = function (e) {
      const arrayBuffer = e.target.result;

      window.ir.send('save:pdf', arrayBuffer);
      setPdfUrl(null);
    };
    reader.readAsArrayBuffer(selectedFile);
  };



  return (
    <div className='  mx-auto '>
      {error}
      <div className='  h-[70vh]  mb-10 flex items-center justify-center w-full'>

        <div className=' flex card-body flex-col items-center gap-5'>
          <input type="file" accept=".pdf" className="file-input file-input-bordered file-input-primary w-full max-w-xs" onChange={handleFileChange} />


          {!(error === "Database not connected") && <div className='flex gap-6'>
            <button onClick={handleUpload} className="w-fit btn btn-active btn-primary ">Upload PDF</button>
          {pdfUrl && <a
              href={pdfUrl}
              download="document.pdf" // Specify the file name
              className="w-fit btn btn-outline btn-primary"
            >
              Download PDF
            </a>}
          </div>}
          {error === "Database not connected" && <div role="alert" className="alert alert-error w-fit px-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Error! Database not connected turn on database.</span>
          </div>}


        </div>

        

      </div>
      <div className=' flex justify-center'>
      {uploading && <div className="loading loading-spinner loading-lg "></div>
        }</div>
        
      {(emptyPdfData.length>0 && (!uploading)) && <div role="alert" className="alert alert-warning w-fit mx-auto px-10 mb-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Warning: {emptyPdfData.map(ele => " "+ele+"  ")} are empty</span>
      </div>}

      {(error.length>=15 && error.slice(0,15)==="Duplicate entry" && (!uploading)) && <div role="alert" className="alert alert-warning w-fit mx-auto px-10 mb-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p>Warning: Duplicate data found / {" " +error} <br/>
        <span className='font-bold text-xl'>Data Not Saved</span></p>
      </div>}

      {(error.length>=18 && error.slice(0,18)==="Some error occured" && (!uploading)) && <div role="alert" className="alert alert-warning w-fit mx-auto px-10 mb-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p>Warning:{" " +error} <br/>
        <span className='font-bold text-xl'>Data Not Saved</span></p>
      </div>}

      {pdfUrl && (
        <div className='pb-12 min-h-4 flex justify-center  flex-wrap border-2 mx-8 pt-5 '>

          <object data={pdfUrl} className='border border-gray-500  p-4 min-w-[300px] max-w-[420px]' type="application/pdf" width="50%" height="500px">
            <p>
              <a href={pdfUrl} > Link to the PDF!</a>
            </p>
          </object>
          <div className='pl-4 '>
            <div className="overflow-x-scroll w-full h-screen mt-5">

              <table className="table table-sm">
                <thead>
                  <tr>
                    <th></th>
                    <th>Order Id</th>
                    <th>Pin Code</th>
                    <th>Phone Number</th>
                    <th>Order Data</th>
                    <th>Adress</th>
                  </tr>
                </thead>
                <tbody>
                  {(pdfData.length) && pdfData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.orderId}</td>
                      <td>{item.pinCode}</td>
                      <td>{item.phone}</td>
                      <td>{item.orderDate}</td>
                      <td className='max-w-[300px]'>{item.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
