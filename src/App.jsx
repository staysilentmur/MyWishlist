import React, { useState, useEffect } from 'react';
import Admin from '../pages/Admin';
import Wishlist from '../pages/Wishlist';
import FloatingHearts from '../components/FloatingHearts';
import AdminPasswordModal from '../components/AdminPasswordModal';

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

function App() {
  const [isAdmin, setIsAdmin] = useState(() => {
    // Проверяем localStorage при загрузке
    return localStorage.getItem('wishlist-admin-mode') === 'true';
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    // Сохраняем режим в localStorage
    localStorage.setItem('wishlist-admin-mode', isAdmin.toString());
  }, [isAdmin]);

  const handleAdminClick = () => {
    if (isAdmin) {
      // Выход из админ режима без пароля
      setIsAdmin(false);
    } else {
      // Показываем модальное окно для ввода пароля
      setShowPasswordModal(true);
    }
  };

  const handlePasswordConfirm = () => {
    setIsAdmin(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 relative">
      {/* Плавающие сердечки */}
      <FloatingHearts />
      
      {/* Переключатель режимов */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={handleAdminClick}
          variant="outline"
          className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
        >
          {isAdmin ? '👁️ Просмотр' : '⚙️ Админ'}
        </Button>
      </div>
      
      {/* Модальное окно для пароля */}
      <AdminPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onConfirm={handlePasswordConfirm}
      />
      
      {/* Контент */}
      <div className="relative z-10">
        {isAdmin ? <Admin /> : <Wishlist />}
      </div>
    </div>
  );
}

export default App;

