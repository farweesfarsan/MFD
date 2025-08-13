import React, { useEffect, useState, useRef } from "react";
import MFD_LOGO from "../../assets/MLF_SMALL_LOGO.webp";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { usePayment } from "../../context/paymentContext";
import { getSubscriptionDetailsAction } from "../../actions/subscriptionActions";
import OrderCancel from "./OrderCancel";
import Loader from "../layouts/Loader";
// import { sendEmail } from "../../actions/usersActions";
import SimpleLoader from "../layouts/SimpleLoader";
import axios from "axios";

const PaymentSuccess = () => {
  const [order, setOrder] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const invoiceRef = useRef();
  const navigate = useNavigate();
  const { user, isEmailSent } = useSelector((state) => state.authState);
  const { paymentMethod } = usePayment();
  const dispatch = useDispatch();
  const { subscriptionDetails } = useSelector(
    (state) => state.subscriptionState
  );
  const { orderDetail } = useSelector((state) => state.orderState);
  const [finalPrice, setFinalPrice] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleOpenCancelModal = () => setIsCancelModalOpen(true);
  const handleCloseCancelModal = () => setIsCancelModalOpen(false);

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

  if (!order) {
    return <div className="text-center text-xl mt-10">Loading invoice...</div>;
  }

  const paidDate = new Date(order.paidAt).toLocaleDateString();
  const paidTime = new Date(order.paidAt).toLocaleTimeString();

  return (
    <div className="relative">
      <ToastContainer />

      {isDownloading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <SimpleLoader />
        </div>
      )}
      <div
        ref={invoiceRef}
        className={`max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 transition-all duration-300 ${
          isDownloading ? "blur-sm select-none pointer-events-none" : ""
        }`}
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
                className="w-full sm:w-auto px-4 py-2 bg-[#1b6b75]  text-white font-semibold rounded hover:bg-[#0d4e57] shadow  transition"
              >
                Download PDF
              </button>
              <button
                onClick={handleOpenCancelModal}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300"
              >
                Cancel Order
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
          className={`flex items-center gap-3 px-6 py-3 bg-[#1b6b75] text-white text-lg font-medium rounded hover:bg-[#155e67] transition ${
            isDownloading ? "blur-sm select-none pointer-events-none" : ""
          }`}
        >
          <IoArrowBackCircle size={28} />
          Back to Home
        </button>
      </div>

      {/* Cancel Order Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
            <OrderCancel
              orderId={orderDetail._id}
              onClose={handleCloseCancelModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
