module.exports = {
	client: {
		includes: ["./src/**/*.{tsx,ts}"],
		tagName: "gql",
		service: {
			name: "nuber-podcasts-backend",
			url: "https://nuber-podcasts-backend.herokuapp.com/graphql",
		},
	},
};
