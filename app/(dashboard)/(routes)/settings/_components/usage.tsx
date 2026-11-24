// const usage = [
//   { label: "Questions this month", value: "1,842 / 3,000", percent: 61 },
//   { label: "Storage", value: "4.2 GB / 25 GB", percent: 17 },
//   { label: "Team members", value: "24 / 30", percent: 80 },
// ];

// const Usage = () => {
//   return (
//     <div className="rounded-[10px] border border-[#e3e5e9] bg-white dark:border-[#2c2c2c] dark:bg-[#0a0a0a]">
//       <div className="flex items-center justify-between border-b border-[#edeef1] px-4 py-3 dark:border-[#2c2c2c]">
//         <h2 className="text-sm font-semibold">Usage</h2>
//         <button className="cursor-pointer text-[13px] text-[#1d4f9c]">
//           Upgrade to Pro
//         </button>
//       </div>

//       <div className="flex flex-col gap-5 px-4 py-4">
//         {usage.map((item) => (
//           <div key={item.label}>
//             <div className="flex items-center justify-between">
//               <span className="text-[13px]">{item.label}</span>
//               <span className="text-[12.5px] text-[#6b7280]">{item.value}</span>
//             </div>

//             <div className="mt-2 h-1.5 rounded-full bg-[#f1f2f5] dark:bg-[#2c2c2c]">
//               <div
//                 className="h-1.5 rounded-full bg-[#1d4f9c]"
//                 style={{ width: `${item.percent}%` }}
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Usage;
