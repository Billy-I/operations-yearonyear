import { ShoppingCart, TrendingUp, Package, Clock } from 'lucide-react';

export default function Marketplace() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
        <p className="text-gray-600">
          Connect with suppliers, buy inputs, and sell your produce
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Market Trends</p>
              <p className="text-2xl font-bold text-green-600">+2.3%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saved Products</p>
              <p className="text-2xl font-bold text-gray-900">38</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Delivery</p>
              <p className="text-2xl font-bold text-orange-600">5</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Seeds & Planting</h3>
          <p className="text-gray-600 mb-4">High-quality seeds for all crop types</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600 font-medium">Browse Products</span>
            <span className="text-xs text-gray-500">245 items</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Fertilizers</h3>
          <p className="text-gray-600 mb-4">Organic and synthetic fertilizers</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600 font-medium">Browse Products</span>
            <span className="text-xs text-gray-500">128 items</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Equipment</h3>
          <p className="text-gray-600 mb-4">Machinery and farm equipment</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600 font-medium">Browse Products</span>
            <span className="text-xs text-gray-500">89 items</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Crop Protection</h3>
          <p className="text-gray-600 mb-4">Pesticides and protective solutions</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600 font-medium">Browse Products</span>
            <span className="text-xs text-gray-500">156 items</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sell Your Produce</h3>
          <p className="text-gray-600 mb-4">Connect with buyers for your crops</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600 font-medium">List Products</span>
            <span className="text-xs text-gray-500">Market Ready</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Services</h3>
          <p className="text-gray-600 mb-4">Professional farming services</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600 font-medium">Find Services</span>
            <span className="text-xs text-gray-500">67 providers</span>
          </div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="mt-12 bg-blue-50 rounded-xl p-8 border border-blue-200">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketplace Coming Soon</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're building a comprehensive marketplace to connect farmers with suppliers and buyers. 
            This feature will include real-time pricing, secure transactions, and delivery tracking.
          </p>
        </div>
      </div>
    </div>
  );
}
