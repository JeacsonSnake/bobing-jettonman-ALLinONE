import Vue from 'vue'
import Vuex from 'vuex'
import {
    getResult
} from '../util/result'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        playerRank: [],
        singleRankTemplate: {
            playerName: "",
            prize: []
        },
        isONFirst: true,
        singleRank: {
            playerName: "",
            prize: []
        },
        singlePrizeTemplate: {
            prizeName: "",
            imgUrl: "",
            prizeGetNum: 0
        },
        prizeNow: {
            imgUrl: "blank.svg",
            prizeName: "博空"
        },
        poorLuck: false,
        resultDiceNumArr: [],
        playerNow: -1,
        playerAmount: 0,
        prizeName: [
            "YiXiu",
            "ErJu",
            "SiJin",
            "SanHong",
            "DuiTang",
            "SiDianHong",
            "WuBoHei",
            "WuBoHong",
            "LiuBoHei",
            "BianDiJing",
            "LiuBoHong",
            "ZhuangYuanChaJinHua",
            "NULL"
        ],
        prizeRealName: [
            "一秀",
            "二举",
            "四进",
            "三红",
            "对堂",
            "四点红",
            "五子登科",
            "红五王",
            "六博黑",
            "遍地锦",
            "六博红",
            "状元插金花",
            "博空"
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
    getters: {},
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
        setSingleRank(state, {
            playerName,
            prize
        }) {
            state.singleRank = {
                playerName,
                prize
            }
            console.log('state.singleRank', state.singleRank);
        },
        clearResultDiceNumArr(state) {
            state.resultDiceNumArr = []
        },
        setisONFirst(state, value) {
            state.isONFirst = value
        },
    },
    actions: {
        getRan({
            state
        }, amount) {
            // let player = {};
            // getRank(amount).then((res) => {
            //     state.playerRank.splice(0, this.state.playerRank.length)
            //     res.data.forEach((rank, i) => {
            //         player.playername = "player " + rank.name
            //         player.prize = ""
            //         let tempKeyArr = Object.keys(rank)
            //         let tempValueArr = Object.values(rank)
            //         tempValueArr.forEach((v, j) => {
            //             if (v != '0' & tempKeyArr[j] != "name") {
            //                 player.prize += " "+ state.prizeRealName[j-1] + " * " + v +","
            //             }
            //         })
            //         player.prize = player.prize.slice(1, player.prize.length - 1)
            //         state.playerRank.push({...player})
            //     });
            // }).catch((err) => {
            //     console.log(`getRankerr`, err);
            // })
        },

        getNewRun({
            commit,
            state
        }, playerNum) {

            let localPlayersRank = JSON.parse(localStorage.getItem('Bobing_playersRank'))
            if (localPlayersRank) {
                localStorage.removeItem('Bobing_playersRank')

            }
            commit("changePlayerAmount", playerNum)
            commit("changePlayerNow", 0)
            commit("clearSingleRank")
            commit("clearResultDiceNumArr")
            commit("setisONFirst", true)
            // this.dispatch("getSinglePlayerRank", 1)
            // console.log(`getClear`);


        },

        getNextResult({
            state
        }) {
            if (state.playerNow == state.playerAmount) {
                state.playerNow = 1
                this.commit("setisONFirst", false)

            } else {
                state.playerNow++
            }
            // getResult 返回结果
            /*
                {
                    resultName: 与prizeName中变量名一致
                    resultNum: "123532" 字符串
                }
            */
            let rollingResult = getResult(state.isONFirst)
            // console.log(`rollingResult`, rollingResult);
            state.prizeName.forEach((p, i) => {
                if (rollingResult.resultName == p) {
                    if (rollingResult.resultName == "NULL") {
                        state.poorLuck = true;
                    } else {
                        state.poorLuck = false;
                    }
                    state.prizeNow.imgUrl = state.prizeImgUrl[i]
                    state.prizeNow.prizeName = state.prizeRealName[i]
                }
            })
            state.resultDiceNumArr = rollingResult.resultNum.split("")
            // console.log(`state.resultDiceNumArr`, state.resultDiceNumArr);
            this.dispatch("setPlayerRank", rollingResult)

        },

        setPlayerRank({
            state
        }, rollingResult) {
            if (state.poorLuck === true) {
                return
            }
            /*
                singlePrizeTemplate: {
                    prizeName: "",
                    imgUrl: "",
                    prizeGetNum: 0
                }
                singleRankTemplate: {
                    playerName: "",
                    prize: []
                },
            */
            let isPlayerSet = false
            let isPrizeSet = false
            state.playerRank.forEach((singleRankObj, index, playerRank) => {
                if (isPlayerSet) {
                    return
                }
                if (singleRankObj.playerName === state.playerNow) {
                    singleRankObj.prize.forEach((singlePrizeObj, index, singlePrize) => {
                        if (isPrizeSet) {
                            return
                        }
                        if (singlePrizeObj.prizeName === rollingResult.resultName) {
                            isPrizeSet = true
                            singlePrizeObj.prizeGetNum++

                        }
                    })
                    if (!isPrizeSet) {
                        let singlePrize = JSON.parse(JSON.stringify(state.singlePrizeTemplate))
                        singlePrize.prizeName = rollingResult.resultName
                        singlePrize.imgUrl = state.prizeNow.imgUrl
                        singlePrize.prizeGetNum++
                        singleRankObj.prize.push(singlePrize)
                    }
                    isPlayerSet = true
                }
            });
            if (!isPlayerSet) {
                // console.log('111');
                let singlePrize = JSON.parse(JSON.stringify(state.singlePrizeTemplate))
                let singleRank = JSON.parse(JSON.stringify(state.singleRankTemplate))
                singlePrize.prizeName = rollingResult.resultName
                singlePrize.imgUrl = state.prizeNow.imgUrl
                singlePrize.prizeGetNum++
                singleRank.prize.push(singlePrize)
                singleRank.playerName = state.playerNow
                state.playerRank.push(singleRank)
                console.log("singlePrize", singlePrize);

            }
            console.log("12345");
            this.dispatch("setNowPlayerRank")
            console.log("4567");

        },

        setNowPlayerRank({
            state
        }) {
            let displayPrize = []
            console.log("2323555",state.playerRank);

            state.playerRank.forEach((singleRankObj, index) => {
                if (displayPrize.length != 0) {
                    console.log('?', displayPrize);
                    return
                }
                console.log(singleRankObj);

                if (singleRankObj.playerName == state.playerNow) {
                    displayPrize = singleRankObj.prize
                }
            })

            this.commit('setSingleRank', {
                playerName: state.playerNow,
                prize: displayPrize
            })
        },
    },

    modules: {}
})