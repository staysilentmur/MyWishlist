import React from 'react';
import { Gift, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmptyState({ isAdmin }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-4"
    >
      <div className="relative inline-block mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-blue-100 rounded-full flex items-center justify-center">
          <Gift className="w-12 h-12 text-pink-400" />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-2 -right-2"
        >
          <Sparkles className="w-8 h-8 text-blue-400" />
        </motion.div>
      </div>
      
      <h3 className="text-xl font-semibold text-slate-700 mb-2">
        {isAdmin ? "Подарки еще не добавлены" : "Список желаний пуст"}
      </h3>
      <p className="text-slate-500 max-w-sm mx-auto">
        {isAdmin 
          ? "Начните добавлять подарки в свой список желаний. Гости смогут их забронировать!"
          : "Загляните позже! Именинница еще готовит список желаний."
        }
      </p>
    </motion.div>
  );
}