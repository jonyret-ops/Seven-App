import React from 'react';
import { 
  House, 
  ClipboardCheck, 
  Utensils, 
  ChartNoAxesColumnIncreasing, 
  Ellipsis 
} from 'lucide-react';

export type TabType = 'home' | 'quests' | 'nutrition' | 'progress' | 'more' | 'achievements';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  uncompletedQuestsCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  uncompletedQuestsCount = 0,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: House },
    {
      id: 'quests' as TabType,
      label: 'Quests',
      icon: ClipboardCheck,
      badge: uncompletedQuestsCount > 0 ? uncompletedQuestsCount : undefined,
    },
    { id: 'nutrition' as TabType, label: 'Nutrition', icon: Utensils },
    { id: 'progress' as TabType, label: 'Progress', icon: ChartNoAxesColumnIncreasing },
    { id: 'more' as TabType, label: 'More', icon: Ellipsis },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EEEDE9] max-w-md md:max-w-xl mx-auto"
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      <div className="flex items-center justify-around px-1 h-[49px]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 px-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#12324A] font-bold'
                  : 'text-[#68727D] hover:text-[#12324A] font-medium'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-all ${
                    isActive ? 'scale-105 stroke-[2.2] text-[#12324A]' : 'stroke-[1.75] text-[#68727D]'
                  }`}
                />
                {tab.badge !== undefined && !isActive && (
                  <span className="absolute -top-1 -right-2.5 px-1.5 py-0.2 rounded-full bg-[#4A90C2] text-white text-[9px] font-black leading-tight shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight leading-none ${isActive ? 'text-[#12324A] font-bold' : 'text-[#68727D]'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
