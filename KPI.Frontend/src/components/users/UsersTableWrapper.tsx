import { useEffect, useRef, useState } from "react";
import { useUserContext } from "../../api/users/UserApiContext";
import { PaginationMeta } from "../../api/users/UserDto";
import TabPage from "../tabs/TabPage";
import AppButton from "../ui/CustomButton";
import UsersTable, { UserRow } from "./UsersTable";
import Loading from "../ui/Loading";
import PlusIcon from "../icons/PlusIcon";
import "./assets/users_table_wrapper.scss";

interface Props {
  readonly onAdd: () => void;
  readonly onEdit: (id: string) => void;
  readonly refreshSignal: number;
}

const LIMIT = 10;

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function UsersTableWrapper({ onAdd, onEdit, refreshSignal }: Props) {
  const [users, setUsers]           = useState<UserRow[]>([]);
  const [loading, setLoading]       = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch]         = useState("");
  const [role, setRole]             = useState<"" | "admin" | "user">("");
  const [page, setPage]             = useState(1);
  const [meta, setMeta]             = useState<PaginationMeta>({ total: 0, page: 1, limit: LIMIT, pages: 1 });
  const { UserApi }                 = useUserContext();
  const searchTimer                 = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fetchUsers = async (currentPage: number, currentSearch: string, currentRole: string) => {
    try {
      setLoading(true);
      const res = await UserApi.getAllPaginated({
        page:   currentPage,
        limit:  LIMIT,
        search: currentSearch || undefined,
        role:   (currentRole as "admin" | "user") || undefined,
      });
      setUsers(res.data as UserRow[]);
      setMeta(res.meta);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, search, role);
  }, [page, search, role, refreshSignal]);

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
      setSearch(value);
    }, 400);
  };

  const handleRoleChange = (value: string) => {
    setRole(value as "" | "admin" | "user");
    setPage(1);
  };

  const handleDelete = async (item: UserRow) => {
    if (window.confirm(`"${item.name}" ni o'chirmoqchimisiz?`)) {
      try {
        await UserApi.deleteUser(item.id);
        fetchUsers(page, search, role);
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Xatolik yuz berdi!");
      }
    }
  };

  const totalPages = meta.pages || 1;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <TabPage
      headerCompoonent={
        <div className="users-toolbar">
          <AppButton
            variant="primary"
            label={
              <span className="users-toolbar__btn-content">
                <PlusIcon /> Қўшиш
              </span>
            }
            className="custom-add-button"
            onClick={onAdd}
          />

          <div className="users-toolbar__search">
            <SearchIcon />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <select
            className="users-toolbar__select"
            value={role}
            onChange={(e) => handleRoleChange(e.target.value)}
          >
            <option value="">Barcha rollar</option>
            <option value="admin">Admin</option>
            <option value="user">Foydalanuvchi</option>
          </select>
        </div>
      }
    >
      <div className="users-body">
        <div className="users-body__table">
          {loading ? (
            <Loading />
          ) : (
            <UsersTable
              data={users}
              onEdit={(item) => onEdit(item.id)}
              onDelete={handleDelete}
              loading={loading}
            />
          )}
        </div>

        {!loading && totalPages > 0 && (
          <div className="users-body__pagination">
            <span className="users-pagination__info">
              Jami: {meta.total} ta
            </span>
            <div className="users-pagination">
              <button
                className="users-pagination__btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft />
              </button>

              {getPageNumbers().map((p, idx) =>
                p === "..." ? (
                  <span key={`dots-${idx}`} className="users-pagination__dots">…</span>
                ) : (
                  <button
                    key={p}
                    className={`users-pagination__btn${page === p ? " users-pagination__btn--active" : ""}`}
                    onClick={() => setPage(p as number)}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                className="users-pagination__btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </TabPage>
  );
}
