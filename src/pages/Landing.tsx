import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getFoods, getFoodsByCategory } from '../services/firestore';
import FoodCard from '../components/FoodCard';
import CategoryFilter from '../components/CategoryFilter';
import LoadingSpinner from '../components/LoadingSpinner';

const Landing: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: allFoods = [], isLoading: foodsLoading } = useQuery({
    queryKey: ['foods'],
    queryFn: getFoods,
  });

  const { data: categoryFoods = [], isLoading: categoryFoodsLoading } = useQuery({
    queryKey: ['foods', selectedCategory],
    queryFn: () => selectedCategory ? getFoodsByCategory(selectedCategory) : Promise.resolve([]),
    enabled: !!selectedCategory,
  });

  const foods = selectedCategory ? categoryFoods : allFoods;
  const isLoading = selectedCategory ? categoryFoodsLoading : foodsLoading;

  if (categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            منوی رستوران
          </h1>
          <p className="text-gray-600 text-center mt-2">
            بهترین غذاهای ایرانی و بین‌المللی
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {/* Foods Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : foods.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              هیچ غذایی در این دسته‌بندی یافت نشد
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">
            © ۱۴۰۳ منوی رستوران. تمامی حقوق محفوظ است.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
