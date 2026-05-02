import React from "react";
import "./assets/iib_table_card.scss";

// Ma'lumotlar strukturasi uchun interfeys
export interface MahallaRating {
  id: number | string;
  name: string;
  score: number;
  totalRank: number;
  averageRank: number;
}

// Props uchun interfeys
interface RatingTableProps {
  title: string;
  data: MahallaRating[];
}

const IIBTableCard: React.FC<RatingTableProps> = ({ title, data }) => {
  // Ballarni dinamik hisoblash
  const totalScore = data.reduce((sum, item) => sum + item.score, 0);

  return (
    <div className="rating-card">
      <div className="card-header">
        <h2>{title}</h2>
        <div className="total-score-badge">
          Жами балл: <strong>{totalScore.toLocaleString()}</strong>
        </div>
      </div>

      <div className="table-container mt-2">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Махалла номи</th>
              <th className="text-center">Тўплаган бали</th>
              <th className="text-center">Умумий ўрни</th>
              <th className="text-center">Ўртача ўрни</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td className="mahalla-cell">{item.name}</td>
                  <td className="score-cell text-center">{item.score}</td>
                  <td className="rank-cell text-center">{item.totalRank}</td>
                  <td className="text-center">{item.averageRank}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Ma'lumotlar mavjud emas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IIBTableCard;
