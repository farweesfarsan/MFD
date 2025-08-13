import React, { useRef, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import { useSelector } from 'react-redux';
import { Menu } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import MFD_LOGO from '../../assets/MLF_SMALL_LOGO.webp';

const UserReport = () => {
  const { users = [] } = useSelector((state) => state.userState);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isPdfMode, setIsPdfMode] = useState(false);
  const [lastPublishedDateTime, setLastPublishedDateTime] = useState(null);
  const [filterRole, setFilterRole] = useState('All');
  const reportRef = useRef(null);

  const roleCount = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const getFormattedDate = (date) =>
    new Date(date).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const getFormattedTime = (date) =>
    new Date(date).toLocaleTimeString('en-GB', {
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
        filename: `User_Report_${filterRole}_${today}.pdf`,
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

  const filteredUsers = filterRole === 'All'
    ? users
    : users.filter((user) => user.role.toLowerCase() === filterRole.toLowerCase());

  const handleCardClick = (role) => {
    setFilterRole(role);
  };

  const isActiveCard = (role) => filterRole === role;

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      <div className="hidden md:block w-64 bg-gray-800 absolute top-0 bottom-0">
        <Sidebar />
      </div>

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

      <div className="flex-1 p-6 md:ml-64 w-full">
        <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">User Report</h1>
          <button
            className="p-2 rounded bg-gray-200"
            onClick={() => setShowSidebar(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Download PDF
          </button>
        </div>

        <div ref={reportRef} className="px-4">
          {isPdfMode && (
            <div className="flex justify-center mb-4">
              <img src={MFD_LOGO} alt="MFD Logo" className="h-16" />
            </div>
          )}

          <div className="text-center mb-8">
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
              Users Report
            </h1>
            <p className="text-[#174e64]">Overview of user statistics by roles</p>
          </div>

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
              <p className="text-gray-500 italic">No report published yet.</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl mb-10 mx-auto">
            <div
              onClick={() => handleCardClick('All')}
              className={`cursor-pointer bg-white shadow-md rounded-2xl p-6 text-center transition transform hover:scale-105 ${isActiveCard('All') ? 'ring-4 ring-blue-400' : ''}`}
            >
              <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
              <p className="text-3xl font-bold text-green-600 mt-2">{users.length}</p>
            </div>
            {Object.entries(roleCount).map(([role, count]) => (
              <div
                key={role}
                onClick={() => handleCardClick(role)}
                className={`cursor-pointer bg-white shadow-md rounded-2xl p-6 text-center transition transform hover:scale-105 ${isActiveCard(role) ? 'ring-4 ring-blue-400' : ''}`}
              >
                <h2 className="text-lg font-semibold text-gray-700">
                  {role.charAt(0).toUpperCase() + role.slice(1)}s
                </h2>
                <p className="text-3xl font-bold text-blue-500 mt-2">{count}</p>
              </div>
            ))}
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-5xl mx-auto">
            <h2
              className={`text-2xl font-semibold text-center mb-4 ${
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
              {filterRole === 'All' ? 'All Users' : `${filterRole}s`}
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="border p-3 text-left">Name</th>
                    <th className="border p-3 text-left">Email</th>
                    <th className="border p-3 text-left">Role</th>
                    <th className="border p-3 text-left">Registered Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center p-4 text-gray-500">
                        No users available.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition">
                        <td className="border p-3">{user.name}</td>
                        <td className="border p-3">{user.email}</td>
                        <td className="border p-3 capitalize">{user.role}</td>
                        <td className="border p-3">{getFormattedDate(user.createdAt)}</td>
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

export default UserReport;