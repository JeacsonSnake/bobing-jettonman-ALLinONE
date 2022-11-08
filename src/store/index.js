import Vue from 'vue'
import Vuex from 'vuex'
import { getRank } from '../api'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        playerRank: [],
        playerAmount: 0,
        prizeRealName: [
            "yi XIU",
            "er JU",
            "si JIN",
            "san HONG",
            "straight 6",
            "redot FOUR",
            "blackdot 5",
            "redot FIVE",
            "blackdot 6",
            "blossom ONE",
            "allaround SIX",
            "icing 4+2"
        ]
  },
  getters: {
  },
  mutations: {
  },
    actions: {
        getRan({ commit, state}, amount) {
            let player = {};
            getRank(amount).then((res) => {
                state.playerRank.splice(0, this.state.playerRank.length)
                res.data.forEach((rank, i) => {
                    player.playername = "player " + rank.name
                    player.prize = ""
                    let tempKeyArr = Object.keys(rank)
                    let tempValueArr = Object.values(rank)
                    tempValueArr.forEach((v, j) => {
                        if (v != '0' & tempKeyArr[j] != "name") {
                            player.prize += " "+ state.prizeRealName[j] + " * " + v +","
                        }
                    })
                    player.prize = player.prize.slice(1, player.prize.length - 1)
                    state.playerRank.push({...player})
                });
            }).catch((err) => {
                console.log(`getRankerr`, err);
            })
        }
  },
  modules: {
  }
})
