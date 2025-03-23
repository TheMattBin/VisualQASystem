import UploadForm from '../components/UploadForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Image Upload and Question Form
        </h1>
        <UploadForm />
      </div>
    </div>
  );
}
