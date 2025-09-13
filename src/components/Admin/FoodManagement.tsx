import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, getFoods, addFood, updateFood, deleteFood, uploadImage } from '../../services/firestore';
import type { Food } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Modal from '../ui/Modal';
import LoadingSpinner from '../LoadingSpinner';

const FoodManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string>('');
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

    try {
      let imageUrl = editingFood?.imageUrl || '';

      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      const foodData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price,
        categoryId: formData.categoryId,
        imageUrl,
      };

      if (editingFood) {
        updateMutation.mutate({ id: editingFood.id, data: foodData });
      } else {
        addMutation.mutate(foodData);
      }
    } catch (err) {
      setError('خطا در آپلود تصویر');
    }
  };

  const handleEdit = (food: Food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price.toString(),
      categoryId: food.categoryId,
      image: null,
    });
    setImagePreview(food.imageUrl);
    setIsModalOpen(true);
    setError('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('آیا از حذف این غذا اطمینان دارید؟')) {
      deleteMutation.mutate(id);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFood(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      categoryId: '',
      image: null,
    });
    setImagePreview('');
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          مدیریت غذاها
        </h2>
        <Button onClick={() => setIsModalOpen(true)}>
          اضافه کردن غذا
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg">
        {foods.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">هیچ غذایی وجود ندارد</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تصویر
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نام
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    دسته‌بندی
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    قیمت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {foods.map((food) => (
                  <tr key={food.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={food.imageUrl}
                        alt={food.name}
                        className="h-12 w-12 rounded-lg object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/48x48?text=تصویر';
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{food.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{food.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCategoryName(food.categoryId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Intl.NumberFormat('fa-IR', {
                        style: 'currency',
                        currency: 'IRR',
                        minimumFractionDigits: 0,
                      }).format(food.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 space-x-reverse">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(food)}
                      >
                        ویرایش
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(food.id)}
                        loading={deleteMutation.isPending}
                      >
                        حذف
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تصویر غذا
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="پیش‌نمایش"
                  className="h-32 w-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

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
