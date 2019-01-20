const axios = require("axios");

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema
} = require("graphql");

const API_KEY = "a058d269-1a24-4df3-9f35-9565d8f459d1";

const TeamType = new GraphQLObjectType({
  name: "Team",
  fields: () => ({
    team_id: { type: GraphQLInt },
    rating: { type: GraphQLString },
    wins: { type: GraphQLInt },
    losses: { type: GraphQLInt },
    last_match_time: { type: GraphQLString },
    name: { type: GraphQLString },
    tag: { type: GraphQLString },
    players: { type: PlayerType }
  })
});

const PlayerType = new GraphQLObjectType({
  name: "Players",
  fields: () => ({
    account_id: { type: GraphQLString },
    name: { type: GraphQLString },
    games_played: { type: GraphQLInt },
    wins: { type: GraphQLInt },
    is_current_team_member: { type: GraphQLBoolean }
  })
});

//RootQuery
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    teams: {
      type: new GraphQLList(TeamType),
      resolve(parent, args) {
        return axios
          .get(`https://api.opendota.com/api/teams?api_key=${API_KEY}`)
          .then(res => res.data);
      }
    },
    team: {
      type: TeamType,
      args: {
        team_id: { type: GraphQLInt }
      },
      resolve(parent, args) {
        return axios
          .get(
            `https://api.opendota.com/api/teams/${
              args.team_id
            }?api_key=${API_KEY}`
          )
          .then(res => res.data);
      }
    },
    players: {
      type: new GraphQLList(PlayerType),
      args: {
        team_id: { type: GraphQLInt }
      },
      resolve(parent, args) {
        return axios
          .get(
            `https://api.opendota.com/api/teams/${
              args.team_id
            }/players?api_key=${API_KEY}`
          )
          .then(res => res.data);
      }
    }
  }
});

//this would also take in any mutations
module.exports = new GraphQLSchema({
  query: RootQuery
});
