
export const PeopleService = {
    
    apiUrl: 'https://services.odata.org/TripPinRESTierService/(S(qlw4cblyfefwa4nnzuhh2l2a))/People',
    
    /**
     * Fetch people with pagination, sorting, and filtering
     * 
     * @param {Object} options 
     * @param {number} options.page 
     * @param {number} options.pageSize 
     * @param {string} options.sortField 
     * @param {string} options.sortDirection 
     * @param {Object} options.filters
     * @returns {Promise} 
     */
    getPeople: async (options = {}) => {
      const {
        page = 1,
        pageSize = 10,
        sortField = 'UserName',
        sortDirection = 'asc',
        filters = {}
      } = options;
      
      
      const skip = (page - 1) * pageSize;
      
     
      let params = [
        '$count=true',
        `$skip=${skip}`,
        `$top=${pageSize}`,
        `$orderby=${sortField} ${sortDirection}`
      ];
      
     
      const filterParams = [];
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (key === 'Age') {
            filterParams.push(`${key} eq ${value}`);
          } else {
            filterParams.push(`contains(${key}, '${value}')`);
          }
        }
      });
      
      if (filterParams.length > 0) {
        params.push(`$filter=${filterParams.join(' and ')}`);
      }
      
   
      const url = `${PeopleService.apiUrl}/People?${params.join('&')}`;
      
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching people data:', error);
        throw error;
      }
    },
    
  
    getPersonById: async (id) => {
      try {
        const response = await fetch(`${PeopleService.apiUrl}/People(${id})`, {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error(`Error fetching person with ID ${id}:`, error);
        throw error;
      }
    },
    
   
    getFirst10Records: async () => {
      try {
        const response = await fetch(`${PeopleService.apiUrl}/People?$top=10`, {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching first 10 records:', error);
        throw error;
      }
    }
  };
  
  export default PeopleService;