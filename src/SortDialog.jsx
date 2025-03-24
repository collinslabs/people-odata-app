import React, { useState, useEffect } from 'react';
import './styles.css';

const SortDialog = ({ isOpen, onClose, onApplySorting, initialSortFields = [] }) => {
  const [sortFields, setSortFields] = useState([]);

  useEffect(() => {
    if (isOpen && initialSortFields.length > 0) {
      setSortFields(initialSortFields);
    }
  }, [isOpen, initialSortFields]);

  const handleColumnChange = (index, value) => {
    const updatedFields = [...sortFields];
    updatedFields[index].column = value;
    setSortFields(updatedFields);
  };

  const handleOrderChange = (index, value) => {
    const updatedFields = [...sortFields];
    updatedFields[index].order = value;
    setSortFields(updatedFields);
  };

  const handleRemoveSorter = (index) => {
    const updatedFields = [...sortFields];
    updatedFields.splice(index, 1);
    setSortFields(updatedFields);
  };

  const handleAddSorter = () => {
    setSortFields([...sortFields, { column: '', order: 'Ascending' }]);
  };

  const handleSubmit = () => {
    const validSortFields = sortFields.filter(field => field.column);
    onApplySorting(validSortFields);
    onClose();
  };

  const handleReset = () => {
    setSortFields([]);
  };

  const availableColumns = [
    { value: 'UserName', label: 'Username' },
    { value: 'FirstName', label: 'First Name' },
    { value: 'LastName', label: 'Last Name' },
    { value: 'MiddleName', label: 'Middle Name' },
    { value: 'Gender', label: 'Gender' },
    { value: 'Age', label: 'Age' }
  ];

  if (!isOpen) return null;

  return (
    <div className="filter-dialog-overlay">
      <div className="filter-dialog">
        <div className="filter-dialog-header">
          <div className="filter-dialog-title">
            <span className="sort-icon">↑↓</span>
            Sort Table
          </div>
          <button className="filter-dialog-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="filter-dialog-content">
          {sortFields.map((field, index) => (
            <div key={index} className="filter-row">
              <div className="filter-column">
                <label>Column:</label>
                <select 
                  value={field.column} 
                  onChange={(e) => handleColumnChange(index, e.target.value)}
                >
                  <option value="">Select Column</option>
                  {availableColumns.map(column => (
                    <option key={column.value} value={column.value}>
                      {column.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-relation">
                <label>Order</label>
                <select
                  value={field.order}
                  onChange={(e) => handleOrderChange(index, e.target.value)}
                >
                  <option value="Ascending">Ascending</option>
                  <option value="Descending">Descending</option>
                </select>
              </div>
              
              <button
                className="remove-filter-btn"
                onClick={() => handleRemoveSorter(index)}
              >
                <span className="trash-icon">🗑️</span>
              </button>
            </div>
          ))}
          
          <div className="add-filter-row">
            <button className="add-filter-btn" onClick={handleAddSorter}>
              <span className="plus-icon">+</span>
              Add Sorter
            </button>
          </div>
        </div>
        
        <div className="filter-dialog-footer">
          <button className="reset-filter-btn" onClick={handleReset}>
            Reset Sorting
          </button>
          <button className="submit-filter-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

// Example of a SortButton component that shows the count
export const SortButton = ({ activeSortFields = [], onClick }) => {
  const sortCount = activeSortFields.length;
  
  return (
    <button 
      className={`sort-button ${sortCount > 0 ? 'active' : ''}`}
      onClick={onClick}
    >
      {sortCount > 0 ? `${sortCount} Sort` : 'Sort'}
      {sortCount > 0 && (
        <span className="clear-sort" onClick={(e) => {
          e.stopPropagation();
          
        }}>
          ✕
        </span>
      )}
    </button>
  );
};

export default SortDialog;