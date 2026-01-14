import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GiftCard from '@/components/gifts/GiftCard';
import ReservationModal from '@/components/gifts/ReservationModal';
import EmptyState from '@/components/gifts/EmptyState';
import { Heart, Sparkles } from 'lucide-react';
import storageService from '../src/services/storageService.js';

export default function Wishlist() {
  const [gifts, setGifts] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Загрузка подарков из удаленного хранилища
  useEffect(() => {
    const loadGifts = async () => {
      setIsLoading(true);
      try {
        const gifts = await storageService.fetchGifts();
        setGifts(gifts);
      } catch (error) {
        console.error('Error loading gifts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGifts();
  }, []);

  // Сохранение подарков в удаленное хранилище
  const saveGifts = async (newGifts) => {
    setIsLoading(true);
    try {
      const success = await storageService.saveGifts(newGifts);
      if (success) {
        setGifts(newGifts);
      } else {
        // Если удаленное сохранение не удалось, хотя бы обновляем локально
        setGifts(newGifts);
      }
    } catch (error) {
      console.error('Error saving gifts:', error);
      setGifts(newGifts);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReserve = (gift) => {
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  const handleConfirmReservation = async (gift, name) => {
    setIsLoading(true);
    
    const updatedGifts = gifts.map(g =>
      g.id === gift.id
        ? {
            ...g,
            is_reserved: true,
            reserved_by: name,
            reserved_at: new Date().toISOString(),
          }
        : g
    );
    
    await saveGifts(updatedGifts);
    setIsModalOpen(false);
    setSelectedGift(null);
    setIsLoading(false);
  };

  const availableGifts = gifts.filter(g => !g.is_reserved);
  const reservedGifts = gifts.filter(g => g.is_reserved);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50/30 to-blue-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-pink-200 to-blue-200 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-10 h-10 text-pink-500" />
            </div>
          </motion.div>
          <h1 className="text-5xl font-bold text-slate-800 mb-3">
            Список желаний
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Выберите подарок, который хотите подарить. Забронируйте его, чтобы другие гости знали, что он уже выбран.
          </p>
        </motion.div>

        {/* Available Gifts */}
        {availableGifts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-pink-500" />
              <h2 className="text-2xl font-semibold text-slate-700">
                Доступные подарки ({availableGifts.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {availableGifts.map((gift, index) => (
                <motion.div
                  key={gift.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GiftCard gift={gift} onReserve={handleReserve} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Reserved Gifts */}
        {reservedGifts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <Heart className="w-5 h-5 text-blue-500" />
              <h2 className="text-2xl font-semibold text-slate-700">
                Забронированные подарки ({reservedGifts.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {reservedGifts.map((gift, index) => (
                <motion.div
                  key={gift.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GiftCard gift={gift} onReserve={() => {}} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {gifts.length === 0 && <EmptyState isAdmin={false} />}

        {/* Reservation Modal */}
        <ReservationModal
          gift={selectedGift}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedGift(null);
          }}
          onConfirm={handleConfirmReservation}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

