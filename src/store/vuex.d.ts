import { Store } from 'vuex'

// 声明自己的 store state
export interface State {
    playerRank: object[{
        playerName: string,
        prize: string[],
    }],
      singleRankTemplate: {
          playerName: '',
          prize: string[],
      },
      isONFirst: boolean,
      singleRank: {
          playerName: string,
          prize: string[],
      },
      singlePrizeTemplate: {
          prizeName: string,
          imgUrl: string,
          prizeGetNum: number,
      },
      prizeNow: {
          imgUrl: string,
          prizeName: string,
      },
      poorLuck: boolean,
      resultDiceNumArr: string[],
      playerNow: number,
      playerAmount: number,
      prizeName: string[],
      prizeRealName: string[],
      prizeImgUrl: string[],
}

declare module '@vue/runtime-core' {

  // 为 `this.$store` 提供类型声明
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}