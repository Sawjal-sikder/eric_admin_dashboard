import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import { API_BASE_URL } from '../services/auth';
import { 
  Users, 
  Package, 
  Folder, 
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState({
    total_users: 0,
    total_active_users: 0,
    recent_users: [],
    total_subscriptions: 0,
    total_pending_subscriptions: 0,
    total_trial_subscriptions: 0,
    total_active_subscriptions: 0,
    total_subscription_plans: 0,
    recent_subscriptions_data: []
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/dashboard/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      // console.log('Fetched dashboard data:', result);
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchData();
  }, []);


  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome to admin dashboard
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="relative overflow-hidden">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : data.total_users || 0}</p>
              </div>
              {/* <div className="flex items-center">
                <span className="inline-flex items-center text-sm font-medium text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {loading ? '...' : data.total_active_users || 0} active
                </span>
              </div> */}
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Subscription Plans</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : data.total_subscription_plans || 0}</p>
              </div>
              {/* <div className="flex items-center">
                <span className="inline-flex items-center text-sm font-medium text-gray-600">
                  <Package className="w-4 h-4 mr-1" />
                  Plans
                </span>
              </div> */}
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : data.total_subscriptions || 0}</p>
              </div>
              {/* <div className="flex items-center">
                <span className="inline-flex items-center text-sm font-medium text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {loading ? '...' : data.total_active_subscriptions || 0} active
                </span>
              </div> */}
            </div>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Folder className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : data.total_active_subscriptions || 0}</p>
              </div>
              {/* <div className="flex items-center">
                <span className="inline-flex items-center text-sm font-medium text-blue-600">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Trial
                </span>
              </div> */}
            </div>
          </Card>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title>Recent Users</Card.Title>
                <button
                  className="text-primary-600 hover:text-primary-500 text-sm font-medium flex items-center"
                  onClick={() => window.location.href = '/users'}
                  type="button"
                >
                  View all
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : data.recent_users && data.recent_users.length > 0 ? (
                  data.recent_users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.full_name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-xs text-gray-400">{user.phone_number}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">No recent users found</div>
                )}
              </div>
            </Card.Content>
          </Card>
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <Card.Title>Recent Subscriptions</Card.Title>
                <button
                  className="text-primary-600 hover:text-primary-500 text-sm font-medium flex items-center"
                  onClick={() => window.location.href = '/subscription_list'}
                  type="button"
                >
                  View all
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : data.recent_subscriptions_data && data.recent_subscriptions_data.length > 0 ? (
                  data.recent_subscriptions_data.map((subscription) => (
                    <div key={subscription.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{subscription.user}</p>
                          <p className="text-sm text-gray-500">{subscription.plan}</p>
                          <p className="text-xs text-gray-400">
                            Auto-renew: {subscription.auto_renew ? 'Yes' : 'No'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">
                          {new Date(subscription.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          subscription.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : subscription.status === 'trialing'
                            ? 'bg-blue-100 text-blue-800'
                            : subscription.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">No recent subscriptions found</div>
                )}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;