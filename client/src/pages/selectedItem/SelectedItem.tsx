import Layout from "../../components/core/Layout";
import ItemDetails from "../../components/core/ItemDetails";
import { useAppSelector } from "../../states/hooks";
import { selectSelectedItem } from "../../states/slices/selectedItemSlice";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SelectedItem = () => {
  // Retrieve selected item from Redux store
  const selectedItem = useAppSelector(selectSelectedItem);
  return (
    <Layout>
      {selectedItem.data != null ? (
        <ItemDetails {...selectedItem.data} />
      ) : <Navigate to="/" />}
    </Layout>
  );
};

export default SelectedItem;
