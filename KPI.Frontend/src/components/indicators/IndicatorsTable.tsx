import { useState } from "react";
import "./assets/accardion_table.scss";
import EditIcon from "../icons/EditIcon";
import DeleteIcon from "../icons/DeleteIcon";

interface Props {
  readonly data: any[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onToggleSubtraction?: (item: any, value: boolean) => void;
}

export default function IndicatorsTable({ data, onEdit, onDelete, onToggleSubtraction }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="cr-accordion">
      <div className="cr-table-header">
        <div>№</div>
        <div>Кўрсаткич</div>
        <div className="text-end pe-2">Бал</div>
        <div className="text-center">Сони</div>
        <div className="text-center">Амаллар</div>
      </div>

      <div className="cr-table-body">
        {data?.map((item: any, index: number) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={`cr-item ${index % 2 === 0 ? "even" : "odd"} ${isOpen ? "open" : ""}`}
            >
              <div className="cr-row-header" onClick={() => toggle(index)}>
                <div className="col index">{index + 1}</div>
                <div className="col indicator">{item.name}</div>
                <div className="col score">{item.score ?? "—"}</div>
                <div className="col count">{item.children?.length ?? 0}</div>
                <div className="col actions" onClick={(e) => e.stopPropagation()}>
                  <button className="btn-edit" onClick={() => onEdit?.(item)}>
                    <EditIcon size={30} color="#17B8BE" />
                  </button>
                  <button className="btn-delete" onClick={() => onDelete?.(item)}>
                    <DeleteIcon size={30} color="#f87171" />
                  </button>
                </div>
              </div>

              <div className="cr-body" style={{ maxHeight: isOpen ? "400px" : "0" }}>
                {item.children?.map((child: any, j: number) => (
                  <div key={j} className={`cr-row-child ${j % 2 === 0 ? "even" : "odd"}`}>
                    <div className="col index">{index + 1}.{j + 1}</div>
                    <div className="col indicator">{child.name}</div>
                    <div className="col score">{child.score ?? "—"}</div>
                    <div className="col count">—</div>
                    <div className="col actions">
                      <button className="btn-edit" onClick={() => onEdit?.(child)}>
                        <EditIcon size={30} color="#17B8BE" />
                      </button>
                      <button className="btn-delete" onClick={() => onDelete?.(child)}>
                        <DeleteIcon size={30} color="#f87171" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
