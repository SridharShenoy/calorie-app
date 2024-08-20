import React, { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface FoodItem {
  description: string;
  foodCategory: string;
  brandName: string;
  servingSize: number;
  servingSizeUnit: string;
  foodNutrients: Array<{
    nutrientId: number;
    nutrientName: string;
    unitName: string;
    value: number;
  }>;
}

const USDAFoodSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<FoodItem[]>([]);

  const handleSearch = (query) => {
    fetch(`${API_BASE_URL}/api/search-foods/${query}`, {method: 'GET', credentials:'include'})
      .then(response => response.json())
      .then(data => {
        setResults(data);
      })
      .catch(error => {
        console.error('Error fetching USDA foods:', error);
      });
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Search USDA Foods</h1>
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Search for a food item..."
        />
        <button
          onClick={() => {handleSearch(query)}}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>
      <div className="h-96 overflow-y-scroll border rounded-lg p-4 bg-gray-100">
        {results.length === 0 ? (
          <p className="text-center text-gray-500">No results found.</p>
        ) : (
          results.map((food, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold">{food.description}</h3>
              <p>{food.foodCategory}</p>
              {food.brandName && (
                <p>Brand: {food.brandName}</p>
              )}
              <p>
                {`Serving size: ${food.servingSize ? food.servingSize : 100} ${food.servingSizeUnit || 'g'}`}
              </p>
              <p>
                {food.foodNutrients.map((nutrient) => (
                (nutrient.nutrientId === 1003 || nutrient.nutrientId === 1004 || 
                    nutrient.nutrientId === 1005 || nutrient.nutrientId === 1008) ? (
                     <span key={nutrient.nutrientId}>
                       <p>{food.servingSize ? `${nutrient.nutrientName}: ${(nutrient.value * food.servingSize / 100).toFixed(1)} ${nutrient.unitName}` : `${nutrient.nutrientName}: ${nutrient.value} ${nutrient.unitName}`}</p>
                     </span>
                   ) : null
                ))}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default USDAFoodSearch;