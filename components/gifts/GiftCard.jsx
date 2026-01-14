import React from 'react';
import { motion } from 'framer-motion';
import { Gift, ExternalLink, Check, Sparkles, Star } from 'lucide-react';

// Inline Button component
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

// Inline Card component
const Card = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    />
  );
});

Card.displayName = "Card";

// Inline Badge component
const Badge = ({ className, ...props }) => {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
      {...props}
    />
  );
};

const priorityConfig = {
  high: { label: 'Очень хочу', color: 'bg-gradient-to-r from-pink-300 to-rose-300 text-white' },
  medium: { label: 'Буду рада', color: 'bg-gradient-to-r from-blue-200 to-cyan-200 text-slate-700' },
  low: { label: 'Было бы приятно', color: 'bg-slate-100 text-slate-600' }
};

export default function GiftCard({ gift, onReserve }) {
  const isReserved = gift.is_reserved;
  const priority = priorityConfig[gift.priority] || priorityConfig.medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
    >
      <Card className={`overflow-hidden border-0 shadow-xl transition-all duration-500 ${
        isReserved ? 'opacity-75' : 'hover:shadow-2xl hover:border-pink-200 border-2 border-transparent'
      }`}>
        <div className="relative group">
          {gift.image_url ? (
            <div className="aspect-square overflow-hidden bg-gradient-to-br from-pink-50 to-blue-50 relative">
              <motion.img 
                src={gift.image_url} 
                alt={gift.name}
                className={`w-full h-full object-cover ${isReserved ? 'grayscale' : ''}`}
                whileHover={{ scale: 1.1, rotate: 1 }}
                transition={{ duration: 0.5 }}
              />
              {!isReserved && (
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </div>
          ) : (
            <div className="aspect-square bg-gradient-to-br from-pink-100 via-rose-50 to-blue-100 flex items-center justify-center group-hover:from-pink-200 group-hover:to-blue-200 transition-all duration-300">
              <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                <Gift className="w-16 h-16 text-pink-300" />
              </motion.div>
            </div>
          )}
          
          {/* Priority Badge */}
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="absolute top-3 left-3"
          >
            <Badge className={`${priority.color} border-0 shadow-lg backdrop-blur-sm hover:scale-110 transition-transform cursor-default`}>
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <Star className="w-3 h-3 mr-1" />
              </motion.div>
              {priority.label}
            </Badge>
          </motion.div>

          {/* Reserved Overlay */}
          {isReserved && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <Check className="w-10 h-10 text-emerald-500" />
              </div>
            </div>
          )}
        </div>

        <div className="p-5">
          <motion.h3 
            whileHover={{ scale: 1.02, x: 2 }}
            className="font-bold text-lg text-slate-800 mb-1 line-clamp-1 tracking-tight"
          >
            {gift.name}
          </motion.h3>
          
          {gift.description && (
            <p className="text-slate-500 text-sm mb-3 line-clamp-2">
              {gift.description}
            </p>
          )}

          {gift.price && (
            <p className="text-pink-500 font-semibold text-lg mb-4">
              {gift.price.toLocaleString()} ₽
            </p>
          )}

          <div className="space-y-2">
            {gift.link && (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline"
                  onClick={() => window.open(gift.link, '_blank')}
                  className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:shadow-md"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Посмотреть товар
                </Button>
              </motion.div>
            )}
            
            {isReserved ? (
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 text-blue-600 bg-blue-50 rounded-lg px-3 py-2 border-2 border-blue-100"
              >
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Забронирован</span>
              </motion.div>
            ) : (
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => onReserve(gift)}
                  className="w-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                  </motion.div>
                  Забронировать
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}