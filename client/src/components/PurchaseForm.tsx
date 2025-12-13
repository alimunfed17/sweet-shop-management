import { useForm } from 'react-hook-form';
import { Sweet, PurchaseData } from '@/types';
import { formatPrice } from '@/lib/utils';
import Input from './ui/Input';
import Button from './ui/Button';
import { ShoppingCart } from 'lucide-react';

interface PurchaseFormProps {
  sweet: Sweet;
  onSubmit: (data: PurchaseData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function PurchaseForm({ sweet, onSubmit, onCancel, isLoading }: PurchaseFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PurchaseData>({
    defaultValues: { quantity: 1 },
  });

  const quantity = watch('quantity');
  const total = (quantity || 0) * sweet.price;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">{sweet.name}</h3>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Price per item:</span>
          <span className="font-medium">{formatPrice(sweet.price)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>Available:</span>
          <span className="font-medium">{sweet.quantity} items</span>
        </div>
      </div>

      <Input
        label="Quantity"
        type="number"
        {...register('quantity', {
          required: 'Quantity is required',
          min: { value: 1, message: 'Minimum quantity is 1' },
          max: { value: sweet.quantity, message: `Maximum available is ${sweet.quantity}` },
        })}
        error={errors.quantity?.message}
        placeholder="1"
      />

      <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Confirm Purchase
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}