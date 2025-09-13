import React from 'react';
import type { Food } from '../types';
import { formatPrice } from '../lib/utils';

interface FoodCardProps {
  food: Food;
}

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-soft overflow-hidden hover-lift hover:shadow-large transition-all duration-500 border border-gray-100">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={food.imageUrl}
          alt={food.name}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center';
          }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Price badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-medium">
          <span className="text-primary-600 font-bold text-sm">
            {formatPrice(food.price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
          {food.name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {food.description}
        </p>
        
        {/* Action button */}
        <div className="flex items-center justify-between">
          <button className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-medium hover:shadow-large transform hover:-translate-y-0.5">
            سفارش دهید
          </button>
          <div className="flex items-center space-x-1 space-x-reverse">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-gray-500 text-sm">4.8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
