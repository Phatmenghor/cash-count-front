const LoadingFullPage = ({ className = "" }) => {
    return (
      <div className={`flex items-center justify-center min-h-screen ${className}`}>
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              d="M12 2v2m0 16v2m10-10h-2M4 12H2m14.56-7.57L18.37 5.1M5.63 18.9l-1.41 1.41m14.84-1.41l1.41-1.41m-14.84-14.84L5.1 5.63"
            />
          </svg>
          <span className="text-lg text-gray-700 mt-4">
            Loading, please wait...
          </span>
        </div>
      </div>
    );
  };
  
  export default LoadingFullPage;
  