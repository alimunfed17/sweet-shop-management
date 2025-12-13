import { useState } from 'react';
import { Sweet } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Edit, Trash2, Package } from 'lucide-react';
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button"
import { useAuthStore } from '@/store/authStore';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (sweet: Sweet) => void;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (sweet: Sweet) => void;
  onRestock?: (sweet: Sweet) => void;
}

export default function SweetCard({ sweet, onPurchase, onEdit, onDelete, onRestock }: SweetCardProps) {
  const { user } = useAuthStore();
  const [imageError, setImageError] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Chocolate: 'bg-amber-100 text-amber-800',
      Gummy: 'bg-pink-100 text-pink-800',
      Candy: 'bg-red-100 text-red-800',
      Lollipop: 'bg-purple-100 text-purple-800',
      default: 'bg-blue-100 text-blue-800',
    };
    return colors[category] || colors.default;
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      Chocolate: '🍫',
      Gummy: '🐻',
      Candy: '🍬',
      Lollipop: '🍭',
      default: '🍰',
    };
    return emojis[category] || emojis.default;
  };

  return (
    <Card hover className="group">
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
          <span className="text-6xl">{getCategoryEmoji(sweet.category)}</span>
        </div>

        <div className="absolute top-2 right-2">
          {sweet.quantity === 0 ? (
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg">
              Out of Stock
            </span>
          ) : sweet.quantity < 10 ? (
            <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-lg">
              Low Stock
            </span>
          ) : (
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
              In Stock
            </span>
          )}
        </div>

        <div className="absolute bottom-2 left-2">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(sweet.category)}`}>
            {sweet.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {sweet.name}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-primary-600">
              {formatPrice(sweet.price)}
            </p>
            <p className="text-sm text-gray-500">
              {sweet.quantity} in stock
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {user?.is_admin ? (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onEdit?.(sweet)}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRestock?.(sweet)}
                className="flex-1"
              >
                <Package className="w-4 h-4 mr-1" />
                Restock
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete?.(sweet)}
                className="px-3"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              onClick={() => onPurchase(sweet)}
              disabled={sweet.quantity === 0}
              className="w-full"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {sweet.quantity === 0 ? 'Out of Stock' : 'Purchase'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}