// src/pages/client/Notifications.js
import React, { useState } from "react";
import "../css/client.css";
import ClientLayout from "./ClientLayout";

function Notifications() {
  const [notifications] = useState([
  "",
  ]);

  return (
    <ClientLayout>
      <div className="notif-page">
        <h1 className="notif-title">Notification</h1>

        <div className="notif-list">
          {notifications.map((msg, index) => (
            <div key={index} className="notif-item">
              <span className="dot">•</span>
              <span>{msg}</span>
            </div>
          ))}
        </div>
      </div>
    </ClientLayout>
  );
}

export default Notifications;

