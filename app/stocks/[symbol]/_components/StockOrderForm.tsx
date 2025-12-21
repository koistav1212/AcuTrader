"use client";

import { useState } from "react";
import { useUser } from "../../../context/UserContext";
import { cn } from "../../../lib/utils";

interface StockOrderFormProps {
  symbol: string;
  currentPrice: number;
  logo: string;
  name: string;
  marketState: string;
}

export default function StockOrderForm({ symbol, currentPrice, logo, name, marketState }: StockOrderFormProps) {
  const { holdings, buyStock, sellStock, user } = useUser();
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const holding = holdings.find((h) => h.symbol === symbol);
  const ownedQuantity = holding ? holding.quantity : 0;

  // Switch to buy tab if user doesn't own stock and tries to switch to sell
  const handleTabChange = (tab: "buy" | "sell") => {
    if (tab === "sell" && ownedQuantity <= 0) return;
    setActiveTab(tab);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please login to trade.");
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (activeTab === "buy") {
        await buyStock(symbol, quantity, currentPrice);
        setSuccess(`Successfully bought ${quantity} share(s) of ${symbol}`);
      } else {
        if (quantity > ownedQuantity) {
          setError(`You only own ${ownedQuantity} shares.`);
          setLoading(false);
          return;
        }
        await sellStock(symbol, quantity, currentPrice);
        setSuccess(`Successfully sold ${quantity} share(s) of ${symbol}`);
        
        // If sold all, switch to buy tab
        if (quantity === ownedQuantity) {
             setActiveTab("buy");
        }
      }
    } catch (err) {
      setError("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const total = (quantity * currentPrice).toFixed(2);

  const isMarketClosed = false;

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1.5 shadow-sm">
          <img src={logo} alt={symbol} className="w-full h-full object-contain" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--text)]">Trade {symbol}</h3>
          <p className="text-xs text-[var(--text-secondary)]">{name}</p>
        </div>
      </div>

      <div className="flex bg-[var(--bg-secondary)] p-1 rounded-xl mb-6">
        <button
          onClick={() => handleTabChange("buy")}
          className={cn(
            "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
            activeTab === "buy"
              ? "bg-[var(--card)] text-[var(--text)] shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text)]"
          )}
        >
          Buy
        </button>
        <button
          onClick={() => handleTabChange("sell")}
          disabled={ownedQuantity <= 0}
          className={cn(
            "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
            activeTab === "sell"
              ? "bg-[var(--card)] text-[var(--text)] shadow-sm"
              : "text-[var(--text-secondary)]",
            ownedQuantity <= 0 && "opacity-50 cursor-not-allowed"
          )}
        >
          Sell
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
           <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Quantity</label>
            {activeTab === "sell" && (
                <span className="text-xs text-[var(--text-secondary)]">Available: {ownedQuantity}</span>
            )}
           </div>
          <input
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
          />
        </div>

        <div className="flex justify-between items-center py-2 border-t border-b border-[var(--border)] border-dashed">
          <span className="text-sm text-[var(--text-secondary)]">Estimated Total</span>
          <span className="text-lg font-bold text-[var(--text)]">${total}</span>
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}
        {success && <div className="text-sm text-green-500">{success}</div>}

        <button
          type="submit"
          disabled={loading || (activeTab === "buy" && isMarketClosed)}
          className={cn(
            "w-full py-3 rounded-xl font-bold text-white transition-all transform active:scale-[0.98]",
            activeTab === "buy"
                ? isMarketClosed 
                    ? "bg-gray-500 cursor-not-allowed" 
                    : "bg-[var(--accent)] hover:opacity-90 shadow-lg shadow-blue-500/20"
                : "bg-red-500 hover:opacity-90 shadow-lg shadow-red-500/20",
            loading && "opacity-70 cursor-wait"
          )}
        >
          {loading ? (
             <span className="flex items-center justify-center gap-2">
               <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
               Processing...
             </span>
          ) : (
            activeTab === "buy" && isMarketClosed ? "Market Closed" : `${activeTab === "buy" ? "Buy" : "Sell"} ${symbol}`
          )}
        </button>
      </form>
      
      {activeTab === "buy" && isMarketClosed && (
          <p className="text-xs text-amber-500 text-center mt-2 font-medium">
            Buying is currently unavailable because the market is closed.
          </p>
      )}

      {activeTab === "buy" && !isMarketClosed && (
          <p className="text-xs text-[var(--text-secondary)] text-center mt-4">
            Market orders are executed at the best available price.
          </p>
      )}
    </div>
  );
}
