import React, { useState, useRef, useEffect } from "react";
import * as XLSX from 'xlsx';

function Excel() {
  const [orderId, setOrderId] = useState("");
  const [postId, setPostId] = useState("");
  const [len, setLen] = useState(19);
  const [orderData, setOrderData] = useState([]);
  const [error, setError] = useState('');
  const [weight, setWeight] = useState(0);

  useEffect(() => {
    ir.send('get:excel:data', {});
  }, [])

  function updateOrderData(newOrder) {
    const address = newOrder.address;
    const parts = address.split("<name>");
    const name = parts[0].trim();

    newOrder.name = name;

    setOrderData((prevOrderData) => {
      // Check if the order already exists in the array
      const orderExists = prevOrderData.some(order => order.orderId === newOrder.orderId);

      let temp;

      if (orderExists) {
        // If order exists, replace it
        temp = prevOrderData.map(order =>
          order.orderId === newOrder.orderId ? newOrder : order
        );
      } else {
        // If order doesn't exist, append the new order
        temp = [...prevOrderData, newOrder];
      }
      window.ir.send('save:excel:data', temp);
      return temp;
    });


  }

  useEffect(() => {

    const handelReceivedData = (evt, msg) => {
      updateOrderData(evt);
    }
    const handelError = (evt, msg) => {
      setError(evt);
    }

    const handelFetchExcel = (evt, msg) => {
      setOrderData(evt);
    }

    ir.on("recieved:orderData", handelReceivedData)

    ir.on('error', handelError)

    ir.on('return:data:excel', handelFetchExcel)
  }, [])


  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderId == "" || postId == "") return;

    window.ir.send("fetch:orderData", { orderId, postId,  weight: String(weight) });

    setOrderId("");
    setPostId("");
    OrderIdRef.current.focus();
  };

  const postIdRef = useRef(null);
  const OrderIdRef = useRef(null);


  const handleOrderIdChange = (e) => {
    const value = e.target.value.trim();
    setOrderId(value);

    if (value.length === parseInt(len, 10)) {
      postIdRef.current.focus();
    }
  };

  const clearOrderData = () => {
    setOrderData([]);
    window.ir.send('save:excel:data', []);
    setError("")
  }

  const exportToExcel = () => {
    // Sample data (including pinCode field)
    const data = orderData

    // Ensure pinCode is the first key in each object
    const reorderedData = data.map(({ postId, orderId, pinCode, phone, address, orderDate , weight  }) => {
      const parts = address.split("<name>");
      const name = parts[0].trim();

      return ({ postId,orderId, pinCode, phone, name, orderDate, weight: String(weight) })
    });

    // Convert the reordered data into a worksheet
    const worksheet = XLSX.utils.json_to_sheet(reorderedData);

    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, 'orders.xlsx');
  };

  return (
    <div>
      <div>

      </div>
      <div className="m-10">
        <div className="flex gap-4">
          <label className="input w-fit mb-5 input-bordered flex items-center ">

            <input
              type="number"
              className="grow w-10"
              placeholder="Length of OrderId"
              onChange={(e) => {
                setLen(e.target.value);
              }}
              value={len}
            />
          </label>
          <label className="input w-fit mb-5 input-bordered flex items-center ">
            <span className="pr-4">Weight :</span>
            <input
              type="number"
              className="grow "
              placeholder="Weight"
              onChange={(e) => {
                const valueWithoutLeadingZeros = e.target.value.replace(/^0+/, '') || '0';
                setWeight(valueWithoutLeadingZeros);
              }}
              value={weight}
            />
          </label>
          {orderData.length > 0 && <button className="btn btn-success" onClick={exportToExcel}>Download Excel</button>}
        </div>
        <div className="flex justify-between flex-wrap">
          <form onSubmit={handleSubmit} className="flex">
            {/* Order Id input */}
            <input
              ref={OrderIdRef}
              className="input input-bordered input-primary w-full max-w-xs mb-4"
              type="text"
              placeholder="Order Id"
              value={orderId}
              onChange={handleOrderIdChange}
            />

            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block mx-1"
                width="40"
                height="10"
                viewBox="0 0 400 100"
              >
                <rect x="50" y="30" width="50" height="50" fill="#3498db" />
                <rect x="110" y="30" width="50" height="50" fill="#3498db" />
                <rect x="170" y="30" width="50" height="50" fill="#3498db" />

                <rect x="250" y="30" width="50" height="50" fill="#2ecc71" />
                <rect x="310" y="30" width="50" height="50" fill="#2ecc71" />
                <rect x="370" y="30" width="50" height="50" fill="#2ecc71" />
              </svg>
            </span>

            <input
              ref={postIdRef} // Add ref here
              className="input input-bordered input-primary w-full max-w-xs mb-4"
              type="text"
              placeholder="Post Id"
              value={postId}
              onChange={(e) => {
                setPostId(e.target.value.trim()); // Updates Post Id
              }}

            />
            <button type="submit" className="btn btn-primary ml-3">
              Submit
            </button>

          </form>
          <button className="btn btn-warning" onClick={clearOrderData}>Clear</button>
        </div>
      </div>
      <div></div>

      {error && <div role="alert" className="w-fit mb-8  mx-auto alert alert-warning">
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
        <span>{error}</span>
      </div>}

      <div>
        <table className="table table-sm">
          <thead>
            <tr>
              <th></th>
              <th>Order Id</th>
              <th>Post Id</th>
              <th>Pin Code</th>
              <th>Phone Number</th>
              <th>Name</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {(orderData.length > 0) && orderData.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.orderId}</td>
                <td>{item.postId}</td>
                <td>{item.pinCode}</td>
                <td>{item.phone}</td>
                <td>{item.name}</td>
                <td>{item.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Excel;
