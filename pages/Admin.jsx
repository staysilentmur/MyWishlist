import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GiftForm from '@/components/gifts/GiftForm';
import GiftCard from '@/components/gifts/GiftCard';
import EmptyState from '@/components/gifts/EmptyState';
import { Gift, Plus, Loader2 } from 'lucide-react';
import storageService from '../src/services/storageService.js';

// Inline Button component to bypass import issues
const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";
  
  const variants = {
    default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
    outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };
  
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export default function Admin() {
  const [gifts, setGifts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGift, setEditingGift] = useState(null);
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

  const handleSaveGift = async (giftData) => {
    setIsLoading(true);
    
    if (editingGift) {
      // Редактирование существующего подарка
      const updatedGifts = gifts.map(g => 
        g.id === editingGift.id ? { ...giftData, id: g.id } : g
      );
      await saveGifts(updatedGifts);
    } else {
      // Добавление нового подарка
      const newGift = {
        ...giftData,
        id: Date.now().toString(),
        is_reserved: false,
      };
      await saveGifts([...gifts, newGift]);
    }
    
    setIsFormOpen(false);
    setEditingGift(null);
    setIsLoading(false);
  };

  const handleEditGift = (gift) => {
    setEditingGift(gift);
    setIsFormOpen(true);
  };

  const handleDeleteGift = async (giftId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот подарок?')) {
      await saveGifts(gifts.filter(g => g.id !== giftId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50/30 to-blue-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                Управление списком желаний
              </h1>
              <p className="text-slate-600">
                Добавляйте и редактируйте подарки для вашего списка желаний
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingGift(null);
                setIsFormOpen(true);
              }}
              className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white border-0 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить подарок
            </Button>
          </div>
        </motion.div>

        {/* Gifts Grid */}
        {gifts.length === 0 ? (
          <EmptyState isAdmin={true} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gifts.map((gift, index) => (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative group">
                  <GiftCard 
                    gift={gift} 
                    onReserve={() => handleEditGift(gift)}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditGift(gift)}
                        className="bg-white/90 backdrop-blur-sm"
                      >
                        Редактировать
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteGift(gift.id)}
                        className="bg-red-500/90 backdrop-blur-sm text-white"
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Gift Form Modal */}
        <GiftForm
          gift={editingGift}
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingGift(null);
          }}
          onSave={handleSaveGift}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

