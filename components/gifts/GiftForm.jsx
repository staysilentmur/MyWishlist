import React, { useState, useEffect } from 'react';
import { Gift, Loader2, Star } from 'lucide-react';

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

// Inline Dialog components
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/80" onClick={() => onOpenChange(false)} />
      {children}
    </div>
  );
};

const DialogContent = ({ className, children, ...props }) => {
  return (
    <div
      className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg max-h-[90vh] overflow-y-auto ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const DialogHeader = ({ className, children, ...props }) => {
  return (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props}>
      {children}
    </div>
  );
};

const DialogTitle = ({ className, children, ...props }) => {
  return (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
};

// Inline Input component
const Input = ({ className, ...props }) => {
  return (
    <input
      className={`flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

// Inline Label component
const Label = ({ className, children, ...props }) => {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};

// Inline Textarea component
const Textarea = ({ className, ...props }) => {
  return (
    <textarea
      className={`flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none ${className}`}
      {...props}
    />
  );
};

// Inline Select components
const Select = ({ value, onValueChange, children, ...props }) => {
  const handleSelect = (selectedValue) => {
    onValueChange(selectedValue);
  };

  return (
    <div className="relative" {...props}>
      {React.Children.map(children, child => 
        React.isValidElement(child) 
          ? React.cloneElement(child, { onSelect: handleSelect })
          : child
      )}
    </div>
  );
};

const SelectTrigger = ({ className, children, ...props }) => {
  return (
    <button
      className={`flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const SelectValue = ({ placeholder, ...props }) => {
  return (
    <span {...props}>
      {placeholder}
    </span>
  );
};

const SelectContent = ({ className, children, onSelect, ...props }) => {
  return (
    <div
      className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${className}`}
      {...props}
    >
      {React.Children.map(children, child => 
        React.isValidElement(child) 
          ? React.cloneElement(child, { onSelect })
          : child
      )}
    </div>
  );
};

const SelectItem = ({ className, children, value, onSelect, ...props }) => {
  return (
    <div
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
      onClick={() => onSelect && onSelect(value)}
      {...props}
    >
      {children}
    </div>
  );
};

const initialFormData = {
  name: '',
  description: '',
  price: '',
  image_url: '',
  link: '',
  priority: 'medium'
};

export default function GiftForm({ gift, isOpen, onClose, onSave, isLoading }) {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (gift) {
      setFormData({
        name: gift.name || '',
        description: gift.description || '',
        price: gift.price || '',
        image_url: gift.image_url || '',
        link: gift.link || '',
        priority: gift.priority || 'medium'
      });
    } else {
      setFormData(initialFormData);
    }
  }, [gift, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: formData.price ? parseFloat(formData.price) : null
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-blue-100 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-pink-500" />
            </div>
            <DialogTitle className="text-xl font-semibold text-slate-800">
              {gift ? 'Редактировать подарок' : 'Добавить подарок'}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название подарка *</Label>
            <Input
              id="name"
              placeholder="Например, Беспроводные наушники"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="border-slate-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              placeholder="Добавьте детали о подарке..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="border-slate-200 resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Цена (₽)</Label>
              <Input
                id="price"
                type="number"
                placeholder="0"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="border-slate-200"
                min="0"
                step="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Приоритет</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleChange('priority', value)}
              >
                <SelectTrigger className="border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-pink-500 fill-pink-500" />
                      Очень хочу
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-blue-400 fill-blue-400" />
                      Буду рада
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-slate-400" />
                      Было бы приятно
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Ссылка на изображение</Label>
            <Input
              id="image_url"
              placeholder="https://..."
              value={formData.image_url}
              onChange={(e) => handleChange('image_url', e.target.value)}
              className="border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Ссылка на товар</Label>
            <Input
              id="link"
              placeholder="https://..."
              value={formData.link}
              onChange={(e) => handleChange('link', e.target.value)}
              className="border-slate-200"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1 border-slate-200"
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button 
              type="submit"
              disabled={!formData.name.trim() || isLoading}
              className="flex-1 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white border-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                gift ? 'Сохранить' : 'Добавить'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}