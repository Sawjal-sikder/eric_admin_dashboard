import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Table from '../../components/ui/Table';
import CreateData from './CreateModal';
import EditData from './EditModal';
import DeleteData from './DeleteModal';
import { API_BASE_URL } from '../../services/auth';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  MoreVertical
} from 'lucide-react';

const Strategies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // for creating new Data
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  // for Data edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  // for Data delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDataId, setSelectedDataId] = useState(null);

  // Transform API data to match the expected format for the UI
  const transformData = (apiData) => {
    return {
      id: apiData.id,
      name: apiData.name || 'N/A',
      description: apiData.description || 'N/A',
    };
  };

  // Fetch Data from API only
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/ai/trade/strategies/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = response.data;    

      setDatas(result);
    } catch (error) {
      setError(`API Error: ${error.message}`);
      setDatas([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = datas.filter(data => {
    const matchesSearch = (data.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (data.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleEditData = (data) => {
    setSelectedData(data);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedData(null);
  };

  const handleDataUpdate = (updatedDataData) => {
    fetchData();
  };

  const handleDeleteData = async (dataId) => {
    setSelectedDataId(dataId);
    setIsDeleteModalOpen(true);
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedDataId(null);
  };

  const handleDataDelete = (deletedDataId) => {
    setIsDeleteModalOpen(false);
    setSelectedDataId(null);
    fetchData();
  }


  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trade Strategies</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage and monitor trade strategies used in AI trading.
              </p>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                {error} - Showing dummy data instead.
              </p>
            </div>
          )}
        </div>

        {/* Actions Bar */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex justify-between sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search Trade Strategies..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="flex items-center" disabled={loading} onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Strategy
            </Button>
            </div>
          </div>
        </Card>

        {/* Styles Table */}
        <Card>
          {loading ? (
            <div className="text-center py-12">
              <div className="text-sm text-gray-500">Loading strategies...</div>
            </div>
          ) : (
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header width="w-16">ID</Table.Header>
                  <Table.Header width="w-1/3">Name of Trade strategy</Table.Header>
                  <Table.Header width="w-1/2">Description of Trade strategy</Table.Header>
                  <Table.Header width="w-24">Actions</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {filteredData.map((data) => (
                  <Table.Row key={data.id}>
                    <Table.Cell>
                      <div className="text-sm font-medium text-gray-900">{data.id}</div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center space-x-3">
                        {/* <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {data.name.charAt(0)}
                          </span>
                        </div> */}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{data.name || "-"}</div>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="text-sm text-gray-900 w-full whitespace-normal break-words">

                        {data.description || "-"}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center space-x-2">
                        {/* <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button> */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditData(data)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {/* <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button> */}
                        <Button variant="ghost" size="sm"
                        onClick={() => handleDeleteData(data.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}

          {!loading && filteredData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-sm text-gray-500">No strategies found</div>
            </div>
          )}
        </Card>

        {/* Edit Strategy Modal */}
        <EditData
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          data={selectedData}
          onDataUpdate={fetchData}
          useLocalUpdate={false}
        />  
        {/* Delete Strategy Modal */}
        <DeleteData
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          dataId={selectedDataId}
          onDataDelete={fetchData}
        />
        {/* Create Strategy Modal */}
        <CreateData
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onDataCreate={fetchData}
        />

      </div>
    </Layout>
  );
};

export default Strategies;