import { ChevronDownIcon } from "@chakra-ui/icons";
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
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  InputGroup,
  useToast,
  IconButton,
  Text
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../states/hooks";
import { selectUser } from "../../states/slices/userSlice";
import { Item } from "../../types/Item";
import { useState } from "react";
import { ItemService } from "../../services/ItemService";
import { selectItems, setItems } from "../../states/slices/itemSlice";
import { selectCategories } from "../../states/slices/categoriesSlice";
import { ItemCategory } from "../../types/ItemCategory";
import FileService from "../../services/FileService";
import ErrorMessage from "../core/ErrorMessage";
import { FiEdit } from "react-icons/fi";

type Props = {
    currentData:Partial<Item>
}
const UpdateItem = (props:Props) => {
    //destructuring props
    const {currentData} = props
    const {label,image,category,price,description,...rest} = currentData;
  const { isOpen, onOpen, onClose } = useDisclosure(); // Manage the open and close state of the modal
  const user = useAppSelector(selectUser); // Select user from the global state
  const itemSelector = useAppSelector(selectItems); // Select items from the global state
  const categoriesSelector = useAppSelector(selectCategories); // Select categories from the global state
  const [loadingSubmit, setLoadingSubmit] = useState(false); // State to manage loading state during form submission
  const [error, setError] = useState(""); // State to manage error messages
  const dispatch = useAppDispatch(); // Dispatcher to dispatch actions
  const itemService = new ItemService(); // Instance of ItemService
  const fileService = new FileService(); // Instance of FileService
  const [formData, setFormData] = useState<Partial<Item>>({
    
    label:label,
    image:image,
    category:category,
    price:price,
    description:description,
    ...rest
  }); // State to manage form data
  const [file, setFile] = useState<File>(); // State to manage file upload
  const [loadingFile, setLoadingFile] = useState(false); // State to manage loading state during file upload
  //toast
  const toast = useToast();
  // Function to handle file upload
  const handleSubmiteFile = async () => {
    try {
      setLoadingFile(true);
      const data = await fileService.uploadFile(file);
      setFormData((prev) => {
        return {
          ...prev,
          image: data.file,
        };
      });
      setLoadingFile(false);
    } catch (error) {
      setLoadingFile(false);
      console.log(error);
    }
  };

  // Function to handle form submission
  const submitHandler = async (event: React.FormEvent, item: Partial<Item>,id:string) => {
    event.preventDefault();
    try {
      setLoadingSubmit(true);
      const res = await itemService.update({
        ...item,
        owner: user.data.id
      },id);
      dispatch(setItems([...itemSelector.data.filter(i=>i.id!=id), {
        id:item.id,
        addedOn:item.addedOn,
        category:item.category,
        description:item.description,
        image:item.image,
        label:item.label,
        owner:item.owner,
        price:item.price
      }])); // Update items in the global state
      setLoadingSubmit(false);
      toast({
        title:"Updated successfully",
        description:"Record updated successfully",
        duration:5000,
        isClosable:true,
        status:"success"
      })
    } catch (error) {
      setLoadingSubmit(false);
      setError("Error updating your item, Please try again later!");
    }
  };
  const isSubmitDisabled =formData.description.length==0 || formData.label.length==0 || formData.category.length==0  || formData.image.length==0 || formData.price==0
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
        <form onSubmit={(e) => submitHandler(e, formData,rest.id)}>
          <ModalContent>
            <ModalHeader>Update Item</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={2}>
                <FormControl >
                  <FormLabel>Label</FormLabel>
                  <Input
                    value={formData?.label}
                    onChange={(e) =>
                      setFormData((prev) => {
                        return { ...prev, label: e.target.value };
                      })
                    }
                    placeholder="Label"
                  />
                </FormControl>
                <FormControl >
                  <FormLabel>Description</FormLabel>
                  <Input
                    value={formData?.description}
                    onChange={(e) =>
                      setFormData((prev) => {
                        return { ...prev, description: e.target.value };
                      })
                    }
                    placeholder="Description"
                  />
                </FormControl>
                <FormControl >
                  <FormLabel>Price (in dollars)</FormLabel>
                  <InputGroup>
                    <Input
                      type="number"
                      value={formData?.price}
                      onChange={(e) =>
                        setFormData((prev) => {
                          return { ...prev, price: parseInt(e.target.value) };
                        })
                      }
                      placeholder="0"
                    />
                    <InputRightElement>$</InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl >
                  <FormLabel>Category</FormLabel>
                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                      <Text>{categoriesSelector.data.find(i=>i.id==rest.id)!=undefined?categoriesSelector.data.find(i=>i.id==rest.id).label:"Categories"}</Text>
                    </MenuButton>
                    <MenuList>
                      {categoriesSelector.data &&
                        categoriesSelector.data.map(
                          (i: ItemCategory, index: number) => (
                            <MenuItem
                              onClick={() =>
                                setFormData((prev) => {
                                  return { ...prev, category: i.id };
                                })
                              }
                              key={index}
                            >
                              {i.label}
                            </MenuItem>
                          )
                        )}
                    </MenuList>
                  </Menu>
                </FormControl>
                <FormControl >
                  <FormLabel>Image</FormLabel>
                  <Input
                    onChange={(e) => setFile(e.target.files[0])}
                    type="file"
                    placeholder="Image"
                  />
                  <Button
                    onClick={handleSubmiteFile}
                    _focus={{ border: "none" }}
                    variant={"solid"}
                    isLoading={loadingFile}
                    colorScheme="blue"
                  >
                    Upload File
                  </Button>
                </FormControl>
                {error && <ErrorMessage message={error} />}
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button
                type="submit"
                isDisabled={isSubmitDisabled}
                _focus={{ border: "none" }}
                variant={"solid"}
                isLoading={loadingSubmit}
                colorScheme="blue"
              >
                Update now
              </Button>
              <Button onClick={onClose} variant="ghost">
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default UpdateItem;
