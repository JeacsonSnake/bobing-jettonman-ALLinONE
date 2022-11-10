import Vue from 'vue'
import Vuex from 'vuex'
import { getRank, getClear, getSingle, getResult } from '../api'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        playerRank: [],
        singleRank: {
            playerName: "Rank",
                prize: []
        },
        resultDiceNumArr:[],
        playerNow: -1,
        playerAmount: 0,
        prizeName: [     
            "yixiu",
            "erju",
            "sijin",
            "sanhong",
            "straight6",
            "redotfour",
            "blackdot5",
            "redotfive",
            "blackdot6",
            "blossomone",
            "allaroundsix",
            "icing",
            "null"
        ],
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
            "icing 4+2",
            "poor luck"
        ],
        prizeImgUrl: [
            "yiXIU.svg",
            "erju.svg",
            "sijin.svg",
            "sanhong.svg",
            "duitang.svg",
            "sidianhong.svg",
            "wubohei.svg",
            "redotFIVE.svg",
            "blackdot-6.svg",
            "blossom-ONE.svg",
            "All-around-6.svg",
            "icing4+2.svg",
            "blank.svg"
        ],

  },
  getters: {
  },
    mutations: {
        changePlayerAmount(state, playerNum) {
            state.playerAmount = playerNum
        },
        changePlayerNow(state, playerNum) {
            state.playerNow = playerNum
        },
        clearSingleRank(state) { 
            state.singleRank = {
                playerName: "Rank",
                prize: []
            }
        },
        clearResultDiceNumArr(state) {
            state.resultDiceNumArr = []
        }
  },
    actions: {
        getRan({state}, amount) {
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
                            player.prize += " "+ state.prizeRealName[j-1] + " * " + v +","
                        }
                    })
                    player.prize = player.prize.slice(1, player.prize.length - 1)
                    state.playerRank.push({...player})
                });
            }).catch((err) => {
                console.log(`getRankerr`, err);
            })
        },

        getNewRun({ commit, state }, playerNum) {
            getClear().then((res) => {
                commit("changePlayerAmount", playerNum)
                commit("changePlayerNow", 0)
                commit("clearSingleRank")
                commit("clearResultDiceNumArr")
                // this.dispatch("getSinglePlayerRank", 1)
                console.log(`getClear res.msg`, res.msg);
            }).catch((err) => {
                console.log(`err`, err);
            })
        },

        getSinglePlayerRank({state}, playerName) {
            let player = {
                playerName: "",
                prize: []
            }
            let singlePrize = {
                imgUrl: "",
                number: 0
            }
            getSingle(playerName).then((res) => {
                player.playerName = "player " + res.data[0].name
                let tempKeyArr = Object.keys(res.data[0])
                let tempValueArr = Object.values(res.data[0])
                tempValueArr.forEach((v, j) => {
                    if (v != '0' & tempKeyArr[j] != "name") {
                        singlePrize.imgUrl = state.prizeImgUrl[j-1]
                        singlePrize.number = v
                        player.prize.unshift({...singlePrize})
                    }
                })
                state.singleRank = { ...player }
                console.log(`state.singleRank`, state.singleRank);
            }).catch((err) => {
                console.log(`getSingleRankerr`, err);
            })
        },

        getNextResult({state}) {
            if (state.playerNow == state.playerAmount) {
                state.playerNow = 1
            }
            else {
                state.playerNow++
            }
            getResult(state.playerNow).then((res) => {
                console.log(`res.data`, res.data);
                state.resultDiceNumArr = res.data.resultNum.split("")
                console.log(`state.resultDiceNumArr`, state.resultDiceNumArr);
                this.dispatch("getSinglePlayerRank", state.playerNow)
            }).catch((err) => {
                
            })
        }
  },
  modules: {
  }
})
