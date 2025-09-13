import React from 'react';
import type { Food } from '../types';
import { formatPrice } from '../lib/utils';

interface FoodCardProps {
  food: Food;
}

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={food.imageUrl}
          alt={food.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x200?text=تصویر+غذا';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {food.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {food.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(food.price)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
