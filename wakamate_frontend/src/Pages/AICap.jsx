import { Sparkles, Truck, Package, TrendingUp, CheckCircle } from 'lucide-react';

export default function AIDashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      {/* Top Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Hi Wura 👋</h1>
        <p className="text-sm text-gray-500">Welcome back! Here's your AI-powered dashboard summary.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card icon={<TrendingUp className="text-green-600" />} label="Total Sales" value="₦124,000" />
        <Card icon={<Package className="text-blue-500" />} label="Inventory Items" value="132" />
        <Card icon={<CheckCircle className="text-purple-500" />} label="Orders Delivered" value="98%" />
        <Card icon={<Truck className="text-orange-500" />} label="Low Stock" value="4 Items" />
      </div>

      {/* AI Assistant Panel */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-green-400 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-pink-600" />
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <AICard title="Delivery Route Suggestion" description="Let AI suggest the fastest delivery path based on current orders." />
          <AICard title="Inventory Summary" description="Ask the AI anything about your current inventory and get instant answers." />
          <AICard title="Profit Boost Tips" description="Smart suggestions to help increase your revenue." />
          <AICard title="AI-Generated Caption" description="Let AI write a caption for your next product post." />
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-xs text-gray-400 text-center">
        Built with ❤️ by Team Wakamate AI
      </p>
    </div>
  );
}

function Card({ icon, label, value }) {
  return (
    <div className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm border border-green-400 hover:shadow-md transition-all">
      <div className="bg-gray-100 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}

function AICard({ title, description }) {
  return (
    <div className="border border-green-400 rounded-xl p-4 hover:shadow-md transition cursor-pointer">
      <h3 className="font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
