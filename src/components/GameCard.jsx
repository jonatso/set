import { GridItem, useColorModeValue, Text } from "@chakra-ui/react";
import CardImage from "./CardImage";

export default function GameCard({card, toggleCard, isSelected}) {
    return (
        <GridItem
            w="100%"
            h="auto"
            bg={useColorModeValue('grey.100', 'gray.900')}
            borderRadius="lg"
            borderColor={useColorModeValue(isSelected ? "black" : 'gray.400' , isSelected ? "white" : 'gray.700')}
            borderWidth="3px"
            borderStyle="solid"
            textAlign="center"
            onClick={toggleCard}
            cursor="pointer"
            transform={isSelected ? 'scale(1.06)' : 'scale(1)'}
            _hover={
                {
                    boxShadow: 'lg',
                    transform: isSelected ? 'scale(1.06)' : 'scale(1.04)',
                    transition: 'all 0.05s ease-in-out',
                }
            }
          >
              <CardImage card={card}/>
        </GridItem>
    );
}