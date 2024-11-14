export default function StatusCard({ label, value }) {
    return (
      <div className="flex flex-col items-center text-white">
      <div className="flex flex-col items-center p-4 bg-gray-900 justify-center rounded-full text-white w-20 h-20">
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <span className="text-lg font-bold">{label}</span>
      </div>
    );
  }