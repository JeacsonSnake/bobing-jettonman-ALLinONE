import {
    createStore
} from 'vuex'
import type { State } from './vuex.d.ts';
import {
    getResult
} from '../util/result'

export const store = createStore<State>({
    state: {
        playerRank: [],
        singleRankTemplate: {
            playerName: '',
            prize: [],
        },
        isONFirst: true,
        singleRank: {
            playerName: '个人奖项',
            prize: [],
        },
        singlePrizeTemplate: {
            prizeName: '',
            imgUrl: '',
            prizeGetNum: 0,
        },
        prizeNow: {
            imgUrl: 'blank.svg',
            prizeName: '博空',
        },
        poorLuck: false,
        resultDiceNumArr: [],
        playerNow: -1,
        playerAmount: 0,
        prizeName: [
            'YiXiu',
            'ErJu',
            'SiJin',
            'SanHong',
            'DuiTang',
            'SiDianHong',
            'WuBoHei',
            'WuBoHong',
            'LiuBoHei',
            'BianDiJing',
            'LiuBoHong',
            'ZhuangYuanChaJinHua',
            'NULL',
        ],
        prizeRealName: [
            '一秀',
            '二举',
            '四进',
            '三红',
            '对堂!',
            '四点红!',
            '五子登科!',
            '红五王!',
            '六博黑!',
            '遍地锦!',
            '六博红!',
            '状元插金花!',
            '博空~',
        ],
        prizeImgUrl: [
            'yiXIU.svg',
            'erju.svg',
            'sijin.svg',
            'sanhong.svg',
            'duitang.svg',
            'sidianhong.svg',
            'wubohei.svg',
            'redotFIVE.svg',
            'blackdot-6.svg',
            'blossom-ONE.svg',
            'All-around-6.svg',
            'icing4+2.svg',
            'blank.svg',
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
                playerName: '个人奖项',
                prize: [],
            }
        },
        clearPlayerRank(state) {
            state.playerRank = []
        },
        setPlayerRank(state, rankValue) {
            state.playerRank = JSON.parse(JSON.stringify(rankValue))
        },
        setSingleRank(state, {
            playerName,
            prize
        }) {
            state.singleRank = {
                playerName,
                prize,
            }
            // console.log('state.singleRank', state.singleRank)
        },
        clearResultDiceNumArr(state) {
            state.resultDiceNumArr = []
        },
        setResultDiceNumArr(state, ResultDiceNumArr) {
            state.resultDiceNumArr = JSON.parse(JSON.stringify(ResultDiceNumArr))
        },
        setisONFirst(state, value) {
            state.isONFirst = value
        },
    },
    actions: {
        getNewRun({
            commit,
            state
        }, playerNum) {
            let localPlayersRank = localStorage.getItem('Bobing_playersRank')
            
            if (localPlayersRank) {
                // console.log('删掉了')
                localStorage.removeItem('Bobing_playersRank')
            }
            commit('changePlayerAmount', playerNum)
            commit('changePlayerNow', 0)
            commit('clearSingleRank')
            commit('clearPlayerRank')
            commit('clearResultDiceNumArr')
            commit('setisONFirst', true)
            // this.dispatch("getSinglePlayerRank", 1)
            // console.log(`getClear`);
        },

        getNextResult({
            state
        }) {
            if (state.playerNow == state.playerAmount) {
                state.playerNow = 1
                this.commit('setisONFirst', false)
            } else {
                state.playerNow++
            }
            let rollingResult = getResult(state.isONFirst)
            // console.log(`rollingResult`, rollingResult);
            state.prizeName.forEach((p, i) => {
                if (rollingResult.resultName == p) {
                    if (rollingResult.resultName == 'NULL') {
                        state.poorLuck = true
                    } else {
                        state.poorLuck = false
                    }
                    state.prizeNow.imgUrl = state.prizeImgUrl[i]
                    state.prizeNow.prizeName = state.prizeRealName[i]
                }
            })
            state.resultDiceNumArr = rollingResult.resultNum.split('')
            // console.log(`state.resultDiceNumArr`, state.resultDiceNumArr);
            this.dispatch('setPlayerRank', rollingResult)
        },

        setPlayerRank({
            state
        }, rollingResult) {
            if (state.poorLuck === true) {
                this.dispatch('setNowPlayerRank')
                return
            }
            let isPlayerSet = false
            let isPrizeSet = false
            state.playerRank.forEach((singleRankObj: { playerName: number; prize: [{ prizeName: string; imgUrl: string; prizeGetNum: number; }]; }, index: any, playerRank: any) => {
                if (isPlayerSet) {
                    return
                }
                if (singleRankObj.playerName === state.playerNow) {
                    singleRankObj.prize.forEach((singlePrizeObj: { prizeName: string; imgUrl: string; prizeGetNum: number; }, index, singlePrize) => {
                        if (isPrizeSet) {
                            return
                        }
                        if (singlePrizeObj.prizeName === rollingResult.resultName) {
                            isPrizeSet = true
                            singlePrizeObj.prizeGetNum++
                        }
                    })
                    if (!isPrizeSet) {
                        let singlePrize = JSON.parse(
                            JSON.stringify(state.singlePrizeTemplate)
                        )
                        singlePrize.prizeName = rollingResult.resultName
                        singlePrize.imgUrl = state.prizeNow.imgUrl
                        singlePrize.prizeGetNum++

                        // Find the correct index to insert the new prize based on prizeNameAll
                        let newPrizeIndex = state.prizeName.indexOf(rollingResult.resultName)
                        let insertIndex = singleRankObj.prize.findIndex(prize =>
                            state.prizeName.indexOf(prize.prizeName) < newPrizeIndex
                        );
                        if (insertIndex === -1) {
                            singleRankObj.prize.push(singlePrize); // If no such index is found, append to the end
                        } else {
                            singleRankObj.prize.splice(insertIndex, 0, singlePrize); // Insert at the correct position
                        }

                        // singleRankObj.prize.push(singlePrize)
                    }
                    isPlayerSet = true
                }
            })
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
                // console.log("singlePrize", singlePrize);
            }
            // console.log("12345");
            this.dispatch('setNowPlayerRank')
            // console.log("4567");
        },

        setNowPlayerRank({
            state
        }) {
            let displayPrize: string | any[] = []
            // console.log("2323555",state.playerRank);

            state.playerRank.forEach((singleRankObj: { playerName: number; prize: [{ prizeName: string; imgUrl: string; prizeGetNum: number; }]; }, index: any) => {
                if (displayPrize.length != 0) {
                    // console.log('?', displayPrize);
                    return
                }
                // console.log(singleRankObj);

                if (singleRankObj.playerName == state.playerNow) {
                    displayPrize = singleRankObj.prize
                }
            })

            this.commit('setSingleRank', {
                playerName: state.playerNow,
                prize: displayPrize,
            })

            let localPlayersRank = {
                playerRank: JSON.parse(JSON.stringify(state.playerRank)),
                playerNow: state.playerNow,
                playerAmount: state.playerAmount,
                resultDiceNumArr: JSON.parse(JSON.stringify(state.resultDiceNumArr)),
            }
            // console.log("localPlayersRank: ", localPlayersRank);
            localStorage.setItem(
                'Bobing_playersRank',
                JSON.stringify(localPlayersRank)
            )
            // console.log("Bobing_playersRank: ", localStorage.getItem("Bobing_playersRank"))
        },
    },

    modules: {},
})