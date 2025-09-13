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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">در حال بارگذاری منو...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              <span className="gradient-text bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                منوی رستوران
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-slide-up">
              بهترین غذاهای ایرانی و بین‌المللی با طعمی بی‌نظیر
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2 space-x-reverse bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <span>⭐</span>
                <span>امتیاز 4.8</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <span>🚚</span>
                <span>ارسال رایگان</span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <span>⏰</span>
                <span>آماده در 30 دقیقه</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 fill-white">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <main className="bg-gradient-to-b from-white to-gray-50 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          {/* Category Filter */}
          <div className="mb-12">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </div>

          {/* Foods Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">در حال بارگذاری غذاها...</p>
              </div>
            </div>
          ) : foods.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-6xl">🍽️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                هیچ غذایی یافت نشد
              </h3>
              <p className="text-gray-600">
                در این دسته‌بندی هنوز غذایی اضافه نشده است
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {foods.map((food, index) => (
                <div 
                  key={food.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <FoodCard food={food} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 gradient-text bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                منوی رستوران
              </h3>
              <p className="text-gray-300 leading-relaxed">
                بهترین تجربه غذایی را با ما تجربه کنید. غذاهای تازه و خوشمزه با کیفیت بالا.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">تماس با ما</h4>
              <div className="space-y-2 text-gray-300">
                <p>📞 021-12345678</p>
                <p>📧 info@restaurant.com</p>
                <p>📍 تهران، خیابان ولیعصر</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">ساعات کاری</h4>
              <div className="space-y-2 text-gray-300">
                <p>شنبه تا پنج‌شنبه: 12:00 - 24:00</p>
                <p>جمعه: 18:00 - 24:00</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              © ۱۴۰۳ منوی رستوران. تمامی حقوق محفوظ است.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
