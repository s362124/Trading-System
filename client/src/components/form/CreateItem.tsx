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

const CreateItem = () => {
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
    label:"",
    image:"",
    category:"",
    price:0,
    description:""
  }); // State to manage form data
  const [file, setFile] = useState<File>(); // State to manage file upload
  const [loadingFile, setLoadingFile] = useState(false); // State to manage loading state during file upload

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
  const submitHandler = async (event: React.FormEvent, item: Partial<Item>) => {
    event.preventDefault();
    try {
      setLoadingSubmit(true);
      const data = await itemService.create({
        ...item,
        owner: user.data.id,
      });
      dispatch(setItems([...itemSelector.data, data])); // Update items in the global state
      setLoadingSubmit(false);
    } catch (error) {
      setLoadingSubmit(false);
      setError("Error creating your item, Please try again later!");
    }
  };
  const isSubmitDisabled =formData.description.length==0 || formData.label.length==0 || formData.category.length==0  || formData.image.length==0 || formData.price==0
  return (
    <>
      <Button
        
        type="submit"
        _focus={{ border: "none" }}
        variant={"solid"}
        isLoading={false}
        colorScheme="blue"
        onClick={onOpen}
      >
        Create Item
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={(e) => submitHandler(e, formData)}>
          <ModalContent>
            <ModalHeader>Create Item</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={2}>
                <FormControl isRequired>
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
                <FormControl isRequired>
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
                <FormControl isRequired>
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
                <FormControl isRequired>
                  <FormLabel>Category</FormLabel>
                  <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                      Categories
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
                <FormControl isRequired>
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
                Create now
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

export default CreateItem;
