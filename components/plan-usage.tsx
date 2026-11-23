const label = "Questions";
const used = 1842;
const limit = 3000;
const percent = 61;

const PlanUsage = () => {
  return (
    <div className="border-t border-[#e3e5e9] p-3 dark:border-[#2c2c2c]">
      <div className="border rounded-md px-3 py-3">
        <div className="flex items-center justify-between">
          <span className="text-[12.5px] text-[#6b7280]">Plan usage</span>
          <span className="text-[12.5px]">
            {used} / {limit}
          </span>
        </div>

        <div className="mt-2 h-1.5 rounded-full bg-[#f1f2f5] dark:bg-[#2c2c2c]">
          <div
            className="h-1.5 rounded-full bg-[#1d4f9c]"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="mt-1.5 text-[11.5px] text-[#8b9199]">{label}</div>
      </div>
    </div>
  );
};

export default PlanUsage;
