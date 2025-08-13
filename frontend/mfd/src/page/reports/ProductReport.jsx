import React, { useRef, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import { useSelector } from 'react-redux';
import { FaBoxOpen } from 'react-icons/fa';
import { MdOutlineInventory2 } from 'react-icons/md';
import { Menu } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import MFD_LOGO from "../../assets/MLF_SMALL_LOGO.webp";

const ProductReport = () => {
  const { products = [] } = useSelector((state) => state.productsState);
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const [showSidebar, setShowSidebar] = useState(false);
  const [isPdfMode, setIsPdfMode] = useState(false);
  const [lastPublishedDateTime, setLastPublishedDateTime] = useState(null);
  const reportRef = useRef(null);

  const getFormattedDate = (date) =>
    date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const getFormattedTime = (date) =>
    date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  const handleDownloadPDF = () => {
    const now = new Date();
    const today = getFormattedDate(now);
    const time = getFormattedTime(now);

    setIsPdfMode(true);
    setTimeout(() => {
      const element = reportRef.current;
      const opt = {
        margin: 0.5,
        filename: `Product_Report_${today}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };
      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          setLastPublishedDateTime({ date: today, time });
          setIsPdfMode(false);
        });
    }, 100);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Sidebar */}
      <div className="hidden md:block w-64 bg-gray-800 absolute top-0 bottom-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {showSidebar && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden"
          onClick={() => setShowSidebar(false)}
        >
          <div
            className="fixed left-0 top-0 w-64 h-full bg-white z-50 shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-6 md:ml-64 w-full">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">Product Report</h1>
          <button
            className="p-2 rounded bg-gray-200"
            onClick={() => setShowSidebar(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Download PDF Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Download PDF
          </button>
        </div>

        {/* Report Content */}
        <div ref={reportRef} className="px-4">
          {/* Logo (Only in PDF) */}
          {isPdfMode && (
            <div className="flex justify-center mb-4">
              <img src={MFD_LOGO} alt="MFD Logo" className="h-16" />
            </div>
          )}

          {/* Title */}
          <div className="text-center mb-8">
            {!isPdfMode && (
              <div className="flex justify-center items-center gap-3 mb-2">
                <FaBoxOpen className="text-4xl text-[#cca22f]" />
              </div>
            )}
            <h1
              className={`text-4xl font-bold ${
                isPdfMode ? 'text-blue-800' : 'text-transparent bg-clip-text'
              }`}
              style={
                isPdfMode
                  ? {}
                  : {
                      fontFamily: "'Segoe UI', Roboto, sans-serif",
                      background: 'linear-gradient(90deg, #0066ff, #00ccff)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }
              }
            >
              Products Report
            </h1>
            <p className="text-[#174e64]">
              An overview of product statistics and stock levels
            </p>
          </div>

          {/* Date & Time */}
          <div className="bg-white px-4 py-3 rounded-md text-md mb-10 shadow-sm text-center">
            {isPdfMode ? (
              <>
                <p className="text-red-600 font-medium">
                  Date: {getFormattedDate(new Date())}
                </p>
                <p className="text-gray-600 text-sm">
                  Report published at: {getFormattedTime(new Date())}
                </p>
              </>
            ) : lastPublishedDateTime ? (
              <>
                <p className="text-red-600 font-medium">
                  Last Published Date: {lastPublishedDateTime.date}
                </p>
                <p className="text-gray-600 text-sm">
                  Last Published Time: {lastPublishedDateTime.time}
                </p>
              </>
            ) : (
              <p className="text-gray-500 italic">
                No report published yet.
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl mb-10 mx-auto">
            <div className="bg-white shadow-md rounded-2xl p-6 text-center">
              <h2 className="text-lg font-semibold text-gray-700">
                Total Products
              </h2>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {products.length}
              </p>
            </div>
            <div className="bg-white shadow-md rounded-2xl p-6 text-center">
              <h2 className="text-lg font-semibold text-gray-700">
                Out of Stock
              </h2>
              <p className="text-3xl font-bold text-yellow-500 mt-2">
                {outOfStock}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-5xl mx-auto">
            <div className="flex justify-center mb-4">
              {!isPdfMode && (
                <MdOutlineInventory2 className="text-3xl text-gray-700 mr-2" />
              )}
              <h2
                className={`text-2xl font-semibold ${
                  isPdfMode ? 'text-gray-800' : 'text-transparent bg-clip-text'
                }`}
                style={
                  isPdfMode
                    ? {}
                    : {
                        fontFamily: "'Segoe UI', Roboto, sans-serif",
                        background: 'linear-gradient(90deg, #0f172a, #38bdf8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }
                }
              >
                Products Inventory
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="border p-3 text-left">Name</th>
                    <th className="border p-3 text-left">Price (Rs.)</th>
                    <th className="border p-3 text-left">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center p-4 text-gray-500">
                        No products available.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50 transition">
                        <td className="border p-3">{product.name}</td>
                        <td className="border p-3">Rs. {product.price}</td>
                        <td className="border p-3">{product.stock}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReport;
