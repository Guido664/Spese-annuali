import React, { useState } from 'react';
import { Sparkles, Loader2, Lightbulb, TrendingDown } from 'lucide-react';
import { Expense } from '../types';
import { analyzeExpenses } from '../services/geminiService';

interface AIAdvisorProps {
  expenses: Expense[];
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ expenses }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{
    advice: string;
    dominantCategory: string;
    potentialSavings: string;
  } | null>(null);

  const handleAnalyze = async () => {
    if (expenses.length === 0) return;
    setLoading(true);
    try {
      const result = await analyzeExpenses(expenses);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-indigo-600" size={24} />
          <h3 className="text-lg font-bold text-indigo-900">Gemini Financial Advisor</h3>
        </div>
      </div>

      {!analysis && !loading && (
        <div className="text-center py-4">
          <p className="text-indigo-700 mb-4 text-sm">
            Ottieni un'analisi intelligente delle tue spese annuali per scoprire dove puoi risparmiare.
          </p>
          <button
            onClick={handleAnalyze}
            disabled={expenses.length === 0}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
          >
            Analizza con AI
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-8 text-indigo-600">
          <Loader2 className="animate-spin mb-2" size={32} />
          <span className="text-sm font-medium">Gemini sta analizzando il tuo budget...</span>
        </div>
      )}

      {analysis && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-indigo-50/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1 flex items-center gap-1">
              <Lightbulb size={14} /> Consiglio
            </h4>
            <p className="text-indigo-900 font-medium">{analysis.advice}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div className="bg-white/60 p-3 rounded-xl backdrop-blur-sm border border-indigo-50/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">Categoria Top</h4>
                <p className="text-slate-800 font-bold">{analysis.dominantCategory}</p>
             </div>
             <div className="bg-white/60 p-3 rounded-xl backdrop-blur-sm border border-indigo-50/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1 flex items-center gap-1">
                    <TrendingDown size={14} /> Risparmio
                </h4>
                <p className="text-emerald-600 font-bold">{analysis.potentialSavings}</p>
             </div>
          </div>
          
          <button 
            onClick={handleAnalyze}
            className="w-full text-center text-xs text-indigo-500 hover:text-indigo-700 mt-2 underline"
          >
            Aggiorna analisi
          </button>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;