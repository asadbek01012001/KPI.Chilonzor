import React, { useState } from "react";
import "./assets/users_table.scss";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Props {
  data: UserRow[];
  onEdit?: (user: UserRow) => void;
  onDelete?: (user: UserRow) => void;
  readonly loading?: boolean;
}

const COLUMNS = [
  "№",
  "Ism sharifi",
  "Email",
  "Rol",
  "Status",
  "Oxirgi kirish",
  "Yaratilgan vaqti",
  "Amallar",
];

const EditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const UsersTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day   = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year  = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "—";
    const date    = new Date(dateString);
    const day     = String(date.getDate()).padStart(2, "0");
    const month   = String(date.getMonth() + 1).padStart(2, "0");
    const year    = date.getFullYear();
    const hours   = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const formatRole = (role: string) => {
    return role === "admin" ? "Admin" : "Foydalanuvchi";
  };

  return (
    <div className="user-table-wrapper">
      <table className="user-table">
        <thead className="user-table__thead">
          <tr>
            {COLUMNS.map((col) => (
              <th key={col} className="user-table__th">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr className="user-table__tr">
              <td colSpan={8} className="user-table__empty">
                Ma'lumot topilmadi
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={row.id}
                className={`user-table__tr${hoveredRow === index ? " user-table__tr--hovered" : ""}`}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="user-table__td user-table__td--index">
                  {index + 1}
                </td>
                <td className="user-table__td user-table__td--name">
                  {row.name}
                </td>
                <td className="user-table__td">{row.email}</td>
                <td className="user-table__td">
                  <span className={`user-table__role user-table__role--${row.role}`}>
                    {formatRole(row.role)}
                  </span>
                </td>
                <td className="user-table__td">
                  <span
                    className={`user-table__badge${row.is_active ? " user-table__badge--active" : " user-table__badge--inactive"}`}
                  >
                    {row.is_active ? "Фаол" : "Фаол эмас"}
                  </span>
                </td>
                <td className="user-table__td user-table__td--login">
                  {formatDateTime(row.last_login_at)}
                </td>
                <td className="user-table__td">{formatDate(row.created_at)}</td>
                <td className="user-table__td user-table__td--actions">
                  <div className="user-table__actions">
                    <button
                      className="user-table__btn user-table__btn--edit p-2"
                      onClick={() => onEdit?.(row)}
                      title="Tahrirlash"
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="user-table__btn user-table__btn--delete p-2"
                      onClick={() => onDelete?.(row)}
                      title="O'chirish"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
