import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import Table from '../components/Table';
import Button from '../components/Button';
import { Search, Download, Trash2, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

export const History: React.FC = () => {
  const { history, clearHistory } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all historical prediction logs? This action is irreversible.')) {
      await clearHistory();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'LIMIT':
        return <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-amber-200">Limit</span>;
      case 'OUTLIER':
        return <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-red-200">Outlier</span>;
      default:
        return <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-green-200">Optimal</span>;
    }
  };

  // Filter history logs based on search and selected state
  const filteredHistory = history.filter((item) => {
    const matchesSearch = 
      item.sampleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.coalfield.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesState = selectedState === 'ALL' || item.state === selectedState;
    
    return matchesSearch && matchesState;
  });

  // Paginate items
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  const handleExportCSV = () => {
    const headers = ['Sample ID', 'Mine Name', 'Coalfield', 'State', 'Predicted GCV (kcal/kg)', 'CIL Grade', 'Confidence (%)', 'Timestamp', 'Status'];
    const rows = filteredHistory.map(item => [
      item.sampleId,
      item.mineName,
      item.coalfield,
      item.state,
      item.gcv,
      item.grade,
      item.confidence,
      item.timestamp,
      item.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "CarbonCortex_Prediction_History.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const columns = [
    { 
      header: 'Sample ID', 
      accessor: (row: any) => <span className="font-mono font-bold text-cortex-dark">{row.sampleId}</span> 
    },
    { header: 'Basin / Mine', accessor: (row: any) => `${row.mineName} (${row.coalfield})` },
    { header: 'State Region', accessor: 'state' as const },
    { 
      header: 'Predicted GCV', 
      accessor: (row: any) => <span className="font-mono font-bold text-gold-900">{row.gcv} kcal/kg</span> 
    },
    { header: 'Coal Grade', accessor: 'grade' as const },
    { 
      header: 'Confidence', 
      accessor: (row: any) => <span className="font-mono">{row.confidence}%</span> 
    },
    { 
      header: 'Timestamp', 
      accessor: (row: any) => <span className="text-[11px] text-cortex-gray font-mono">{row.timestamp}</span> 
    },
    { 
      header: 'Status', 
      accessor: (row: any) => getStatusBadge(row.status) 
    }
  ];

  return (
    <div className="text-left select-none flex flex-col gap-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xs font-bold uppercase tracking-widest text-gold-700">Audit Trail Ledger</h1>
          <h2 className="text-2xl font-bold text-cortex-dark mt-1">Prediction History</h2>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportCSV}
            disabled={filteredHistory.length === 0}
            className="flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Ledger</span>
          </Button>
          
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleClearHistory}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 text-red-650 hover:bg-red-50 hover:border-red-200 border-cortex-border font-bold cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Database</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white border border-cortex-border p-4 rounded-xl shadow-sm">
        <div className="md:col-span-6 relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cortex-light-gray" />
          <input 
            type="text"
            placeholder="Search by sample ID, mine name, or coalfield..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-cortex-bg-secondary border border-cortex-border rounded-lg text-xs outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/10"
          />
        </div>

        <div className="md:col-span-4 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-cortex-light-gray flex-shrink-0" />
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 bg-cortex-bg-secondary border border-cortex-border rounded-lg text-xs text-cortex-dark outline-none focus:border-gold-500"
          >
            <option value="ALL">All Subsidiaries (State)</option>
            {['Jharkhand', 'Chhattisgarh', 'Odisha', 'West Bengal', 'Madhya Pradesh', 'Maharashtra', 'Assam'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 text-right text-xs text-cortex-gray font-semibold">
          Showing {filteredHistory.length} records
        </div>
      </div>

      {/* Prediction History Table */}
      <Table 
        columns={columns} 
        data={paginatedData}
        emptyMessage="No predictions matching filters could be located."
        className="shadow-premium"
      />

      {/* Pagination component */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center text-xs mt-2 px-1">
          <span className="text-cortex-gray font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default History;
