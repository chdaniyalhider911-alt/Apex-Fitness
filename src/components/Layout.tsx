import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CyberGrid from './CyberGrid';
import BottomNav from './BottomNav';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-[#111111] overflow-hidden">
      {/* Background Grid */}
      <CyberGrid />

      {/* Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
