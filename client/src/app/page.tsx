"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Sweet, CreateSweetData, SearchFilters, PurchaseData } from '@/types';
import { getErrorMessage } from '@/lib/utils';
import SweetCard from '@/components/SweetCard';
import SearchFilter from '@/components/SearchFilter';
import Modal from '@/components/ui/Modal';
import SweetForm from '@/components/SweetForm';
import PurchaseForm from '@/components/PurchaseForm';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Plus, Loader2, Package } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuthStore();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchActive, setSearchActive] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      setIsLoading(true);
      const data = await api.getSweets();
      setSweets(data);
      setSearchActive(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (filters: SearchFilters) => {
    try {
      setIsLoading(true);
      const data = await api.searchSweets(filters);
      setSweets(data);
      setSearchActive(true);
      toast.success(`Found ${data.length} sweet${data.length !== 1 ? 's' : ''}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSweet = async (data: CreateSweetData) => {
    setIsSubmitting(true);
    try {
      await api.createSweet(data);
      toast.success('Sweet created successfully!');
      setIsCreateModalOpen(false);
      fetchSweets();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSweet = async (data: CreateSweetData) => {
    if (!selectedSweet) return;
    setIsSubmitting(true);
    try {
      await api.updateSweet(selectedSweet.id, data);
      toast.success('Sweet updated successfully!');
      setIsEditModalOpen(false);
      setSelectedSweet(null);
      fetchSweets();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePurchase = async (data: PurchaseData) => {
    if (!selectedSweet) return;
    setIsSubmitting(true);
    try {
      await api.purchaseSweet(selectedSweet.id, data);
      toast.success('Purchase successful!');
      setIsPurchaseModalOpen(false);
      setSelectedSweet(null);
      fetchSweets();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestock = async () => {
    if (!selectedSweet) return;
    const quantity = (document.getElementById('restock-quantity') as HTMLInputElement)?.value;
    if (!quantity || parseInt(quantity) <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.restockSweet(selectedSweet.id, { quantity: parseInt(quantity) });
      toast.success('Sweet restocked successfully!');
      setIsRestockModalOpen(false);
      setSelectedSweet(null);
      fetchSweets();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSweet) return;
    setIsSubmitting(true);
    try {
      await api.deleteSweet(selectedSweet.id);
      toast.success('Sweet deleted successfully!');
      setIsDeleteModalOpen(false);
      setSelectedSweet(null);
      fetchSweets();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {user?.is_admin ? 'Manage Sweets' : 'Sweet Collection'}
              </h1>
              <p className="text-gray-600">
                {user?.is_admin
                  ? 'Add, edit, and manage your sweet inventory'
                  : 'Browse and purchase your favorite sweets'}
              </p>
            </div>
            {user?.is_admin && (
              <Button onClick={() => setIsCreateModalOpen(true)} size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Add Sweet
              </Button>
            )}
          </div>

          <SearchFilter onSearch={handleSearch} onReset={fetchSweets} />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchActive ? 'No sweets found' : 'No sweets available'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchActive
                ? 'Try adjusting your search filters'
                : user?.is_admin
                ? 'Start by adding your first sweet'
                : 'Check back soon for new sweets'}
            </p>
            {searchActive && (
              <Button onClick={fetchSweets}>View All Sweets</Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sweets.map((sweet) => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                onPurchase={(s) => {
                  setSelectedSweet(s);
                  setIsPurchaseModalOpen(true);
                }}
                onEdit={
                  user?.is_admin
                    ? (s) => {
                        setSelectedSweet(s);
                        setIsEditModalOpen(true);
                      }
                    : undefined
                }
                onDelete={
                  user?.is_admin
                    ? (s) => {
                        setSelectedSweet(s);
                        setIsDeleteModalOpen(true);
                      }
                    : undefined
                }
                onRestock={
                  user?.is_admin
                    ? (s) => {
                        setSelectedSweet(s);
                        setIsRestockModalOpen(true);
                      }
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Sweet"
        size="md"
      >
        <SweetForm
          onSubmit={handleCreateSweet}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSweet(null);
        }}
        title="Edit Sweet"
        size="md"
      >
        {selectedSweet && (
          <SweetForm
            sweet={selectedSweet}
            onSubmit={handleUpdateSweet}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedSweet(null);
            }}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      <Modal
        isOpen={isPurchaseModalOpen}
        onClose={() => {
          setIsPurchaseModalOpen(false);
          setSelectedSweet(null);
        }}
        title="Purchase Sweet"
        size="sm"
      >
        {selectedSweet && (
          <PurchaseForm
            sweet={selectedSweet}
            onSubmit={handlePurchase}
            onCancel={() => {
              setIsPurchaseModalOpen(false);
              setSelectedSweet(null);
            }}
            isLoading={isSubmitting}
          />
        )}
      </Modal>

      <Modal
        isOpen={isRestockModalOpen}
        onClose={() => {
          setIsRestockModalOpen(false);
          setSelectedSweet(null);
        }}
        title="Restock Sweet"
        size="sm"
      >
        {selectedSweet && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{selectedSweet.name}</h3>
              <p className="text-sm text-gray-600">
                Current stock: <span className="font-medium">{selectedSweet.quantity}</span>
              </p>
            </div>
            <Input
              id="restock-quantity"
              label="Quantity to Add"
              type="number"
              defaultValue={50}
              min={1}
            />
            <div className="flex gap-3">
              <Button onClick={handleRestock} isLoading={isSubmitting} className="flex-1">
                <Package className="w-4 h-4 mr-2" />
                Restock
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsRestockModalOpen(false);
                  setSelectedSweet(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSweet(null);
        }}
        title="Delete Sweet"
        size="sm"
      >
        {selectedSweet && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete <strong>{selectedSweet.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="danger" onClick={handleDelete} isLoading={isSubmitting} className="flex-1">
                Delete
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedSweet(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}