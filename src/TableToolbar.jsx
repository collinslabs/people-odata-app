import React, { useState } from 'react';
import FilterDialog, { FilterButton } from './FilterDialog';
import SortDialog, { SortButton } from './SortDialog';

const TableToolbar = ({ onRefresh }) => {
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showSortDialog, setShowSortDialog] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [activeSortFields, setActiveSortFields] = useState([]);

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
   
  };

  const handleApplySorting = (sortFields) => {
    setActiveSortFields(sortFields);
    
  };

  const handleClearFilters = (e) => {
    e.stopPropagation();
    setActiveFilters([]);
    
  };

  const handleClearSorting = (e) => {
    e.stopPropagation();
    setActiveSortFields([]);
    
  };

  return (
    <div className="table-toolbar">
      <div className="toolbar-buttons">
        <SortButton 
          activeSortFields={activeSortFields} 
          onClick={() => setShowSortDialog(true)} 
          onClear={handleClearSorting}
        />
        
        <FilterButton 
          activeFilters={activeFilters} 
          onClick={() => setShowFilterDialog(true)} 
          onClear={handleClearFilters}
        />
        
        <button className="refresh-button" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      <FilterDialog 
        isOpen={showFilterDialog}
        onClose={() => setShowFilterDialog(false)}
        onApplyFilters={handleApplyFilters}
        activeFilters={activeFilters}
      />

      <SortDialog 
        isOpen={showSortDialog}
        onClose={() => setShowSortDialog(false)}
        onApplySorting={handleApplySorting}
        initialSortFields={activeSortFields}
      />
    </div>
  );
};

export default TableToolbar;