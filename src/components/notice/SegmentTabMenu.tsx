type SegmentTabMenuProps<T extends string> = {
  tabs: T[]
  activeTab: T
  onChange: (tab: T) => void
}

export default function SegmentTabMenu<T extends string>({
  tabs,
  activeTab,
  onChange,
}: SegmentTabMenuProps<T>) {
  return (
    <div className="relative flex h-[40px] w-full items-center rounded-[20px] border border-[#e0e0e0] bg-white px-1">
      <div
        className="absolute h-[32px] rounded-[20px] bg-[#e31e2d] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all duration-300"
        style={{
          width: `calc(${100 / tabs.length}% - 8px)`,
          left: `calc(${(tabs.indexOf(activeTab) / tabs.length) * 100}% + 4px)`,
        }}
      />
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className="relative z-10 flex h-full flex-1 items-center justify-center text-[14px] font-bold transition-colors duration-300"
          style={{ color: activeTab === tab ? '#ffffff' : '#a0a0a0' }}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
