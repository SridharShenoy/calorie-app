import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

interface ProgressPicturesProps {
  refreshKey: string | number;
}

const ProgressPictures: React.FC<ProgressPicturesProps> = ({ refreshKey }) => {
  const [images, setImages] = useState<string[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/my-images/progress-pictures`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        setImages(data.ProgressPictures);
      })
      .catch(error => {
        console.error('Error fetching progress pictures:', error);
      });
  }, [refreshKey]);

  const handleRemove = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    fetch(`${API_BASE_URL}/api/my-images/progress-pictures/${index}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete image');
        }
      })
      .catch(error => {
        console.error('Error deleting image:', error);
      });
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Your Progress Pictures</h1>
      <div className="h-96 overflow-y-scroll border rounded-lg p-4 bg-gray-100">
        {images.length === 0 ? (
          <p className="text-center text-gray-500">No progress pictures found.</p>
        ) : (
          images.map((url, index) => (
            <div
              key={index}
              className="relative mb-4 w-full rounded-md shadow-md"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={url}
                alt={`Progress Picture ${index + 1}`}
                className="w-full rounded-md"
              />
              {hoveredIndex === index && (
                <button
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 shadow-lg"
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProgressPictures;
