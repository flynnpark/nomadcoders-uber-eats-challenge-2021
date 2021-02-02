module.exports = {
  client: {
    includes: ["./src/**/*.tsx"],
    tagName: "gql",
    service: {
      name: "nuber-eats-api",
      url: 'https://nuber-eats-api.herokuapp.com/graphql',
    },
  },
};