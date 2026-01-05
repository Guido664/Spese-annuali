import React from 'react';
import { Trash2 } from 'lucide-react';
import { Expense, FrequencyLabels, FrequencyMultipliers } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  onRemove: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onRemove }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

  if (expenses.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <p className="text-slate-500">Nessuna spesa inserita.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => {
        const annualCost = expense.amount * FrequencyMultipliers[expense.frequency];
        
        return (
          <div key={expense.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800">{expense.name}</h4>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                {formatCurrency(expense.amount)} / {FrequencyLabels[expense.frequency]}
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-400 uppercase font-medium tracking-wider">Totale Annuo</p>
                <p className="font-bold text-emerald-600 flex items-center gap-1 justify-end">
                   {formatCurrency(annualCost)}
                </p>
              </div>

              <button
                onClick={() => onRemove(expense.id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Rimuovi"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExpenseList;