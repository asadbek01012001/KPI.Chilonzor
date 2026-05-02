import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./assets/daily_chart.scss";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const formatted =
      Number(value) % 1 === 0 ? Number(value) : Number(value).toFixed(1);

    return (
      <div className="custom-tooltip">
        <p className="label">{label}</p>
        <div className="value-container">
          <span className="dot"></span>
          <span className="key">Балл</span>
          <span className="value">{formatted}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function DailyChart({ data }: { data: any[] }) {
  const { roundedMax, ticks } = useMemo(() => {
    // 🔥 1. max score (har safar yangi data uchun)
    const maxScore = Math.max(...data.map((item) => item.score || 0), 0);

    // 🔥 2. chiroyli rounding
    const getRoundedMax = (value: number) => {
      if (value <= 100) return 100;

      const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
      return Math.ceil(value / magnitude) * magnitude;
    };

    const roundedMax = getRoundedMax(maxScore);

    // 🔥 3. ticks
    const generateTicks = (max: number, count = 6) => {
      const step = Math.ceil(max / count);
      return Array.from({ length: count + 1 }, (_, i) => i * step);
    };

    const ticks = generateTicks(roundedMax);

    return { roundedMax, ticks };
  }, [data]); // 👈 muhim: data o‘zgarsa qayta hisoblanadi

  // 🔥 number formatter (1 ta kasr)
  const formatNumber: any = (value: number) => {
    const num = Number(value);
    return num % 1 === 0 ? num : num.toFixed(1);
  };

  return (
    <div className="chart-wrapper">
      <div className="chart-header">
        <div className="legend-item">
          <span className="line"></span>
          <span className="text">Балл</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data.map((item: any) => ({
            ...item,
            date: item.date,
          }))}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f2c3" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#00f2c3" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={true}
            horizontal={true}
            stroke="#1f2937"
          />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            domain={[0, roundedMax]}
            ticks={ticks}
            tickFormatter={formatNumber}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="score"
            stroke="#00f2c3"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorScore)"
            dot={{
              r: 4,
              fill: "#00f2c3",
              strokeWidth: 2,
              stroke: "#0b1120",
            }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
