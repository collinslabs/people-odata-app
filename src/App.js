import React from 'react';
import PeopleTable from './PeopleTable';
import './styles.css';

function App() {
  return (
    <div className="App">
      <main>
        <PeopleTable />
      </main>
      <footer className="App-footer">
        <p>© {new Date().getFullYear()} - People OData Application</p>
      </footer>
    </div>
  );
}

export default App;