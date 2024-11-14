import Image from 'next/image';

export default function IntegrationSuggestions() {
  const integrations = [
    { name: "", image: "/shopify_logo.svg" },
    { name: "", image: "/etsy_logo.svg" },
  ];

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 rounded-2xl">
      <div className="flex justify-center space-x-4 p-2">
        {integrations.map((integration, index) => (
          <div key={index} className="flex flex-col items-center">
            <Image src={integration.image} alt={integration.name} width={60} height={60} />
            <span className="text-xs text-white ">{integration.name}</span>
          </div>
        ))}
      </div>
      <button className="px-6 py-2 bg-white text-gray-900 rounded-full font-semibold">
        Suggest Our Next Integration
      </button>
    </div>
  );
}