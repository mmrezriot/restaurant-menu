import React from 'react';
import type { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8 justify-center">
      <button
        onClick={() => onCategorySelect(null)}
        className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
          selectedCategory === null
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-large'
            : 'bg-white text-gray-600 hover:text-primary-600 hover:bg-primary-50 shadow-soft hover:shadow-medium border border-gray-200'
        }`}
      >
        🍽️ همه
      </button>
      {categories.map((category, index) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 animate-fade-in ${
            selectedCategory === category.id
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-large'
              : 'bg-white text-gray-600 hover:text-primary-600 hover:bg-primary-50 shadow-soft hover:shadow-medium border border-gray-200'
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
