import React, { useState, useRef, useEffect } from "react";
import "./assets/datepicker.scss";

interface DatePickerProps {
  value?: Date | null | undefined;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Санани танланг",
  disabled = false,
  minDate,
  maxDate,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date: Date | null | undefined): string => {
    if (!date) return "";
    return date.toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    for (let i = 0; i < startDay; i++) {
      days.push(new Date(year, month, -startDay + i + 1));
    }
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    const endDay = lastDay.getDay();
    for (let i = endDay + 1; i <= 6; i++) {
      days.push(new Date(year, month + 1, i - endDay));
    }
    return days;
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isSelectedDate = (date: Date): boolean => {
    if (!value) return false;
    return date.toDateString() === value.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isToday = (date: Date): boolean => {
    return date.toDateString() === new Date().toDateString();
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;
    onChange?.(date);
    setIsOpen(false);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      direction === "prev"
        ? newDate.setMonth(newDate.getMonth() - 1)
        : newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const navigateYear = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      direction === "prev"
        ? newDate.setFullYear(newDate.getFullYear() - 1)
        : newDate.setFullYear(newDate.getFullYear() + 1);
      return newDate;
    });
  };

  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const dayNames = ["Душ", "Сеш", "Чор", "Пай", "Жум", "Шан", "Якш"];
  const days = getDaysInMonth(currentMonth);

  return (
    <div className={`date-picker ${className}`} ref={containerRef}>
      <div className="date-picker__input-container">
        <input
          type="text"
          className={`date-picker__input ${disabled ? "date-picker__input--disabled" : ""}`}
          value={formatDate(value)}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        />
        <div
          className="date-picker__icon"
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="date-picker__calendar">
          <div className="date-picker__header">
            <div className="date-picker__nav">
              <button
                type="button"
                className="date-picker__nav-btn"
                onClick={() => navigateYear("prev")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M11 17L6 12L11 7M18 17L13 12L18 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="date-picker__nav-btn"
                onClick={() => navigateMonth("prev")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="date-picker__title">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>

            <div className="date-picker__nav">
              <button
                type="button"
                className="date-picker__nav-btn"
                onClick={() => navigateMonth("next")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="date-picker__nav-btn"
                onClick={() => navigateYear("next")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13 17L18 12L13 7M6 17L11 12L6 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="date-picker__weekdays">
            {dayNames.map((day, idx) => (
              <div
                key={day}
                className={`date-picker__weekday ${idx === 5 || idx === 6 ? "date-picker__weekday--weekend" : ""}`}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="date-picker__days">
            {days.map((date, index) => {
              const dayType = date.getDay();
              const isWeekend = dayType === 0 || dayType === 6;
              return (
                <button
                  key={index}
                  type="button"
                  className={`date-picker__day ${!isCurrentMonth(date) ? "date-picker__day--outside" : ""} ${isSelectedDate(date) ? "date-picker__day--selected" : ""} ${isToday(date) ? "date-picker__day--today" : ""} ${isDateDisabled(date) ? "date-picker__day--disabled" : ""} ${isWeekend ? "date-picker__day--weekend" : ""}`}
                  onClick={() => handleDateClick(date)}
                  disabled={isDateDisabled(date)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
