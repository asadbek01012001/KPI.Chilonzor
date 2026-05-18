import "./assets/header_date_time_resources.scss";

import CalendarIcon from "../icons/CalendarIcon";
import ClockIcon from "../icons/ClockIcon";
import { useEffect, useState } from "react";

interface DateTimeState {
    day: string;
    date: string;
    time: string;
}

const HeaderDateTimeResources: React.FC = () => {

    const [dateTime, setDateTime] = useState<DateTimeState>({
        day: "",
        date: "",
        time: "",
    });

    useEffect(() => {
        const updateDateTime = (): void => {
            const now = new Date();

            const days: string[] = ["Якшанба", "Душанба", "Сешанба", "Чоршанба", "Пайшанба", "Жума", "Шанба"];

            setDateTime({
                day: days[now.getDay()],
                date: now.toLocaleDateString('en-GB'),
                time: now.toLocaleTimeString('uz-UZ', { hour12: false })
            });
        };

        updateDateTime();
        const intervalId: NodeJS.Timeout = setInterval(updateDateTime, 1000);
        return () => clearInterval(intervalId);

    }, [])

    return (
        <div className="header_date_time_resources_warpper">
            <p className="header_date_time_resources_day">{dateTime.day}</p>
            <div className="header_date_time_resources_calendar">
                <CalendarIcon />
                <span className="header_date_time_resources">{dateTime.date.replace(/\//g, '.')}</span>
            </div>
            <div className="header_date_time_resources_time">
                <ClockIcon />
                <span className="header_date_time_resources">{dateTime.time}</span>
            </div>
        </div>
    );
}

export default HeaderDateTimeResources;