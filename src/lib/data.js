// lib/data.js

export function generateRandomChartData() {
  const dates = [];
  const balance = [];
  const budget = [];
  const expense = [];
  let currentBalance = 15700;
  
  for (let i = 0; i < 15; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (14 - i));
    dates.push(`${date.getMonth() + 1}/${date.getDate()}`);
    
    // Line Chart (Total Balance Overview)
    // Simulates natural financial fluctuation
    currentBalance += Math.floor(Math.random() * 800) - 400; 
    balance.push(Math.max(10000, currentBalance)); // Ensure balance doesn't drop too low

    // Bar Chart (Comparing Budget and Expense)
    if (i % 3 === 0) { // Simulate monthly data points
        budget.push(Math.floor(Math.random() * 1500) + 3500);
        expense.push(Math.floor(Math.random() * 1200) + 2500);
    }
  }

  // Donut Chart (Statistics/Expense Breakdown)
  const categories = [
    { name: 'Food', value: Math.floor(Math.random() * 800) + 500, color: '#6c5ce7' },
    { name: 'Bills', value: Math.floor(Math.random() * 800) + 500, color: '#feca57' },
    { name: 'Shopping', value: 1500, color: '#ff9f43' },
    { name: 'School', value: Math.floor(Math.random() * 800) + 300, color: '#2ecc71' },
    { name: 'Others', value: Math.floor(Math.random() * 500) + 200, color: '#a29bfe' },
  ];

  return {
    lineChartData: { labels: dates, data: balance },
    barChartData: { labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], budget, expense },
    donutChartData: categories,
  };
}