import { useState } from "react";
import Modal from "../ui/Modal";
import UsersTableWrapper from "./UsersTableWrapper";
import UsersFormWrapper from "./UsersFormWrapper";

export default function UsersTab() {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [formModal, setFormModal]           = useState(false);
  const [refreshSignal, setRefreshSignal]   = useState(0);

  const handleAdd = () => {
    setSelectedUserId("");
    setFormModal(true);
  };

  const handleEdit = (id: string) => {
    setSelectedUserId(id);
    setFormModal(true);
  };

  const handleSuccess = () => {
    setFormModal(false);
    setSelectedUserId("");
    setRefreshSignal((prev) => prev + 1);
  };

  const handleCloseModal = () => {
    setFormModal(false);
    setSelectedUserId("");
  };

  return (
    <>
      <UsersTableWrapper
        onAdd={handleAdd}
        onEdit={handleEdit}
        refreshSignal={refreshSignal}
      />

      <Modal
        title={
          selectedUserId ? "Фойдаланувчини таҳрирлаш" : "Фойдаланувчи қўшиш"
        }
        isOpen={formModal}
        onClose={handleCloseModal}
      >
        <UsersFormWrapper userId={selectedUserId} onSuccess={handleSuccess} />
      </Modal>
    </>
  );
}
