// import { useState, useEffect } from "react";
// //import { MarketDataCard } from "../ui/MarketDataCard";

// export function FinancialIndicators() {
//   const [indicators, setIndicators] = useState({
//     dolar: { value: "5.07", change: 0.42 },
//     ibovespa: { value: "128.473", change: -0.18 },
//     sp500: { value: "5.239", change: 0.21 }
//   });

//   useEffect(() => {
//     // Simulação de atualização dos dados financeiros a cada 1 minuto
//     // Em um caso real, isso seria uma chamada API
//     const interval = setInterval(() => {
//       // Simula pequenas mudanças nos valores para dar a impressão de atualização
//       setIndicators(prev => ({
//         dolar: {
//           value: (parseFloat(prev.dolar.value) + (Math.random() * 0.02 - 0.01)).toFixed(2),
//           change: +(prev.dolar.change + (Math.random() * 0.1 - 0.05)).toFixed(2)
//         },
//         ibovespa: {
//           value: Math.floor(parseFloat(prev.ibovespa.value) + (Math.random() * 100 - 50)).toString(),
//           change: +(prev.ibovespa.change + (Math.random() * 0.1 - 0.05)).toFixed(2)
//         },
//         sp500: {
//           value: (parseFloat(prev.sp500.value) + (Math.random() * 0.01 - 0.005)).toFixed(3),
//           change: +(prev.sp500.change + (Math.random() * 0.1 - 0.05)).toFixed(2)
//         }
//       }));
//     }, 60000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4 animate-fade-in">
//       <MarketDataCard
//         title="USD/BRL"
//         value={indicators.dolar.value}
//         change={indicators.dolar.change}
//         prefix="R$ "
//       />
//       <MarketDataCard
//         title="Ibovespa"
//         value={indicators.ibovespa.value}
//         change={indicators.ibovespa.change}
//         suffix=" pts"
//       />
//       <MarketDataCard
//         title="S&P 500"
//         value={indicators.sp500.value}
//         change={indicators.sp500.change}
//         suffix=" pts"
//       />
//     </div>
//   );
// }
