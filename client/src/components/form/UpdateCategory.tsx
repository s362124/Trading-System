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
    IconButton,
    useToast,
  } from "@chakra-ui/react";
  import { useAppDispatch, useAppSelector } from "../../states/hooks";
  import { useState } from "react";
  import { selectCategories, setCategories } from "../../states/slices/categoriesSlice";
  import { ItemCategory } from "../../types/ItemCategory";
  import { ItemCategoryService } from "../../services/ItemCategoryService";
  import ErrorMessage from "../core/ErrorMessage";
import { FiEdit } from "react-icons/fi";
  
  type Props = {
    currentData:ItemCategory,
      }
  const updateCategory = (props:Props) => {
    // Manage the open and close state of the modal
    const { isOpen, onOpen, onClose } = useDisclosure(); 
     // State to manage error messages
    const [error, setError] = useState("");
     // State to manage form data
  
    const [formData, setFormData] = useState<Partial<ItemCategory>>({
        label:props.currentData.label,
        id:props.currentData.id
    });
  
  //loading state for update function
  const [loading,setLoading] = useState(false)

  
  const categoriesService = new ItemCategoryService();
  //toast 
  const toast = useToast()
  //dispatcher to dispatch action
  const dispatch = useAppDispatch()
  //categories selector
  const categoriesSelector = useAppSelector(selectCategories)
  //update function
    const updateCategory = async (e:React.FormEvent<HTMLFormElement>,data:Partial<ItemCategory>,id:string) => {
        e.preventDefault();
        try {
          setLoading(true)
          const res = await categoriesService.update(data,id);
          console.log(res)
          toast({
            title:"Updated successfully",
            description:"Record updated successfully",
            duration:5000,
            isClosable:true,
            status:"success"
          })
          //here we delete the updated category then we added again with the new data
          dispatch(setCategories([...categoriesSelector.data.filter(i=>i.id!=id),{id,label:data.label}]))
          setLoading(false)
        } catch (error) {
          toast({
            title:"Failed to update",
            description:"An error occured when attempting to update record, please try again late",
            duration:5000,
            isClosable:true,
            status:"error"
          })
          setLoading(false)
        }
      }
    return (
      <>
        <IconButton
          onClick={onOpen}
          icon={<FiEdit />}
          colorScheme="gray"
          aria-label={"Update"}
        />
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <form onSubmit={e=>updateCategory(e,formData,props.currentData.id)}>
          <ModalContent>
            <ModalHeader>Update Category</ModalHeader>
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
  
              <Button  type="submit" isDisabled={formData==undefined} _focus={{border:"none"}} variant={"solid"} isLoading={loading} colorScheme="blue" >
                Update now
              </Button>
              <Button onClick={onClose} variant="ghost">Cancel</Button>
            </ModalFooter>
          </ModalContent>
          </form>
        </Modal>
      </>
    );
  };
  
  export default updateCategory;
  