import { Flex } from '@chakra-ui/react';

export default function CardImage({ card }) {
  const paths = [
    'M25 0 L50 50 L25 100 L0 50 Z',
    'M38.4,63.4c0,16.1,11,19.9,10.6,28.3c-0.5,9.2-21.1,12.2-33.4,3.8s-15.8-21.2-9.3-38c3.7-7.5,4.9-14,4.8-20 c0-16.1-11-19.9-10.6-28.3C1,0.1,21.6-3,33.9,5.5s15.8,21.2,9.3,38C40.4,50.6,38.5,57.4,38.4,63.4z',
    'M25,99.5C14.2,99.5,5.5,90.8,5.5,80V20C5.5,9.2,14.2,0.5,25,0.5S44.5,9.2,44.5,20v60 C44.5,90.8,35.8,99.5,25,99.5z',
  ];

  const colors = ['#e74c3c', '#27ae60', '#8e44ad'];

  const fills = ['none', `url(#striped${card[1]})`, 'currentColor'];

  return (
    <Flex justifyContent="center" alignItems="center" height={100}>
      {Array.from({ length: card[3] + 1 }, (_, i) => (
        <svg
          // style={{
          //   border: 'dotted 2px pink',
          // }}
          color={colors[card[1]]}
          height="100"
          width="50"
          transform="scale(.7)"
          overflow={'visible'}
          key={i}
        >
          <path
            d={[paths[card[0]]]}
            fill={fills[card[2]]}
            stroke="currentColor"
            strokeWidth="5"
          />
        </svg>
      ))}
    </Flex>
  );
}
