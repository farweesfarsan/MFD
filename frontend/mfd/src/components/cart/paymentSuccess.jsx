import React, { useEffect, useState, useRef } from "react";
import MFD_LOGO from "../../assets/MLF_SMALL_LOGO.webp";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { usePayment } from "../../context/paymentContext";
import { getSubscriptionDetailsAction } from "../../actions/subscriptionActions";

const PaymentSuccess = () => {
  const [order, setOrder] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const invoiceRef = useRef();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.authState);
  const { paymentMethod, setPaymentMethod } = usePayment();
  const dispatch = useDispatch();
  const { subscriptionDetails } = useSelector(
    (state) => state.subscriptionState
  );
  const { orderDetail } = useSelector((state) => state.orderState);
  const [finalPrice, setFinalPrice] = useState(null);
  const [discount, setDiscount] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(getSubscriptionDetailsAction(user._id));
    }

    if (orderDetail?.finalPrice && orderDetail?.discount) {
      const summary = {
        finalPrice: orderDetail.finalPrice,
        discount: orderDetail.discount,
      };
      sessionStorage.setItem("orderSummary", JSON.stringify(summary));
    }
  }, [dispatch, user]);

  useEffect(() => {
    const saveOrder = sessionStorage.getItem("recentOrder");
    if (saveOrder) {
      // setOrder(JSON.parse(saveOrder));
      const parseOrder = JSON.parse(saveOrder);
      if (paymentMethod === "cod") {
        parseOrder.paymentInfo.status = "Not Paid";
      }
      setOrder(parseOrder);
    }

    const summary = JSON.parse(sessionStorage.getItem("orderSummary"));
    if (summary) {
      setFinalPrice(summary.finalPrice);
      setDiscount(summary.discount);
    }
  }, []);

  const downloadPDF = async () => {
    const input = invoiceRef.current;
    const noPrintElements = input.querySelectorAll(".no-print");

    try {
      setIsDownloading(true);
      noPrintElements.forEach((el) => (el.style.display = "none"));

      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${order.paymentInfo?.id || "order"}.pdf`);
    } catch (error) {
      toast.error("Download not Completed");
      console.error("PDF download error:", error);
    } finally {
      noPrintElements.forEach((el) => (el.style.display = ""));
      setIsDownloading(false);
    }
  };

  const sendPDFViaEmail = async () => {
    const input = invoiceRef.current;
    const noPrintElements = input.querySelectorAll(".no-print");

    try {
      setIsDownloading(true);
      noPrintElements.forEach((el) => (el.style.display = "none"));

      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      const blob = pdf.output("blob");
      const formData = new FormData();
      formData.append(
        "invoice",
        blob,
        `Invoice_${order.paymentInfo?.id || "order"}.pdf`
      );
      formData.append("email", user.email);
      formData.append("name", user.name);

      const response = await axios.post(
        "http://localhost:8000/invoice/send-invoice",
        formData
      );
      toast.success(response.data.message || "Invoice sent successfully!", {
        position: "bottom-center",
        theme: "dark",
      });
    } catch (error) {
      toast.error("Failed to send invoice.", {
        position: "bottom-center",
        theme: "dark",
      });
      console.error("Send invoice error:", error);
    } finally {
      noPrintElements.forEach((el) => (el.style.display = ""));
      setIsDownloading(false);
    }
  };

  if (!order) {
    return <div className="text-center text-xl mt-10">Loading invoice...</div>;
  }

  const paidDate = new Date(order.paidAt).toLocaleDateString();
  const paidTime = new Date(order.paidAt).toLocaleTimeString();

  return (
    <div className="relative">
      <ToastContainer />

      {isDownloading && (
        <div className="absolute inset-0 z-40 bg-white bg-opacity-60 backdrop-blur-sm flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#cc3a52]"></div>
        </div>
      )}

      <div
        className={`max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 transition duration-300 ${
          isDownloading ? "blur-sm pointer-events-none select-none" : ""
        }`}
        ref={invoiceRef}
      >
        {/* Header Row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-4xl font-bold text-[#1b6b75] black-ops-one-regular">
              Invoice
            </h2>
            <p className="mt-1 text-sm text-gray-700 courgette-regular">
              <strong>Contact us:</strong> 0112 552 565
            </p>

            <div className="no-print mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={downloadPDF}
                className="w-full sm:w-auto px-4 py-2 bg-[#d33636] text-white font-semibold rounded shadow hover:bg-[#ec6666] transition"
              >
                Download PDF
              </button>
              <button
                onClick={sendPDFViaEmail}
                className="w-full sm:w-auto px-4 py-2 bg-[#1b6b75] text-white font-semibold rounded shadow hover:bg-[#0d4e57] transition"
              >
                Send Invoice to Email
              </button>
            </div>
          </div>
          <div className="flex flex-col items-end -mt-2">
            <img
              src={MFD_LOGO}
              alt="MFD Logo"
              className="h-20 w-auto object-contain"
            />
            {paymentMethod !== "cod" && (
              <div className="mt-1 text-sm text-gray-700 text-right w-40">
                <div className="flex gap-2">
                  <span className="font-medium">Paid Date:</span>
                  <span>{paidDate}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium">Paid Time:</span>
                  <span>{paidTime}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Info and Payment Summary */}
        <div className="flex justify-between gap-10 flex-wrap mb-6 text-gray-700">
          <div className="space-y-2 min-w-[200px] text-left">
            <h3 className="text-2xl text-[#cc3a52] font-semibold oleo-script-bold">
              Delivery Information
            </h3>
            <div className="flex flex-col items-start gap-2 w-60">
              <p>
                <strong>Address:</strong> {order.deliveryInfo.address},{" "}
                {order.deliveryInfo.city}
              </p>
              <p>
                <strong>Contact No:</strong> {order.deliveryInfo.phoneNo}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-left min-w-[200px]">
            <p>
              <strong>Order ID:</strong> {order.paymentInfo.id}
            </p>
            <p>
              <strong>Payment Status:</strong>{" "}
              <span
                className={`
                px-2 py-1 rounded font-medium
                ${
                  order.paymentInfo.status === "Paid"
                    ? "bg-green-300 text-green-600"
                    : ""
                }
                ${
                  order.paymentInfo.status === "Not Paid"
                    ? "bg-red-300 text-red-600"
                    : ""
                }
              `}
              >
                {order.paymentInfo.status}
              </span>
            </p>
            {/* <p><strong>Payment Method:</strong> Online Payment</p> */}
            <p>
              <strong>Payment Method:</strong>{" "}
              {paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
            </p>
            {subscriptionDetails?.isActive ? (
              <p>
                <strong>Subscribed Plane:</strong>{" "}
                <span
                  className={`
                  ${
                    subscriptionDetails?.plaType == "Premium"
                      ? "text-purple-900 font-semibold bg-purple-300 rounded-md p-2"
                      : ""
                  }
                  ${
                    subscriptionDetails?.planType == "Gold"
                      ? "text-yellow-700 font-semibold bg-yellow-200 rounded-md p-2"
                      : ""
                  }
                  ${
                    subscriptionDetails?.planType == "Silver"
                      ? "text-gray-700 font-semibold bg-slate-300 rounded-md p-2"
                      : ""
                  }
                  `}
                >
                  {subscriptionDetails?.planType}
                </span>
              </p>
            ) : null}
          </div>
        </div>

        {/* Ordered Items */}
        <h3 className="text-2xl text-[#cc3a52] font-semibold oleo-script-bold">
          Ordered Items
        </h3>
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border-b">Product</th>
              <th className="text-left px-4 py-2 border-b">Qty</th>
              <th className="text-left px-4 py-2 border-b">Price (LKR)</th>
              <th className="text-left px-4 py-2 border-b">Line Total (LKR)</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="flex items-center gap-3 px-4 py-2 border-b">
                  {item.name}
                </td>
                <td className="px-4 py-2 border-b">{item.quantity}</td>
                <td className="px-4 py-2 border-b">{item.price}.00</td>
                <td className="px-4 py-2 border-b">
                  {item.price * item.quantity}.00
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={4}>
                <hr className="border-t-2 border-gray-700 my-2" />
              </td>
            </tr>
            <tr className="bg-gray-50 font-medium">
              <td className="px-4 py-2 border-b" colSpan={3}>
                Delivery Charge
              </td>
              <td className="px-4 py-2 border-b">{order.deliveryCharge}.00</td>
            </tr>
            <tr className="bg-gray-100 font-bold">
              <td className="px-4 py-2 border-b" colSpan={3}>
                Total Amount
              </td>
              <td className="px-4 py-2 border-b">{order.totalPrice}</td>
            </tr>
            {subscriptionDetails?.isActive == true ? (
              <>
                <tr className="bg-gray-100 font-medium">
                  <td className="px-4 py-2 border-b" colSpan={3}>
                    Subscription Discount
                  </td>
                  <td className="px-4 py-2 border-b">{discount}.00</td>
                </tr>
                <tr className="bg-gray-100 font-bold">
                  <td className="px-4 py-2 border-b" colSpan={3}>
                    Final Total
                  </td>
                  <td className="px-4 py-2 border-b">{finalPrice}.00</td>
                </tr>
              </>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Back to Home Button (no-print) */}
      <div className="no-print flex justify-center my-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-6 py-3 bg-[#1b6b75] text-white text-lg font-medium rounded hover:bg-[#155e67] transition"
        >
          <IoArrowBackCircle size={28} />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
