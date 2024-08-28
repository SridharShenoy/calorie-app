import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
            <h1 className="text-9xl font-bold text-red-600">404</h1>
            <p className="text-2xl text-gray-700 mt-4">
                Oops! The page you are looking for does not exist.
            </p>
            <button
                onClick={handleGoHome}
                className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
                Go Back to Home
            </button>
        </div>
    );
};

export default NotFoundPage;