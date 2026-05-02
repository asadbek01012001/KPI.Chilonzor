import { useEffect, useState } from "react";
import { useUserContext } from "../../api/users/UserApiContext";
import TabPage from "../tabs/TabPage";
import AppButton from "../ui/CustomButton";
import UsersTable, { UserRow } from "./UsersTable";
import "./assets/users_table_wrapper.scss";
import PlusIcon from "../icons/PlusIcon";

interface Props {
  readonly onAdd: () => void;
  readonly onEdit: (id: string) => void;
}

export default function UsersTableWrapper({ onAdd, onEdit }: Props) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const { UserApi } = useUserContext();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await UserApi.getAll();
      setUsers(res);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (item: UserRow) => {
    if (window.confirm(`"${item.name}" ni o'chirmoqchimisiz?`)) {
      try {
        await UserApi.deleteUser(item.id);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Xatolik yuz berdi!");
      }
    }
  };

  return (
    <TabPage
      headerCompoonent={
        <div className="d-flex justify-content-end">
          <AppButton
            variant="secondary"
            label={
              <span className="button-content">
                <PlusIcon /> Қўшиш
              </span>
            }
            className="custom-add-button"
            onClick={onAdd}
          />
        </div>
      }
    >
      <UsersTable
        data={users}
        onEdit={(item) => onEdit(item.id)}
        onDelete={handleDelete}
        loading={loading}
      />
    </TabPage>
  );
}
