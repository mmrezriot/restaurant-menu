import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, getFoods, addFood, updateFood, deleteFood } from '../../services/firestore';
import type { Food } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Modal from '../ui/Modal';
import LoadingSpinner from '../LoadingSpinner';
import ImageUpload from './ImageUpload';

const FoodManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrl: ''
  });
  const [error, setError] = useState('');

  const queryClient = useQueryClient();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: foods = [], isLoading: foodsLoading } = useQuery({
    queryKey: ['foods'],
    queryFn: getFoods,
  });

  const addMutation = useMutation({
    mutationFn: async (foodData: Omit<Food, 'id'>) => {
      return addFood(foodData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      handleCloseModal();
    },
    onError: () => {
      setError('خطا در اضافه کردن غذا');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Omit<Food, 'id'>> }) => {
      return updateFood(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
      handleCloseModal();
    },
    onError: () => {
      setError('خطا در ویرایش غذا');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFood,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.description.trim() || !formData.price || !formData.categoryId) {
      setError('تمام فیلدها الزامی هستند');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setError('قیمت باید عدد مثبت باشد');
      return;
    }

    const foodData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price,
      categoryId: formData.categoryId,
      imageUrl: formData.imageUrl,
    };

    if (editingFood) {
      updateMutation.mutate({ id: editingFood.id, data: foodData });
    } else {
      addMutation.mutate(foodData);
    }
  };

  const handleEdit = (food: Food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price.toString(),
      categoryId: food.categoryId,
      imageUrl: food.imageUrl,
    });
    setIsModalOpen(true);
    setError('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('آیا از حذف این غذا اطمینان دارید؟')) {
      deleteMutation.mutate(id);
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    setFormData({ ...formData, imageUrl });
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFood(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      imageUrl: '',
    });
    setError('');
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'نامشخص';
  };

  if (categoriesLoading || foodsLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            مدیریت غذاها
          </h2>
          <p className="text-gray-600">
            غذاهای منو را مدیریت کنید
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-2xl shadow-large hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
        >
          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          اضافه کردن غذا
        </Button>
      </div>

      {/* Foods Grid */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-large border border-white/20 p-8">
        {foods.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              هیچ غذایی وجود ندارد
            </h3>
            <p className="text-gray-500 mb-6">
              اولین غذا را اضافه کنید
            </p>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-2xl"
            >
              اضافه کردن غذا
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foods.map((food, index) => (
              <div 
                key={food.id}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-100 hover:border-primary-200 group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Food Image */}
                <div className="relative mb-4">
                  <img
                    src={food.imageUrl || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center'}
                    alt={food.name}
                    className="w-full h-32 object-cover rounded-xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center';
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className="text-xs font-bold text-primary-600">
                      {new Intl.NumberFormat('fa-IR', {
                        style: 'currency',
                        currency: 'IRR',
                        minimumFractionDigits: 0,
                      }).format(food.price)}
                    </span>
                  </div>
                </div>

                {/* Food Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors duration-300 line-clamp-1">
                    {food.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                    {food.description}
                  </p>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                      {getCategoryName(food.categoryId)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(food)}
                    className="flex-1 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-300 transition-all duration-300"
                  >
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    ویرایش
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(food.id)}
                    loading={deleteMutation.isPending}
                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingFood ? 'ویرایش غذا' : 'اضافه کردن غذا'}
        className="sm:max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="نام غذا"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="نام غذا را وارد کنید"
              required
            />
            <Input
              label="قیمت (تومان)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="قیمت را وارد کنید"
              required
            />
          </div>

          <Textarea
            label="توضیحات"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="توضیحات غذا را وارد کنید"
            rows={3}
            required
          />

          <Select
            label="دسته‌بندی"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
            required
          />

          <ImageUpload
            onImageUploaded={handleImageUploaded}
            currentImageUrl={editingFood?.imageUrl}
            disabled={addMutation.isPending || updateMutation.isPending}
          />

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-2 space-x-reverse">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseModal}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              loading={addMutation.isPending || updateMutation.isPending}
            >
              {editingFood ? 'ویرایش' : 'اضافه کردن'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FoodManagement;
