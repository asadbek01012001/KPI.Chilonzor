import { useEffect, useRef, useState } from "react";
import { CustomInput } from "../form/InputField";
import { useDirectionContext } from "../../api/directions/DirectionApiContext";

import TabPage from "../tabs/TabPage";
import AppButton from "../ui/CustomButton";
import IndicatorsTabLayout from "./IndicatorsTabLayout";
import IndicatorsTableWrapper from "./IndicatorsTableWrapper";
import Modal from "../ui/Modal";
import IndicatorsFormWrapper from "./IndicatorsFormWrapper";

export default function IndicatorsTab() {
  const [formModal, setFormModal] = useState(false);
  const [directions, setDirections] = useState<any[]>([]);
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>("");
  const [reloadKey, setReloadKey] = useState(0);

  const { DirectionApi } = useDirectionContext();

  useEffect(() => {
    DirectionApi.getAll()
      .then(setDirections)
      .catch(console.log);
  }, [DirectionApi]);

  const handleDone = () => {
    setFormModal(false);
    setReloadKey((k) => k + 1);
  };

  return (
    <TabPage
      headerCompoonent={
        <div className="d-flex justify-content-between align-items-center">
          <AppButton
            variant="secondary"
            label="Кўрсаткич қўшиш"
            className="px-4"
            onClick={() => { setSelectedIndicatorId(""); setFormModal(true); }}
          />
          <CustomInput width="400" placeholder="Қидириш..." />
        </div>
      }
    >
      <IndicatorsTabLayout directions={directions}>
        <IndicatorsTableWrapper
          key={reloadKey}
          defaultDirectionId={directions.length > 0 ? directions[0].id : ""}
          onEdit={(id) => { setSelectedIndicatorId(id); setFormModal(true); }}
        />
      </IndicatorsTabLayout>
      <Modal
        title={selectedIndicatorId ? "Кўрсаткични янгилаш" : "Кўрсаткич қўшиш"}
        isOpen={formModal}
        onClose={() => setFormModal(false)}
      >
        <IndicatorsFormWrapper
          selectedIndicator={selectedIndicatorId}
          defaultDirectionId={directions.length > 0 ? directions[0].id : ""}
          onDone={handleDone}
        />
      </Modal>
    </TabPage>
  );
}
