import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';
// for node js
import { promises as fs } from 'fs';

const QQQInvestmentSimulator = () => {
  // State for input parameters
  const [loanAmount, setLoanAmount] = useState(6000);
  const [interestRate, setInterestRate] = useState(3);
  const [startYear, setStartYear] = useState('2020');
  
  // State for data and results
  const [quarterData, setQuarterData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load and parse data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // const fileContent = await window.fs.readFile('qqq-quarterly.txt', { encoding: 'utf8' });
        const response = await fetch('/qqq-quarterly.txt');
        const fileContent = await response.text();

        Papa.parse(fileContent, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (result) => {
            setQuarterData(result.data);
            
            // Extract unique years from quarters
            const years = [...new Set(result.data.map(row => row.Date.split('-')[0]))];
            setAvailableYears(years);
            
            setLoading(false);
          },
          error: (error) => {
            setError('Error parsing CSV: ' + error.message);
            setLoading(false);
          }
        });
      } catch (err) {
        setError('Error loading data: ' + err.message);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Run simulation when parameters change
  useEffect(() => {
    if (quarterData.length > 0 && !loading) {
      runSimulation();
    }
  }, [loanAmount, interestRate, startYear, quarterData, loading]);
  
  // Function to run the simulation
  const runSimulation = () => {
    // Find first quarter of the selected year
    const startQuarter = `${startYear}-Q1`;
    const startQuarterIndex = quarterData.findIndex(row => row.Date === startQuarter);
    
    if (startQuarterIndex === -1) {
      setError(`Start year ${startYear} not found in data`);
      return;
    }
    
    const loanAmountValue = loanAmount * 1000; // Convert K to actual amount
    const interestRateDecimal = interestRate / 100; // Convert percentage to decimal
    
    // Run until the end of available data
    const simulationLength = quarterData.length - startQuarterIndex;
    
    const simulationResults = simulateInvestmentStrategies(
      startQuarterIndex,
      loanAmountValue,
      interestRateDecimal,
      simulationLength
    );
    
    setResults(simulationResults);
  };
  
  // Simulation logic
  const simulateInvestmentStrategies = (startQuarterIndex, loanAmount, interestRate, maxQuarters) => {
    const relevantData = quarterData.slice(startQuarterIndex);
    
    // Limit to available data or specified quarters, whichever is smaller
    const quarters = Math.min(relevantData.length, maxQuarters);
    
    if (quarters < 4) {
      setError("Not enough data for meaningful simulation (need at least 4 quarters)");
      return null;
    }
    
    // Strategy results
    const results = {
      allIn: { quarters: [], balance: [], borrowed: [], interest: [], totalInterest: 0 },
      oneYear: { quarters: [], balance: [], borrowed: [], interest: [], totalInterest: 0 },
      twoYears: { quarters: [], balance: [], borrowed: [], interest: [], totalInterest: 0 },
      threeYears: { quarters: [], balance: [], borrowed: [], interest: [], totalInterest: 0 },
      fourYears: { quarters: [], balance: [], borrowed: [], interest: [], totalInterest: 0 },
    };
    
    const quarterlyInterestRate = interestRate / 4;
    
    // Initialize strategies
    let allInBorrowed = loanAmount;
    let oneYearBorrowed = 0;
    let twoYearsBorrowed = 0;
    let threeYearsBorrowed = 0;
    let fourYearsBorrowed = 0;
    
    let allInBalance = allInBorrowed;
    let oneYearBalance = 0;
    let twoYearsBalance = 0;
    let threeYearsBalance = 0;
    let fourYearsBalance = 0;
    
    // Simulation data for chart
    const chartData = [];
    
    // Simulate each quarter
    for (let i = 0; i < quarters; i++) {
      const quarterReturn = relevantData[i].Return;
      const quarter = relevantData[i].Date;
      const year = quarter.split('-')[0];
      
      // One year strategy (borrow 25% each quarter for 4 quarters)
      if (i < 4) {
        const newBorrow = loanAmount / 4;
        oneYearBorrowed += newBorrow;
        oneYearBalance += newBorrow;
      }
      
      // Two years strategy (borrow 12.5% each quarter for 8 quarters)
      if (i < 8) {
        const newBorrow = loanAmount / 8;
        twoYearsBorrowed += newBorrow;
        twoYearsBalance += newBorrow;
      }
      
      // Three years strategy (borrow 8.33% each quarter for 12 quarters)
      if (i < 12) {
        const newBorrow = loanAmount / 12;
        threeYearsBorrowed += newBorrow;
        threeYearsBalance += newBorrow;
      }
      
      // Four years strategy (borrow 6.25% each quarter for 16 quarters)
      if (i < 16) {
        const newBorrow = loanAmount / 16;
        fourYearsBorrowed += newBorrow;
        fourYearsBalance += newBorrow;
      }
      
      // Apply market returns to current balances
      allInBalance = allInBalance * (1 + quarterReturn);
      oneYearBalance = oneYearBalance * (1 + quarterReturn);
      twoYearsBalance = twoYearsBalance * (1 + quarterReturn);
      threeYearsBalance = threeYearsBalance * (1 + quarterReturn);
      fourYearsBalance = fourYearsBalance * (1 + quarterReturn);
      
      // Calculate interest payments
      const allInInterest = allInBorrowed * quarterlyInterestRate;
      const oneYearInterest = oneYearBorrowed * quarterlyInterestRate;
      const twoYearsInterest = twoYearsBorrowed * quarterlyInterestRate;
      const threeYearsInterest = threeYearsBorrowed * quarterlyInterestRate;
      const fourYearsInterest = fourYearsBorrowed * quarterlyInterestRate;
      
      // Apply interest payments (subtract from balance)
      allInBalance -= allInInterest;
      oneYearBalance -= oneYearInterest;
      twoYearsBalance -= twoYearsInterest;
      threeYearsBalance -= threeYearsInterest;
      fourYearsBalance -= fourYearsInterest;
      
      // Track total interest paid
      results.allIn.totalInterest += allInInterest;
      results.oneYear.totalInterest += oneYearInterest;
      results.twoYears.totalInterest += twoYearsInterest;
      results.threeYears.totalInterest += threeYearsInterest;
      results.fourYears.totalInterest += fourYearsInterest;
      
      // Only add year/quarter data points to chart that complete a year or are at the start/end
      const isFirstQuarter = i === 0;
      const isLastQuarter = i === quarters - 1;
      const isLastQuarterOfYear = quarter.endsWith('Q4');
      
      if (isFirstQuarter || isLastQuarter || isLastQuarterOfYear) {
        chartData.push({
          quarter,
          year,
          allIn: Math.round(allInBalance),
          oneYear: Math.round(oneYearBalance),
          twoYears: Math.round(twoYearsBalance),
          threeYears: Math.round(threeYearsBalance),
          fourYears: Math.round(fourYearsBalance),
          allInBorrowed: Math.round(allInBorrowed),
          oneYearBorrowed: Math.round(oneYearBorrowed),
          twoYearsBorrowed: Math.round(twoYearsBorrowed),
          threeYearsBorrowed: Math.round(threeYearsBorrowed),
          fourYearsBorrowed: Math.round(fourYearsBorrowed),
        });
      }
      
      // Store results for every quarter (for detailed analysis)
      results.allIn.quarters.push(quarter);
      results.allIn.balance.push(allInBalance);
      results.allIn.borrowed.push(allInBorrowed);
      results.allIn.interest.push(allInInterest);
      
      results.oneYear.quarters.push(quarter);
      results.oneYear.balance.push(oneYearBalance);
      results.oneYear.borrowed.push(oneYearBorrowed);
      results.oneYear.interest.push(oneYearInterest);
      
      results.twoYears.quarters.push(quarter);
      results.twoYears.balance.push(twoYearsBalance);
      results.twoYears.borrowed.push(twoYearsBorrowed);
      results.twoYears.interest.push(twoYearsInterest);
      
      results.threeYears.quarters.push(quarter);
      results.threeYears.balance.push(threeYearsBalance);
      results.threeYears.borrowed.push(threeYearsBorrowed);
      results.threeYears.interest.push(threeYearsInterest);
      
      results.fourYears.quarters.push(quarter);
      results.fourYears.balance.push(fourYearsBalance);
      results.fourYears.borrowed.push(fourYearsBorrowed);
      results.fourYears.interest.push(fourYearsInterest);
    }
    
    return { ...results, chartData };
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Component for summary results
  const ResultsSummary = () => {
    if (!results) return null;
    
    const finalQuarterIndex = results.allIn.balance.length - 1;
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-bold mb-4">Final Balance After {results.allIn.quarters.length} Quarters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="font-semibold">All-in</p>
            <p className="text-xl">{formatCurrency(results.allIn.balance[finalQuarterIndex])}</p>
            <p className="text-sm text-gray-500">Interest: {formatCurrency(results.allIn.totalInterest)}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-md">
            <p className="font-semibold">1-Year DCA</p>
            <p className="text-xl">{formatCurrency(results.oneYear.balance[finalQuarterIndex])}</p>
            <p className="text-sm text-gray-500">Interest: {formatCurrency(results.oneYear.totalInterest)}</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-md">
            <p className="font-semibold">2-Year DCA</p>
            <p className="text-xl">{formatCurrency(results.twoYears.balance[finalQuarterIndex])}</p>
            <p className="text-sm text-gray-500">Interest: {formatCurrency(results.twoYears.totalInterest)}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-md">
            <p className="font-semibold">3-Year DCA</p>
            <p className="text-xl">{formatCurrency(results.threeYears.balance[finalQuarterIndex])}</p>
            <p className="text-sm text-gray-500">Interest: {formatCurrency(results.threeYears.totalInterest)}</p>
          </div>
          <div className="bg-red-50 p-3 rounded-md">
            <p className="font-semibold">4-Year DCA</p>
            <p className="text-xl">{formatCurrency(results.fourYears.balance[finalQuarterIndex])}</p>
            <p className="text-sm text-gray-500">Interest: {formatCurrency(results.fourYears.totalInterest)}</p>
          </div>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return <div className="p-4">Loading QQQ quarterly data...</div>;
  }
  
  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }
  
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">QQQ Investment Strategy Simulator</h2>
      
      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Loan Amount (K)</label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
              min="1"
              max="10000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
              min="0.1"
              max="20"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Year</label>
            <select
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Results Summary */}
      {results && <ResultsSummary />}
      
      {/* Balance Chart */}
      {results && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-bold mb-4">Portfolio Balance Over Time</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={results.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Legend />
              <Line type="monotone" dataKey="allIn" name="All-in" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="oneYear" name="1-Year DCA" stroke="#10b981" strokeWidth={2} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="twoYears" name="2-Year DCA" stroke="#f59e0b" strokeWidth={2} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="threeYears" name="3-Year DCA" stroke="#8b5cf6" strokeWidth={2} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="fourYears" name="4-Year DCA" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {/* Borrowed Amount Chart */}
      {results && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-bold mb-4">Borrowed Amount Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={results.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Legend />
              <Line type="stepAfter" dataKey="allInBorrowed" name="All-in" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} />
              <Line type="stepAfter" dataKey="oneYearBorrowed" name="1-Year DCA" stroke="#10b981" strokeWidth={2} activeDot={{ r: 6 }} />
              <Line type="stepAfter" dataKey="twoYearsBorrowed" name="2-Year DCA" stroke="#f59e0b" strokeWidth={2} activeDot={{ r: 6 }} />
              <Line type="stepAfter" dataKey="threeYearsBorrowed" name="3-Year DCA" stroke="#8b5cf6" strokeWidth={2} activeDot={{ r: 6 }} />
              <Line type="stepAfter" dataKey="fourYearsBorrowed" name="4-Year DCA" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      
      <div className="bg-gray-50 p-4 rounded-lg mt-6">
        <h3 className="text-lg font-semibold mb-2">Notes:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>All-in: Invest the entire loan amount immediately</li>
          <li>1-Year DCA: Invest 25% of the loan each quarter for 1 year</li>
          <li>2-Year DCA: Invest 12.5% of the loan each quarter for 2 years</li>
          <li>3-Year DCA: Invest 8.33% of the loan each quarter for 3 years</li>
          <li>4-Year DCA: Invest 6.25% of the loan each quarter for 4 years</li>
          <li>Interest is applied quarterly (annual rate ÷ 4) only on the borrowed amount</li>
          <li>Simulation runs from selected start year to the end of available data ({availableYears[availableYears.length-1]})</li>
          <li>DCA = Dollar Cost Averaging</li>
        </ul>
      </div>
    </div>
  );
};

export default QQQInvestmentSimulator;
