import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import api, { API_BASE_URL } from '../../services/auth';
import { X } from 'lucide-react';

const EditData = ({ isOpen, onClose, data, onDataUpdate, useLocalUpdate = true }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

  // Update form data when data changes
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || '',
        description: data.description || '',
      });
    }
  }, [data]);
  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data) return;

    try {
      setLoading(true);
      setError(null);



      if (useLocalUpdate) {
        // Update local data without API call
        
        const updatedData = {
          id: data.id,
          name: formData.name || '',
          description: formData.description || '',
        };


        onDataUpdate(updatedData);
        onClose();
        return;
      }

      // API update logic (existing code)
      const requestBody = {
        name: formData.name || '',
        description: formData.description || '',
        // updated_at: new Date().toISOString()
      };

      const response = await api.patch(`/ai/trade/strategies/${data.id}/`, requestBody);
      
      // axios automatically parses JSON response
      const updatedData = response.data;

      // Ensure the updated data has the ID for proper list updating
      const updatedDataWithId = {
        ...updatedData,
        id: updatedData.id || data.id,
        // updated_at: updatedData.updated_at || new Date().toISOString()
      };
      
      onDataUpdate(updatedDataWithId);
      onClose();
    } catch (error) {
      console.error('Error updating strategy:', error);
      
      // Handle axios errors properly
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 401) {
          setError('Unauthorized. Please login again.');
        } else if (status === 403) {
          setError('Forbidden. You do not have permission to perform this action.');
        } else if (errorData && errorData.detail) {
          setError(errorData.detail);
        } else if (errorData && typeof errorData === 'object') {
          // Handle validation errors
          const validationErrors = [];
          Object.keys(errorData).forEach(field => {
            if (Array.isArray(errorData[field])) {
              validationErrors.push(`${field}: ${errorData[field].join(', ')}`);
            } else if (typeof errorData[field] === 'string') {
              validationErrors.push(`${field}: ${errorData[field]}`);
            }
          });
          
          if (validationErrors.length > 0) {
            setError(`Validation errors: ${validationErrors.join('; ')}`);
          } else {
            setError(`Error ${status}: ${errorData.message || 'Unknown error'}`);
          }
        } else {
          setError(`Error ${status}: Unable to update strategy`);
        }
      } else if (error.request) {
        // Network error
        setError('Network error. Please check your connection.');
      } else {
        // Other error
        setError(error.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Edit Trade Strategies</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name of Trade Strategies
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter name"
                
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description of Trade Strategies
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter description..."
                rows="8"
                required
              />
            </div>
            
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Trade Strategies'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditData;