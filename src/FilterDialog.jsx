import React, { useState } from 'react';

const FilterDialog = ({ isOpen, onClose, onApplyFilters }) => {
  const [filterRows, setFilterRows] = useState([{ column: '', relation: '', value: '' }]);
  
 
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
    setFilterRows([{ column: '', relation: '', value: '' }]);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="filter-dialog-overlay">
      <div className="filter-dialog">
        <div className="filter-dialog-header">
          <div className="filter-dialog-title">
            <i className="filter-icon">≡</i> Filter Table
          </div>
          <button className="filter-dialog-close" onClick={onClose}>
            <i className="close-icon">✕</i>
          </button>
        </div>
        
        <div className="filter-dialog-content">
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
                  {filterRows.length > 1 && (
                    <button 
                      className="remove-filter-btn"
                      onClick={() => handleRemoveFilter(index)}
                    >
                      <i className="trash-icon">🗑️</i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <div className="add-filter-row">
            <button className="add-filter-btn" onClick={handleAddFilter}>
              <i className="plus-icon">+</i> Add Filter
            </button>
          </div>
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

export default FilterDialog;