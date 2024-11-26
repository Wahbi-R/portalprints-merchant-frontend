import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function LogoCard({ logoURL, onImageUpload }) {
  const [previewURL, setPreviewURL] = useState(null); // For showing a preview of the selected image
  const [isUploading, setIsUploading] = useState(false);
  const [currentURL, setCurrentURL] = useState('/profile.png'); // Ensure consistent fallback

  useEffect(() => {
    // Update the current URL based on available data
    if (previewURL) {
      setCurrentURL(previewURL);
    } else if (logoURL) {
      setCurrentURL(logoURL);
    }
  }, [previewURL, logoURL]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewURL(URL.createObjectURL(file)); // Show a preview
    setIsUploading(true);

    try {
      await onImageUpload(file); // Call the parent-provided upload function
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 rounded-lg">
      <Image
        src={currentURL} // Use a single, consistent `src`
        alt="Profile Logo"
        className="rounded-2xl"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '80%', height: 'auto' }}
        priority // Optimize for loading
      />
      <label
        htmlFor="profile-upload"
        className={`bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 cursor-pointer ${
          isUploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isUploading ? 'Uploading...' : 'Change Picture'}
      </label>
      <input
        id="profile-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
}
