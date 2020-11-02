import { GraphQLServer, PubSub }  from "graphql-yoga"

const cards = [
  {'image':'cards-000.png'},
  {'image':'cards-030.png'},
  {'image':'cards-032.jpg'}
]

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
