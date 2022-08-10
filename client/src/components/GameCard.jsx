import { GridItem, useColorModeValue } from "@chakra-ui/react";
import CardImage from "./CardImage";

export default function GameCard({card, toggleCard, isSelected, sizeMultiplier}) {
    return (
        <GridItem
            w="100%"
            h="auto"
            bg={useColorModeValue('grey.100', 'gray.900')}
            borderRadius={!sizeMultiplier || sizeMultiplier > 0.7 ? 'lg' : sizeMultiplier > 0.25 ? 'md' : 'sm'}
            borderColor={useColorModeValue(isSelected ? "black" : 'gray.400' , isSelected ? "white" : 'gray.700')}
            borderWidth={`${Math.ceil(3 * (sizeMultiplier ?? 1))}px`}
            borderStyle="solid"
            textAlign="center"
            onClick={toggleCard}
            cursor="pointer"
            transform={isSelected ? 'scale(1.06)' : 'scale(1)'}
            _hover={
                {
                    boxShadow: !sizeMultiplier || sizeMultiplier > 0.7 ? 'lg' : sizeMultiplier > 0.25 ? 'md' : 'sm',
                    transform: isSelected ? 'scale(1.06)' : 'scale(1.04)',
                    transition: 'all 0.05s ease-in-out',
                }
            }
          >
              <CardImage card={card} sizeMultiplier={sizeMultiplier}/>
        </GridItem>
    );
}