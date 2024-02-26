import  { useEffect, useState } from 'react';

interface PaginatorProps {
  data: any[];
}

const usePaginator = ({ data }: PaginatorProps) => {
  //you can customize the number of items desired per page through this variable
  const pageSize = 9;
  const numOfPages = Math.floor(data.length / pageSize);

  const [currentPage, setCurrentPage] = useState(0);
  const [currentData, setCurrentData] = useState([]);
  const setPage = (pageIndex: number) => {
    const startIndex = pageIndex * pageSize;
    const endIndex = Math.min(startIndex + pageSize, data.length);
    setCurrentPage(pageIndex);
    setCurrentData(data.slice(startIndex, endIndex));
  };
  useEffect(
    ()=>{
      const dataSetter = () => {
        setCurrentData(data.slice(0, pageSize))
      } 
      dataSetter();
    },[data]
  )
  return { numOfPages, currentPage, currentData, setPage };
};

export default usePaginator;