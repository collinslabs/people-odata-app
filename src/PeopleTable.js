import React, { useState, useEffect } from 'react';
import './styles.css';
import FilterDialog from './FilterDialog';
import SortDialog from './SortDialog';

const PeopleTable = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  

  const [sortFields, setSortFields] = useState([{ column: 'UserName', order: 'Ascending' }]);
  
 
  const [filters, setFilters] = useState({
    UserName: '',
    FirstName: '',
    LastName: '',
    MiddleName: '',
    Gender: '',
    Age: ''
  });
  
  
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isSortDialogOpen, setIsSortDialogOpen] = useState(false);
  
 
  const fetchPeople = async () => {
    try {
      setLoading(true);
      
  
      const skip = (currentPage - 1) * pageSize;
      const top = pageSize;
      
      
      let orderByParams = [];
      sortFields.forEach(field => {
        if (field.column) {
          orderByParams.push(`${field.column} ${field.order === 'Ascending' ? 'asc' : 'desc'}`);
        }
      });
      
      const orderBy = orderByParams.length > 0 ? orderByParams.join(',') : 'UserName asc';
      
     
      let filterParams = [];
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (key === 'Age') {
            filterParams.push(`${key} eq ${value}`);
          } else {
            filterParams.push(`contains(${key}, '${value}')`);
          }
        }
      });
      
      const filterQuery = filterParams.length > 0 ? filterParams.join(' and ') : '';
      
    
      let url = `https://services.odata.org/TripPinRESTierService/(S(olb0yty34pw25ka5nt0go11m))/People?$count=true&$skip=${skip}&$top=${top}&$orderby=${orderBy}`;
      
      if (filterQuery) {
        url += `&$filter=${filterQuery}`;
      }
      
    
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      
      setPeople(data.value);
      setTotalCount(data['@odata.count'] || 0);
      setError(null);
    } catch (err) {
      setError('Failed to fetch people data. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchPeople();
  }, [currentPage, pageSize, sortFields, filters]);
  
 
  const handleApplySorting = (newSortFields) => {
    setSortFields(newSortFields.length > 0 ? newSortFields : [{ column: 'UserName', order: 'Ascending' }]);
    setCurrentPage(1);
  };
  
 
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    setCurrentPage(1);
  };
  
 
  const handleApplyFilters = (filterRows) => {
    const newFilters = { ...filters };
    
   
    Object.keys(newFilters).forEach(key => {
      newFilters[key] = '';
    });
    
   
    filterRows.forEach(filter => {
      if (filter.column && filter.value) {
        newFilters[filter.column] = filter.value;
      }
    });
    
    setFilters(newFilters);
    setCurrentPage(1);
  };
  
 
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
 
  const getDisplayName = (fieldName) => {
    const displayMap = {
      'UserName': 'Username',
      'FirstName': 'First Name',
      'LastName': 'Last Name',
      'MiddleName': 'Middle Name',
      'Gender': 'Gender',
      'Age': 'Age'
    };
    return displayMap[fieldName] || fieldName;
  };
  
 
  const totalPages = Math.ceil(totalCount / pageSize);
  
  return (
    <div>
      
      <header className="app-header">
        <div className="app-logo">T</div>
        <div className="app-name">Tatua</div>
        <nav>
          <a href="#" className="nav-link">Raise Ticket</a>
          <a href="#" className="nav-link active">People Data</a>
        </nav>
      </header>
      
      <div className="people-table-container">
       
        <div className="action-bar">
          <button className="action-button" onClick={() => setIsSortDialogOpen(true)}>
            <span>↑↓</span> Sort
          </button>
          <button className="action-button" onClick={() => setIsFilterDialogOpen(true)}>
            <span>⚠</span> Filter
          </button>
          <button className="action-button" onClick={fetchPeople}>
            <span>↻</span> Refresh
          </button>
        </div>
        
    
        <div className="table-responsive">
          <table className="people-table">
            <thead>
              <tr>
                {['UserName', 'FirstName', 'LastName', 'MiddleName', 'Gender', 'Age'].map((field, index) => {
                  return (
                    <th key={index}>
                      {getDisplayName(field)}
                      {sortFields.find(sf => sf.column === field) && (
                        <span className="sort-icon">
                          {sortFields.find(sf => sf.column === field).order === 'Ascending' ? ' ↑' : ' ↓'}
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="loading-cell">
                    <div className="loading-spinner"></div>
                    <div>Loading data...</div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="error-cell">{error}</td>
                </tr>
              ) : people.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-cell">No people found matching the criteria.</td>
                </tr>
              ) : (
                people.map((person, index) => (
                  <tr key={person.UserName || index}>
                    <td>{person.UserName}</td>
                    <td>{person.FirstName}</td>
                    <td>{person.LastName}</td>
                    <td>{person.MiddleName || '-'}</td>
                    <td>{person.Gender}</td>
                    <td>{person.Age || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
       
        {!loading && !error && people.length > 0 && (
          <div className="pagination">
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            
            <div className="pagination-pages">
              <span>Page {currentPage} of {totalPages || 1}</span>
            </div>
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
      
     
      <FilterDialog 
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
      
     
      <SortDialog
        isOpen={isSortDialogOpen}
        onClose={() => setIsSortDialogOpen(false)}
        onApplySorting={handleApplySorting}
        initialSortFields={sortFields}
      />
    </div>
  );
};

export default PeopleTable;