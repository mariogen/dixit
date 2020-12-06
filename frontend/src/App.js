// Import Swiper React component
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { EffectCoverflow, Thumbs } from 'swiper';
import 'swiper/swiper-bundle.css';
import { Container } from '@material-ui/core';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useSubscription,
  useMutation,
  gql,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";


SwiperCore.use([EffectCoverflow, Thumbs]);


const link = new WebSocketLink({
  uri: `ws://localhost:4000/`,
  options: {
    reconnect: true,
  },
});

const client = new ApolloClient({
  link,
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

const GET_CARDS = gql`
  subscription {
    cards {
      image
    }
  }
`;

const POST_CARD = gql`
  mutation($image: String!) {
    addCard(image: $image)
  }
`;

const App = () => {
  const {data} = useSubscription(GET_CARDS)
  if (!data) return null
  if (data.loading) return null
  console.log(JSON.stringify(data,null,2))
  return (
    <Container>
      <Swiper
        effect='coverflow'
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView='auto'
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
      >
        {data.cards.map(({image}) =>
          <SwiperSlide key={image}>
            <img src={`${process.env.PUBLIC_URL}/images/cards/${image}`} alt={image} />
          </SwiperSlide>
        )}
      </Swiper>
    </Container >
  );
};

export default () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);