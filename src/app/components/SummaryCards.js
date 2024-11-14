import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

export default function SummaryCard({ title, value, icon: Icon, trend, description }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4 border border-gray-200">
      {/* Optional Icon */}
      {Icon && (
        <div className="bg-green-100 p-2 rounded-full">
          <Icon className="h-6 w-6 text-green-500" />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col">
        <span className="text-gray-500 text-sm">{title}</span>
        <span className="text-2xl font-semibold">{value}</span>

        {/* Optional Description and Trend */}
        {description && (
          <div className="flex items-center space-x-1 mt-1 text-sm text-gray-400">
            {trend === 'up' ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            ) : trend === 'down' ? (
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            ) : null}
            <span>{description}</span>
          </div>
        )}
      </div>
    </div>
  );
}
