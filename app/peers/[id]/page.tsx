"use client";

import { peers, userPerformanceHistory, type PeerPerformancePoint } from "../../lib/data/sim-data";
import { notFound } from "next/navigation";
import { ArrowLeft, TrendingUp, Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { cn } from "../../lib/utils";

// Custom Tooltip for Chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] p-3 rounded-xl shadow-xl">
        <p className="font-bold text-[var(--text)] mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs font-medium" style={{ color: entry.color }}>
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function PeerComparisonPage({ params }: { params: { id: string } }) {
  const peer = peers.find((p) => p.id === params.id);

  if (!peer) {
    notFound();
  }

  // Combine data for the customized chart
  const chartData = userPerformanceHistory.map((userPoint, index) => {
    const peerPoint = peer.performanceHistory[index];
    return {
      name: userPoint.month,
      You: userPoint.value,
      [peer.name]: peerPoint ? peerPoint.value : null,
    };
  });

  return (
    <div className="space-y-8 pb-20">
      {/* --- Breadcrumb / Back --- */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
         <Link href="/profile" className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Profile
         </Link>
         <span>/</span>
         <span className="font-semibold text-[var(--text)]">Peer Comparison</span>
      </div>

      {/* --- Header Section --- */}
      <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] p-8 shadow-lg flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          {/* Vs Graphic */}
          <div className="flex items-center gap-6 z-10">
             <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] border-4 border-[var(--card)] shadow-lg mx-auto overflow-hidden flex items-center justify-center">
                    <span className="font-bold text-[var(--text-secondary)]">YOU</span>
                </div>
                <p className="mt-2 font-bold text-[var(--text)]">You</p>
             </div>
             
             <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center font-black text-[var(--accent)] text-xs">
                VS
             </div>

             <div className="text-center">
                <div className="relative w-20 h-20 rounded-full bg-[var(--bg-secondary)] border-4 border-[var(--card)] shadow-lg mx-auto overflow-hidden">
                   <Image src={peer.avatar} alt={peer.name} fill className="object-cover" />
                </div>
                <p className="mt-2 font-bold text-[var(--text)]">{peer.name}</p>
             </div>
          </div>

          <div className="flex-grow z-10 text-center md:text-left space-y-2">
             <h1 className="text-2xl font-bold text-[var(--text)]">Performance Comparison</h1>
             <p className="text-[var(--text-secondary)] max-w-lg mx-auto md:mx-0">
                Analyze how your portfolio performs against {peer.name}&apos;s strategy over time.
             </p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* --- Chart Section --- */}
         <div className="lg:col-span-2 bg-[var(--card)] rounded-3xl border border-[var(--border)] p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                    <TrendingUp className="w-4 h-4"/>
                 </div>
                 <h2 className="text-lg font-bold text-[var(--text)]">Monthly Growth</h2>
               </div>
            </div>

            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
                      tickFormatter={(value) => `$${value/1000}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" />
                    <Line 
                      type="monotone" 
                      dataKey="You" 
                      stroke="var(--accent)" 
                      strokeWidth={3} 
                      dot={{ r: 4, strokeWidth: 2, fill: "var(--card)" }} 
                      activeDot={{ r: 6 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey={peer.name} 
                      stroke="#8884d8" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                      dot={{ r: 4, strokeWidth: 2, fill: "var(--card)" }} 
                    />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* --- Holdings Comparison --- */}
         <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] p-6 shadow-lg h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                 <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Briefcase className="w-4 h-4"/>
                 </div>
                 <h2 className="text-lg font-bold text-[var(--text)]">{peer.name}&apos;s Top Holdings</h2>
            </div>
            
            <div className="flex-grow overflow-auto pr-2 space-y-3 custom-scrollbar">
               {peer.holdings.map((h) => {
                  const marketValue = h.quantity * h.marketPrice;
                  return (
                    <div key={h.symbol} className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)]/50 hover:border-[var(--accent)]/30 transition-colors">
                       <div className="flex justify-between items-start mb-2">
                          <div>
                             <p className="font-bold text-[var(--text)]">{h.symbol}</p>
                             <p className="text-xs text-[var(--text-secondary)]">{h.quantity} Shares</p>
                          </div>
                          <div className="text-right">
                             <p className="font-bold text-[var(--text)]">${marketValue.toLocaleString()}</p>
                             <span className={cn(
                               "text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-1",
                               h.dailyChange >= 0 
                                 ? "bg-[var(--profit)]/15 text-[var(--profit)]"
                                 : "bg-[var(--loss)]/15 text-[var(--loss)]"
                             )}>
                               {h.dailyChange > 0 ? "+" : ""}{h.dailyChange}%
                             </span>
                          </div>
                       </div>
                       
                       <div className="w-full bg-[var(--border)] h-1.5 rounded-full overflow-hidden mt-2">
                           {/* Simple visual bar representing allocation relative to an arbitrary max for demo */}
                           <div 
                              className="h-full bg-[var(--accent)] rounded-full" 
                              style={{ width: `${Math.min((marketValue / 5000) * 100, 100)}%` }} 
                           />
                       </div>
                    </div>
                  )
               })}
            </div>
         </div>

      </div>

    </div>
  );
}
