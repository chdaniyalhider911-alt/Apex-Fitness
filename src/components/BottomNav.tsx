import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Dumbbell, List, BarChart3, User } from 'lucide-react';

const tabs = [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { path: '/workout', label: 'Workout', icon: Dumbbell },
  { path: '/exercises', label: 'Exercises', icon: List },
  { path: '/analytics', label: 'Stats', icon: BarChart3 },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#111111]/90 backdrop-blur-xl border-t border-white/5">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 pb-safe">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className="relative flex flex-col items-center justify-center w-16 h-full"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#ff6600]"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <motion.div
                animate={{ y: isActive ? -2 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <tab.icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={isActive ? 'text-[#ff6600]' : 'text-[#888888]'}
                />
              </motion.div>
              <span
                className={`text-[10px] mt-0.5 font-medium ${
                  isActive ? 'text-[#ff6600]' : 'text-[#888888]'
                }`}
              >
                {tab.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
