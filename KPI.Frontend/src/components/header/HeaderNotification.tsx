import React, { useState } from "react";
import "./assets/header_notification.scss";
import NotificationIcon from "../icons/NotificationIcon";

interface Notification {
    id: number;
    message: string;
    read: boolean;
    time: string;
}

const HeaderNotification: React.FC = () => {
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: 1, message: "Sizga yangi xabar keldi", read: false, time: "5 min" },
        { id: 2, message: "Tizim yangilandi", read: false, time: "1 soat" },
    ]);

    // O'qilmagan notificationlar soni
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="header_notification_wrapper">
            <div className="header_notification_icon" onClick={() => { }}>
                <NotificationIcon size={35} />
                {unreadCount > 0 && (
                    <span className="header_notification_badge">{unreadCount}</span>
                )}
            </div>
        </div>
    );
};

export default HeaderNotification;