const { ApolloServer, gql } = require("apollo-server");
const { continents, countries, languages } = require("countries-list");

const typeDefs = gql`
  type Country {
    code: ID!
    name: String
    native: String
    phone: String
    continent: Continent
    capital: String
    currency: String
    languages: [Language]
    emoji: String!
  }

  type Language {
    name: String
    native: String
  }
  type Continent {
    code: ID!
    name: String
    countries: [Country!]!
  }
  type Query {
    countries: [Country]
    country(code: ID!): Country
    continent(name: String!): Continent
    languages: [Language]
    language: Language
  }
`;

const resolvers = {
  Query: {
    countries: (parent, { filter }) =>
      Object.entries(countries).map(([code, country]) => ({
        ...country,
        code,
      })),
    country: (parent, { code }) => {
      const country = countries[code];
      return country ? { ...country, code } : null;
    },
    language: (parent, { code }) => {
      const language = languages[code];
      return (
        language && {
          ...language,
          code,
        }
      );
    },
    languages: (parent, { filter }) =>
      Object.entries(languages).map(([code, language]) => ({
        ...language,
        code,
      })),

    continent: ({ continent }) => ({
      code: continent,
      name: continents[continent],
    }),
  },

  Continent: {
    countries: (continent) =>
      Object.entries(countries)
        .filter((entry) => entry[1].continent === continent.code)
        .map(([code, country]) => ({
          ...country,
          code,
        })),
  },
  Country: {
    continent: ({ continent }) => ({
      code: continent,
      name: continents[continent],
    }),
    languages: (country) =>
      country.languages.map((code) => {
        const language = languages[code];
        return {
          ...language,
          code,
        };
      }),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
