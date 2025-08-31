
import UploadForm from '../components/UploadForm';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-lg w-full">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
            Simple VQA System
          </h1>
          <UploadForm />
        </div>
      </div>
      <ThemeToggle />
    </>
  );
}
