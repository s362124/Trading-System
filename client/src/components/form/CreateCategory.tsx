import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  VStack,
  FormLabel,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../states/hooks";
import { useState } from "react";
import { selectCategories, setCategories } from "../../states/slices/categoriesSlice";
import { ItemCategory } from "../../types/ItemCategory";
import { ItemCategoryService } from "../../services/ItemCategoryService";
import ErrorMessage from "../core/ErrorMessage";

const CreateCategory = () => {
  // Manage the open and close state of the modal
  const { isOpen, onOpen, onClose } = useDisclosure(); 
   // Select categories from the global state
  const categoriesSelector = useAppSelector(selectCategories);
   // State to manage loading state during form submission
  const [loadingSubmit, setLoadingSubmit] = useState(false);
   // State to manage error messages
  const [error, setError] = useState("");
  // Dispatcher to dispatch actions
  const dispatch = useAppDispatch(); 
  // Instance of ItemCategoryService
  const categoriesService = new ItemCategoryService(); 
   // State to manage form data

  const [formData, setFormData] = useState<Partial<ItemCategory>>({});
  // Function to handle form submission
  const submitHandler = async (
    event: React.FormEvent,
    item: Partial<ItemCategory>
  ) => {
    event.preventDefault();
    try {
      setLoadingSubmit(true);
      const data = await categoriesService.create({
        ...item,
      });
      dispatch(setCategories([...categoriesSelector.data, data])); // Update categories in the global state
      setLoadingSubmit(false);
    } catch (error) {
      setLoadingSubmit(false);
      setError("Error creating category, Please try again later!");
    }
  };

  
  return (
    <>
      <Button type="submit" _focus={{border:"none"}} variant={"solid"} isLoading={false} colorScheme="blue" onClick={onOpen}>Add Category</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={e=>submitHandler(e,formData)}>
        <ModalContent>
          <ModalHeader>Create Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
              <VStack spacing={2}>
                <FormControl>
                  <FormLabel>Label</FormLabel>
                  <Input value={formData?.label} onChange={e=>setFormData(prev=>{
                    return {...prev,label:e.target.value}
                  })} placeholder="Label" />
                </FormControl>
               
                {error && <ErrorMessage message={error} />}  
              </VStack>
            
          </ModalBody>

          <ModalFooter>

            <Button  type="submit" isDisabled={formData==undefined} _focus={{border:"none"}} variant={"solid"} isLoading={loadingSubmit} colorScheme="blue" >
              Create now
            </Button>
            <Button onClick={onClose} variant="ghost">Cance</Button>
          </ModalFooter>
        </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default CreateCategory;
