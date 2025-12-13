import { useForm } from 'react-hook-form';
import { SearchFilters } from '@/types';
import { Search, X } from 'lucide-react';
import Input from './ui/Input';
import Button from './ui/Button';

interface SearchFilterProps {
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
}

export default function SearchFilter({ onSearch, onReset }: SearchFilterProps) {
  const { register, handleSubmit, reset } = useForm<SearchFilters>();

  const handleReset = () => {
    reset();
    onReset();
  };

  return (
    <form onSubmit={handleSubmit(onSearch)} className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-primary-600" />
        <h2 className="text-lg font-semibold text-gray-900">Search & Filter</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          label="Sweet Name"
          placeholder="Search by name..."
          {...register('name')}
        />

        <div>
          <label 
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            {...register('category')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            <option value="Chocolate">Chocolate</option>
            <option value="Gummy">Gummy</option>
            <option value="Candy">Candy</option>
            <option value="Lollipop">Lollipop</option>
            <option value="Cookies">Cookies</option>
            <option value="Cake">Cake</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <Input
          label="Min Price"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('min_price', { valueAsNumber: true })}
        />

        <Input
          label="Max Price"
          type="number"
          step="0.01"
          placeholder="100.00"
          {...register('max_price', { valueAsNumber: true })}
        />
      </div>

      <div className="flex gap-3 mt-4">
        <Button type="submit" className="flex-1">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
        <Button type="button" variant="ghost" onClick={handleReset}>
          <X className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>
    </form>
  );
}
