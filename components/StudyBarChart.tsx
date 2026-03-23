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
    <div className="ui-card p-6">
      <div className="mb-5">
        <h3 className="ui-section-title">{title}</h3>
        {description ? (
          <p className="ui-text-secondary mt-2">{description}</p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl bg-slate-100 px-4 py-5 dark:bg-slate-950">
        <div
          className="grid items-end gap-3"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {items.map((item) => {
            const heightPercent = (item.value / maxValue) * 100;

            return (
              <div key={item.label} className="min-w-0">
                <div className="mb-3 text-center text-xs font-medium text-slate-500 dark:text-slate-300">
                  {item.value} min
                </div>

                <div className="flex h-[210px] items-end justify-center">
                  <div
                    className="w-full max-w-[50px] rounded-t-xl transition-all duration-500"
                    style={{
                      height: `${Math.max(heightPercent, item.value > 0 ? 8 : 0)}%`,
                      backgroundColor: item.color ?? '#6366f1',
                    }}
                  />
                </div>

                <div className="mt-3 truncate text-center text-sm font-medium text-slate-700 dark:text-slate-200">
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