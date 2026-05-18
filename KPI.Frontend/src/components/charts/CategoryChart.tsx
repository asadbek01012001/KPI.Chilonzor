import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import "./assets/category_chart.scss";

interface InfoItem {
  name: string;
  ball: number;
  orni: number;
}

interface Props {
  data: InfoItem[];
}

const CustomChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2 className="chart-title">Йўналишлар бўйича</h2>
        <span className="chart-badge">16 та йўналиш</span>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 60, left: 0 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff1744" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ff1744" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#2d3446"
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              itemStyle={{ color: "#fff" }}
            />

            {/* Ustunli grafik (Ballar uchun) */}
            <Bar dataKey="ball" barSize={30} shape={<CustomBar />}>
              <LabelList
                dataKey="ball"
                position="top"
                fill="#fff"
                fontSize={11}
                offset={10}
              />
            </Bar>

            {/* Chiziqli grafik (O'rni uchun) */}
            <Line
              type="monotone"
              dataKey="orni"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#1e293b" }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                dataKey="orni"
                position="top"
                fill="#3b82f6"
                fontSize={11}
                offset={15}
                className="orni-label"
              />
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="dot ball"></span> балл
        </div>
        <div className="legend-item">
          <span className="dot orni"></span> ўрни
        </div>
      </div>
    </div>
  );
};

// Ustunlarning tepasini yumaloq qilish uchun maxsus shakl
const CustomBar = (props: any) => {
  const { x, y, width, height } = props;
  return (
    <path
      d={`M${x},${y + height} L${x},${y + 10} Q${x},${y} ${x + 10},${y} L${x + width - 10},${y} Q${x + width},${y} ${x + width},${y + 10} L${x + width},${y + height} Z`}
      fill="url(#barGradient)"
      stroke="#ff1744"
      strokeWidth={1}
    />
  );
};

export default CustomChart;
