"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

const generateRandomData = () => {
  return months.map((month) => ({
    month,
    budget: Math.floor(Math.random() * 3000) + 1000,
    expense: Math.floor(Math.random() * 3000) + 500,
  }));
};

export default function BarChart({ dataPoints: externalDataPoints = [] }) {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    if (externalDataPoints.length) {
      setDataPoints(externalDataPoints);
      return;
    }
    setDataPoints(generateRandomData());
  }, [externalDataPoints]);

  const data = {
    labels: dataPoints.map((d) => d.month),
    datasets: [
      {
        label: "Budget",
        data: dataPoints.map((d) => d.budget),
        backgroundColor: "#22C55E",
        barPercentage: 0.6, // relative width of bar within its category
        categoryPercentage: 0.8, // relative width of all bars in a category
        borderRadius: 100, // round corners
      },
      {
        label: "Expense",
        data: dataPoints.map((d) => d.expense),
        backgroundColor: "#EF4444",
        barPercentage: 0.6, // relative width of bar within its category
        categoryPercentage: 0.8, // relative width of all bars in a category
        borderRadius: 100, // round corners
      },
    ],
  };

const maxY = Math.max(
  ...dataPoints.map(d => Math.max(d.budget, d.expense))
);

const options = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: {
      display: true,
    //   text: "Budget vs Expense (7 Months)",
      font: { size: 18 },
    },
    tooltip: { mode: "index", intersect: false },
  },
  interaction: { mode: "nearest", axis: "x", intersect: false },
  scales: {
    y: {
      min: 0,
      max: maxY, // maximum value from data
      ticks: {
        stepSize: Math.ceil(maxY / 4), // 3-4 ticks
      },
    },
  },
};


  return (
    <div className="w-full p-6 rounded-2xl shadow-lg border h-[45vh]">
        <h1 className='font-bold text-2xl text-center -mb-[5vh]'>Budget vs Expense (7 Months)</h1>
  <Bar data={data} options={{ ...options, maintainAspectRatio: false }} />
</div>

  );
}
