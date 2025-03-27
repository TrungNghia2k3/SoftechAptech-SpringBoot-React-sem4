import React, { useState } from "react";
import { Button, FormControl, InputGroup, Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { searchCategoriesByKeyword } from "../../../../services/categoryService";

const SearchCategories = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const results = await searchCategoriesByKeyword(searchKeyword);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching categories:", error);
      toast.error("Error searching categories");
    }
  };

  return (
    <div>
      <h5>Search Categories</h5>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search by name..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <Button variant="outline-secondary" onClick={handleSearch}>
          Search
        </Button>
      </InputGroup>

      {searchResults.length > 0 && (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((category, index) => (
              <tr key={index}>
                <td>{category.id}</td>
                <td>{category.name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default SearchCategories;
