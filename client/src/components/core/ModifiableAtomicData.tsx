import React, { useEffect, useRef, useState } from 'react';
import { Flex, FormLabel, IconButton, useColorModeValue, Text, Input } from '@chakra-ui/react';
import { FiEdit3 } from 'react-icons/fi';

// Define Props type for ModifiableAtomicData component
type Props = {
  id?: string;
  label: string;
  extra?: JSX.Element;
  placeholder?: string;
  type?: string;
  mb?: any;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  modifiable?: boolean;
}

// ModifiableAtomicData component
const ModifiableAtomicData: React.FC<Props> = ({ id, label, value, onChange, modifiable = true, type, ...rest }: Props) => {
  const [change, setChange] = useState(false); // State to track edit mode
  const ref = useRef<HTMLInputElement>(null); // Reference to input element

  useEffect(() => {
    // Set focus to input element when change state is true
    if (change && ref.current) {
      ref.current.focus();
    }
  }, [change]);
  
  // Function to handle edit mode toggling
  const handleClick = () => {
    setChange((prevChange) => !prevChange);
  };
  
  // Color for text in primary mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Flex justifyContent={"space-between"} alignItems={"center"} direction={"row"}>
      <Flex direction='column' mb={rest.mb ? rest.mb : '30px'}>
        <FormLabel
          display='flex'
          ms='10px'
          htmlFor={id}
          fontSize='sm'
          color={textColorPrimary}
          fontWeight='bold'
          _hover={{ cursor: 'pointer' }}>
          {label}
          <Text fontSize='sm' fontWeight='400' ms='2px'>
            {rest.extra}
          </Text>
        </FormLabel>
        <Input
          ref={ref}
          width={"700px"}
          _focus={{borderWidth:"1px"}}
          borderColor={"blue.300"}
          color={"blue.400"}
          isDisabled={!change}
          value={value}
          _disabled={{color:"gray.400"}}
          onChange={onChange}
          {...rest}
          type={type}
          id={id}
          fontWeight='500'
          variant='main'
          placeholder={rest.placeholder}
          _placeholder={{ fontWeight: '400', color: 'secondaryGray.600' }}
          h='44px'
          maxH='44px'
        />
      </Flex>  
      <IconButton variant={"ghost"} colorScheme={"blue"} isDisabled={!modifiable} icon={<FiEdit3 />} onClick={()=>handleClick()} aria-label='change' />
    </Flex>
  )
}

export default ModifiableAtomicData;
