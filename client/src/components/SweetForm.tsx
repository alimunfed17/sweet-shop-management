import { useForm } from 'react-hook-form';
import { Sweet, CreateSweetData } from '@/types';
import Input from './ui/Input';
import Button from './ui/Button';

interface SweetFormProps {
  sweet?: Sweet;
  onSubmit: (data: CreateSweetData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function SweetForm({ sweet, onSubmit, onCancel, isLoading }: SweetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateSweetData>({
    defaultValues: sweet || {
      name: '',
      category: '',
      price: undefined,
      quantity: undefined,
    },
  });

  const categories = ['Chocolate', 'Gummy', 'Candy', 'Lollipop', 'Cookies', 'Cake', 'Other'];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Sweet Name *"
        {...register('name', { required: 'Name is required' })}
        error={errors.name?.message}
        placeholder="e.g., Dark Chocolate Bar"
      />

      <div>
        <label 
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category *
        </label>
        <select
          id="category"
          {...register('category', { required: 'Category is required' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <Input
        label="Price *"
        type="number"
        step="0.01"
        {...register('price', {
          required: 'Price is required',
          valueAsNumber: true,
          min: { value: 0.01, message: 'Price must be greater than 0' },
        })}
        error={errors.price?.message}
        placeholder="9.99"
      />

      <Input
        label="Quantity *"
        type="number"
        {...register('quantity', {
          required: 'Quantity is required',
          valueAsNumber: true,
          min: { value: 0, message: 'Quantity cannot be negative' },
        })}
        error={errors.quantity?.message}
        placeholder="100"
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" isLoading={isLoading || isSubmitting} className="flex-1">
          {sweet ? 'Update Sweet' : 'Create Sweet'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
