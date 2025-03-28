import React, { useState } from 'react';
import filterplus from "./images/filter-plus.png";
import filtervariant from "./images/filter-variant.png";
import close from "./images/close.png";
import deletee from "./images/delete.png";

const FilterDialog = ({ isOpen, onClose, onApplyFilters, activeFilters = [] }) => {
  const [filterRows, setFilterRows] = useState([]);
  
  React.useEffect(() => {
    if (isOpen && activeFilters.length > 0) {
      setFilterRows(activeFilters);
    }
  }, [isOpen, activeFilters]);
  
  const columns = [
    { value: '', label: 'Select Column' },
    { value: 'UserName', label: 'Username' },
    { value: 'FirstName', label: 'First Name' },
    { value: 'LastName', label: 'Last Name' },
    { value: 'MiddleName', label: 'Middle Name' },
    { value: 'Gender', label: 'Gender' },
    { value: 'Age', label: 'Age' },
    { value: 'Email', label: 'Email Address' }
  ];
  
  const relations = [
    { value: '', label: 'Select Relation' },
    { value: 'eq', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'startswith', label: 'Starts With' },
    { value: 'endswith', label: 'Ends With' },
    { value: 'gt', label: 'Greater Than' },
    { value: 'lt', label: 'Less Than' }
  ];
  
  const handleAddFilter = () => {
    setFilterRows([...filterRows, { column: '', relation: '', value: '' }]);
  };
  
  const handleRemoveFilter = (index) => {
    const updatedRows = [...filterRows];
    updatedRows.splice(index, 1);
    setFilterRows(updatedRows);
  };
  
  const handleFilterChange = (index, field, value) => {
    const updatedRows = [...filterRows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setFilterRows(updatedRows);
  };
  
  const handleSubmit = () => {
    const validFilters = filterRows.filter(row => row.column && row.relation && row.value);
    onApplyFilters(validFilters);
    onClose();
  };
  
  const handleReset = () => {
    setFilterRows([]);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="filter-dialog-overlay">
      <div className="filter-dialog">
        <div className="filter-dialog-header">
          <div className="filter-dialog-title">
            <img src={filtervariant} alt="filter" className="filter-icon" />
            Filter Table
          </div>
          <button className="filter-dialog-close" onClick={onClose}>
            <img src={close} alt="close" className="close-icon" />
          </button>
        </div>
        
        <div className="filter-dialog-content">
          <div className="add-filter-row">
            <button className="add-filter-btn" onClick={handleAddFilter}>
              <img src={filterplus} alt="filter-plus" className="plus-icon" />
              Add Filter
            </button>
          </div>
          
          {filterRows.map((filter, index) => (
            <div className="filter-row" key={index}>
              <div className="filter-column">
                <label>Column:</label>
                <select
                  value={filter.column}
                  onChange={(e) => handleFilterChange(index, 'column', e.target.value)}
                >
                  {columns.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-relation">
                <label>Relation:</label>
                <select
                  value={filter.relation}
                  onChange={(e) => handleFilterChange(index, 'relation', e.target.value)}
                >
                  {relations.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-value">
                <label>Filter Value:</label>
                <div className="filter-value-container">
                  <input
                    type="text"
                    placeholder="Enter Value"
                    value={filter.value}
                    onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                  />
                  <button 
                    className="remove-filter-btn"
                    onClick={() => handleRemoveFilter(index)}
                  >
                    <img src={deletee} alt="trash" className="trash-icon" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="filter-dialog-footer">
          <button className="reset-filter-btn" onClick={handleReset}>
            Reset Filter
          </button>
          <button className="submit-filter-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export const FilterButton = ({ activeFilters = [], onClick }) => {
  const filterCount = activeFilters.length;
  
  return (
    <button 
      className={`filter-button ${filterCount > 0 ? 'active' : ''}`}
      onClick={onClick}
    >
      {filterCount > 0 ? `${filterCount} Filter` : 'Filter'}
      {filterCount > 0 && (
        <span 
          className="clear-filter" 
          onClick={(e) => {
            e.stopPropagation();
            // Add logic to clear filters
          }}
        >
          ✕
        </span>
      )}
    </button>
  );
};

export default FilterDialog;