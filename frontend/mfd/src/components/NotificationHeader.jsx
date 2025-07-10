// NotificationIcon.js
import React, { useEffect, useState, useContext } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { WSContext } from './Header'; // adjust path if needed

const NotificationIcon = () => {
  const ws = useContext(WSContext);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_order') {
        setNotifications((prev) => [data, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    };

    ws.addEventListener('message', handleMessage);

    return () => ws.removeEventListener('message', handleMessage);
  }, [ws]);

  const handleNotificationClick = (order) => {
    navigate('/deliveryStaff/deliveryStaffPage', {
      state: { notifiedOrder: order },
    });
    setShowDropdown(false);
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <div
        className="cursor-pointer text-white text-2xl relative"
        onClick={() => {
          setShowDropdown((prev) => !prev);
          setUnreadCount(0);
        }}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </div>

      {showDropdown && notifications.length > 0 && (
        <div className="absolute right-0 mt-2 w-72 bg-white text-black rounded shadow z-50">
          <ul>
            {notifications.map((notif, index) => (
              <li
                key={index}
                onClick={() => handleNotificationClick(notif.order)}
                className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {notif.message}
                <br />
                <span className="text-gray-600 text-xs">{notif.address}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
