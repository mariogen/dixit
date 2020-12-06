const { GraphQLServer, PubSub } = require('graphql-yoga')

cards = ['cards-000.png','cards-030.png','cards-032.jpg','cards-034.jpg','cards-036.jpg','cards-038.jpg','cards-040.jpg','cards-042.jpg','cards-044.jpg','cards-046.jpg','cards-048.jpg','cards-059.jpg','cards-061.jpg','cards-063.jpg','cards-065.jpg','cards-067.jpg','cards-069.jpg','cards-071.jpg','cards-073.jpg','cards-075.jpg','cards-078.jpg','cards-086.jpg','cards-088.jpg','cards-090.jpg','cards-092.jpg','cards-094.jpg','cards-095.jpg','cards-097.jpg','cards-098.jpg','cards-100.jpg','cards-110.jpg','cards-111.jpg','cards-112.jpg','cards-113.jpg','cards-114.jpg','cards-115.jpg','cards-116.jpg','cards-117.jpg','cards-118.jpg']

cards = cards.map(card => ({'image':card}))

const typeDefs = `
  type Card {
    image: String!
  }

  type Query {
    cards: [Card!]
  }

  type Mutation {
    addCard(image: String!): ID!
  }

  type Subscription {
    cards: [Card!]
  }
`

const subscribers = []

const resolvers = {
  Query: {
    cards: () => cards,
  },
  Mutation: {
    addCard: (parent, { image }) => {
      cards.push({image})
      subscribers.forEach((fn) => fn())
      return 0
    },
  },
  Subscription: {
    cards: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random().toString(36).slice(2, 15)
        subscribers.push(() => pubsub.publish(channel, { cards }))
        setTimeout(() => pubsub.publish(channel, { cards }), 0)
        console.log(channel, cards);
        return pubsub.asyncIterator(channel)
      },
    },
  },
}

const pubsub = new PubSub()
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } })
server.start(({ port }) => {
  console.log(`Server on http://localhost:${port}/`)
})
