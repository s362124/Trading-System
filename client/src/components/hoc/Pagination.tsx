import { Button, Center, HStack, ListItem, UnorderedList } from '@chakra-ui/react';
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Function to handle page navigation
  const handlePageChange = (page) => {
    if (page >= 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Generate page numbers for pagination
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 0; i <= totalPages; i++) {
      pageNumbers.push(
        
          <Button  key={i}
          onClick={() => handlePageChange(i)}
     colorScheme={currentPage===i?"blue":"gray"} rounded={"full"}>{i}</Button>

      );
    }
    return pageNumbers;
  };

  return (
    
    <Center>
          <HStack spacing={2}>
        
        <Button rounded={"full"} isDisabled={currentPage===0} onClick={() => handlePageChange(currentPage - 1)}>Previous</Button>
      
      {renderPageNumbers()}
      
        <Button rounded={"full"} isDisabled={currentPage===totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</Button>
      
      </HStack>
    </Center>

  );
};

export default Pagination;
