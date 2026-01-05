import React, { useState, useEffect, useMemo } from 'react';
import { Wallet, CalendarClock, Coins } from 'lucide-react';
import { Expense, Frequency, FrequencyMultipliers } from './types';
import { INITIAL_EXPENSES } from './constants';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import SummaryChart from './components/SummaryChart';
import AIAdvisor from './components/AIAdvisor';

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('annual-expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  useEffect(() => {
    localStorage.setItem('annual-expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (name: string, amount: number, frequency: Frequency) => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      name,
      amount,
      frequency,
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const removeExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const totalAnnualCost = useMemo(() => {
    return expenses.reduce((acc, curr) => {
      return acc + (curr.amount * FrequencyMultipliers[curr.frequency]);
    }, 0);
  }, [expenses]);

  const totalMonthlyCost = totalAnnualCost / 12;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <CalendarClock className="text-emerald-600" size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">CalcSpese <span className="text-emerald-600">Annuali</span></h1>
          </div>
          <div className="text-right">
             <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Totale Annuo</p>
             <p className="text-xl font-bold text-slate-900">{formatCurrency(totalAnnualCost)}</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input and List */}
          <div className="lg:col-span-7 space-y-6">
            <ExpenseForm onAdd={addExpense} />
            
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Wallet size={20} className="text-slate-400"/>
                    Le tue Spese Ricorrenti
                </h2>
                <span className="text-sm bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                    {expenses.length}
                </span>
            </div>
            <ExpenseList expenses={expenses} onRemove={removeExpense} />
          </div>

          {/* Right Column: Analytics & AI */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-slate-500">
                    <CalendarClock size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Costo Mensile</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalMonthlyCost)}</p>
                  <p className="text-xs text-slate-400 mt-1">Media stimata</p>
               </div>
               <div className="bg-emerald-600 p-5 rounded-2xl shadow-lg shadow-emerald-200 text-white">
                  <div className="flex items-center gap-2 mb-2 text-emerald-100">
                    <Coins size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Costo Annuo</span>
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(totalAnnualCost)}</p>
                  <p className="text-xs text-emerald-100 mt-1">Proiezione a 12 mesi</p>
               </div>
            </div>

            <SummaryChart expenses={expenses} />
            
            <AIAdvisor expenses={expenses} />

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;