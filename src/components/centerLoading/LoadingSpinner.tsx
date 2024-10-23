// src/components/LoadingSpinner.js
export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-16 h-16 border-8 border-gray-200 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
