type ChartItem = {
  label: string;
  value: number;
  color?: string;
};

export default function StudyBarChart({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items: ChartItem[];
}) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);
  const columns = Math.max(items.length, 1);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6">
        <h3 className="text-lg font-bold">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950 overflow-hidden">
        <div
          className="grid items-end gap-3"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {items.map((item) => {
            const heightPercent = (item.value / maxValue) * 100;

            return (
              <div key={item.label} className="min-w-0">
                <div className="mb-3 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
                  {item.value} min
                </div>

                <div className="flex h-[220px] items-end justify-center">
                  <div
                    className="w-full max-w-[56px] rounded-t-2xl transition-all duration-500"
                    style={{
                      height: `${Math.max(heightPercent, item.value > 0 ? 8 : 0)}%`,
                      backgroundColor: item.color ?? '#6366f1',
                    }}
                  />
                </div>

                <div className="mt-3 truncate text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}