<template>
  <div class="homePage">
    <div class="loadingPage" v-if="loadingVisible">
      <el-dialog
        v-model="loadingVisible"
        class="welcomeLayer"
        center
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <img src="../../public/image/title.png" alt="" class="ruleImg" />
      </el-dialog>
    </div>

    <nav>
      <div class="navBtnGroup">
        <el-button link :icon="ElIconSData" @click="getRan()">
          <span class="navBtnText">排行榜</span>
        </el-button>
        <el-button link :icon="ElIconRefresh" @click="getRestart()">
          <span class="navBtnText">重开一局</span>
        </el-button>
      </div>
      <div class="navBtnGroup">
        <el-button link :icon="ElIconTickets" @click="rulesVisible = true">
          <span class="navBtnText">博饼规则</span>
        </el-button>
        <el-button
          link
          :icon="ElIconIceCreamRound"
          @click="aboutVisible = true"
        >
          <span class="navBtnText">关于</span>
        </el-button>
      </div>
    </nav>

    <div class="mobileSpecificSection">
      <div class="titleImgSection">
        <img src="../../public/image/title.png" alt="" class="titleImg" />
      </div>
      <div class="bodySection">
        <div class="singleRankSection">
          <div class="playerName">
            <span>{{
              singleRankData.playerName == "个人奖项"
                ? singleRankData.playerName
                : `玩家 ${singleRankData.playerName}`
            }}</span>
          </div>
          <el-table
            :data="singleRankData.prize"
            class="prizeSection"
            :height="`calc(var(--heightRate) * 337)`"
            empty-text="还未获奖"
            :show-header="false"
          >
            <el-table-column property="imgUrl" width="40">
              <template v-slot="scope">
                <img
                  :src="getDiseImg(scope.row.imgUrl)"
                  alt=""
                  width="40"
                  height="40"
                />
              </template>
            </el-table-column>
            <el-table-column property="prizeGetNum" width="100">
            </el-table-column>
          </el-table>
        </div>
        <div class="diceDisplaySection">
          <div class="diceImgSection" v-for="(item, index) in diceNumArr">
            <img :src="getDiceImgByIndex(item)" alt="" />
          </div>
        </div>
        <div class="rollButtonSection">
          <div>
            下一位玩家为:
            {{
              playerNow == playerAmount || playerNow == "0"
                ? `玩家 1`
                : `玩家 ${playerNow + 1}`
            }}
          </div>
          <el-button @click="getNextPlayerResults()">
            <span>掷骰开博</span>
            <span>下一位!</span>
          </el-button>
        </div>
      </div>
    </div>

    <footer>
      <span>© Jeacson_She 2023-present All rights Reserved.</span>
    </footer>

    <div class="rankLayer">
      <el-dialog title="排行榜" v-model="rankVisible" center>
        <!-- <div class="rankSection"></div> -->
        <el-table
          :data="rankData"
          class="rankSection"
          empty-text="目前无人获奖"
        >
          <el-table-column
            property="playerName"
            label="玩家名"
            fixed
            min-width="50%"
          ></el-table-column>
          <el-table-column
            property="prize"
            label="获得奖项"
            :formatter="playerRankDataFormatter"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </el-dialog>
    </div>

    <div class="restartLayer">
      <el-dialog title="定义玩家数量" v-model="restartVisible" center>
        <div class="restartSection">
          <el-select
            placeholder="请选择(最多8人)"
            v-model="playerNum"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="item in playerNumOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>

        <template v-slot:footer>
          <el-button class="restartFooter" @click="start()">选好了!</el-button>
        </template>
      </el-dialog>
    </div>

    <div class="rulesLayer">
      <el-dialog title="博饼怎么玩?" v-model="rulesVisible" center>
        <div class="ruleSection">
          <span class="ruleIntro">
            博饼的规则如下:多人游戏中，选择玩家人数和决定玩家顺序后，点击按钮掷骰子。如果玩家所获得骰子点数与下表中的点数吻合，则判定赢得奖品。不同的点数对应不同等级的奖品，通常而言从次到好共分为“秀才”、“进士”、“探花”、“榜眼”、“状元”五等。若投出骰子点数符合多个等级，则以获得的最好等级为准。
            具体参见下表:
          </span>
          <!-- <img src="../../public/image/rule.png" alt="" class="ruleImg" /> -->
          <div class="ruleImg">
            <el-table :data="ruleData" style="width: 100%">
              <el-table-column prop="prize" label="奖项" min-width="15%" />
              <el-table-column prop="name" label="具体名称" min-width="20%" />
              <el-table-column
                prop="diceNumArr"
                label="骰子拟合图"
                min-width="30%"
              >
                <template #default="scope">
                  <img
                    :src="getDiceImgByIndex(item)"
                    v-for="(item, index) in scope.row.diceNumArr"
                    :key="index"
                    :alt="`index + ' '`"
                    class="diceImg"
                  />
                </template>
              </el-table-column>

              <el-table-column
                prop="description"
                label="描述"
                show-overflow-tooltip
                min-width="35%"
              />
            </el-table>
          </div>
          <span class="ruleIntro">
            注:由于“状元”等级较为稀有，且在“状元”条件下，由于越靠近表格底部的点数掷出概率越小，因此亦有“在已出现状元的情况下，博到越稀有点数者可以顺走前一状元奖品”的进阶规则。玩的开心!
          </span>
        </div>
      </el-dialog>
    </div>

    <div class="aboutLayer">
      <el-dialog title="关于" v-model="aboutVisible" center>
        <div class="aboutSection">
          <span class="aboutSection_Title">作者: </span>
          <span class="aboutSection_Name">Jeacson_Snake</span>
          <el-tooltip
            class="item"
            effect="dark"
            content="Go to Github"
            placement="top"
          >
            <el-link
              :underline="false"
              :icon="ElIconInfo"
              class="item"
              @click="jumpFrontEnd()"
            ></el-link>
          </el-tooltip>
        </div>
        <template v-slot:footer>
          <span>©Jeacson_She @2023-present all rights reserved.</span>
        </template>
      </el-dialog>
    </div>

    <div class="prizeResultLayer">
      <el-dialog v-model="prizeResultVisible" center :modal="false">
        <div class="prizeResultSection">
          <img :src="getDiseImg(prizeNow.imgUrl)" alt="" />
        </div>
        <template v-slot:footer>
          <span :class="{ poorLuck: poorLuck }">
            {{ prizeNow.prizeName }}
          </span>
        </template>
      </el-dialog>
    </div>

    <div class="welcomePage">
      <el-dialog
        title="欢迎来到博饼·状元筹!"
        v-model="welcomeVisible"
        class="welcomeLayer"
        center
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div class="welcomeSection">
          <div class="rootSection">
            <span class="title">什么是博饼?</span>
            <div class="info">
              <span class="intro">
                "博饼"是闽南地区在中秋节的一种传统习俗，它最早起源于福建厦门，后盛行于闽南地区和台湾省。其作为节日游戏，规则简单、公平，充满竞技悬念和生活情趣，一直深受分布在世界各地的广大群众喜爱。
              </span>
            </div>
          </div>
          <div class="ruleSection">
            <span class="title">怎么玩?</span>
            <div class="info mb">
              <span class="intro">
                博饼的规则如下:多人游戏中，选择玩家人数和决定玩家顺序后，点击按钮掷骰子。如果玩家所获得骰子点数与下表中的点数吻合，则判定赢得奖品。不同的点数对应不同等级的奖品，通常而言从次到好共分为“秀才”、“进士”、“探花”、“榜眼”、“状元”五等。若投出骰子点数符合多个等级，则以获得的最好等级为准。
                具体参见下表:
              </span>
              <!-- <img src="../../public/image/rule.png" alt="" class="ruleImg" /> -->
              <div class="ruleImg">
                <el-table :data="ruleData" style="width: 100%">
                  <el-table-column prop="prize" label="奖项" min-width="15%" />
                  <el-table-column
                    prop="name"
                    label="具体名称"
                    min-width="20%"
                  />
                  <el-table-column
                    prop="diceNumArr"
                    label="骰子拟合图"
                    min-width="30%"
                  >
                    <template #default="scope">
                      <img
                        :src="getDiceImgByIndex(item)"
                        v-for="(item, index) in scope.row.diceNumArr"
                        :key="index"
                        :alt="`index + ' '`"
                        class="diceImg"
                      />
                    </template>
                  </el-table-column>

                  <el-table-column
                    prop="description"
                    label="描述"
                    show-overflow-tooltip
                    min-width="35%"
                  />
                </el-table>
              </div>
              <span class="intro">
                注:由于“状元”等级较为稀有，且在“状元”条件下，由于越靠近表格底部的点数掷出概率越小，因此亦有“在已出现状元的情况下，博到越稀有点数者可以顺走前一状元奖品”的进阶规则。
              </span>
            </div>
          </div>
        </div>

        <template v-slot:footer>
          <div>
            <div class="title">即刻开始?</div>
            <el-button class="btn" @click="restartVisible = true">
              开始游戏
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, computed, onMounted, onBeforeMount, readonly, type ComponentOptionsBase, type ComponentPublicInstance, type Ref } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox, type LoadingParentElement } from 'element-plus'
import {
  InfoFilled as ElIconInfo,
  Histogram as ElIconSData,
  Refresh as ElIconRefresh,
  Tickets as ElIconTickets,
  IceCreamRound as ElIconIceCreamRound,
} from "@element-plus/icons-vue";

import { ElLoading } from "element-plus";

export default {
    
  setup() {
    const store = useStore();
    
    const prizeResultVisible=ref(false);
    const aboutVisible=ref(false);
    const rulesVisible=ref(false);
    const rankVisible=ref(false);
    const restartVisible=ref(false);
    const welcomeVisible=ref(false);
    const loadingVisible=ref(true);
    const playerNum=ref("");

    const playerNumOptions = readonly([
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
    ]);

        
    const ruleData = readonly([
            {
                prize: "秀才",
                name: "一秀",
                diceNumArr: ["4"],
                description: "六个骰子中有且仅有一个骰子点数为四",
            },
            {
                prize: "举人",
                name: "二举",
                diceNumArr: ["4", "4"],
                description: "六个骰子中有且仅有两个骰子点数为四",
            },
            {
                prize: "进士",
                name: "四进",
                diceNumArr: ["2", "2", "2", "2"],
                description: "六个骰子中有四个骰子拥有除了四以外的相同点数",
            },
            {
                prize: "探花",
                name: "三红",
                diceNumArr: ["4", "4", "4"],
                description: "六个骰子中有三个骰子点数为四",
            },
            {
                prize: "榜眼",
                name: "对堂",
                diceNumArr: ["1", "2", "3", "4", "5", "6"],
                description: "六个骰子点数按顺序排出",
            },
            {
                prize: "状元",
                name: "四点红",
                diceNumArr: ["4", "4", "4", "4"],
                description: "六个骰子中有四个骰子点数为四",
            },
            {
                prize: "状元",
                name: "五子登科",
                diceNumArr: ["2", "2", "2", "2", "2"],
                description: "六个骰子中有五个骰子拥有除了四、一以外的相同点数",
            },
            {
                prize: "状元",
                name: "五王",
                diceNumArr: ["4", "4", "4", "4", "4"],
                description: "六个骰子中有五个骰子点数为四",
            },
            {
                prize: "状元",
                name: "六博黑",
                diceNumArr: ["2", "2", "2", "2", "2", "2"],
                description: "六个骰子皆拥有除了四、一以外的相同点数",
            },
            {
                prize: "状元",
                name: "遍地锦",
                diceNumArr: ["1", "1", "1", "1", "1", "1"],
                description: "六个骰子点数皆为一",
            },
            {
                prize: "状元",
                name: "六博红",
                diceNumArr: ["4", "4", "4", "4", "4", "4"],
                description: "六个骰子点数皆为四",
            },
            {
                prize: "状元",
                name: "状元插金花",
                diceNumArr: ["4", "4", "4", "4", "1", "1"],
                description: "六个骰子中有四个骰子点数为四，且剩余两个骰子点数为一",
            },
      ]);

    const rankData = computed(() => store.state.playerRank);
    const singleRankData = computed(() => store.state.singleRank);
    const diceNumArr = computed(() => store.state.resultDiceNumArr);
    const playerNow = computed(() => store.state.playerNow);
    const prizeNow = computed(() => store.state.prizeNow);
    const poorLuck = computed(() => store.state.poorLuck);
    const playerAmount = computed(() => store.state.playerAmount);

    const jumpFrontEnd = () => {
      window.open(
        "https://github.com/JeacsonSnake/bobing-jettonman-ALLinONE",
        "_blank"
      );
    };

    const getDiseImg = (imgUrl:string) => {
      return `${import.meta.env.BASE_URL}image/${imgUrl}`;
    };

    const getDiceImgByIndex = (index:string) => {
      let imgUrl = "dice/DICE-" + index + ".svg";
      return getDiseImg(imgUrl);
    };

    const getRan = () => {
       rankVisible.value = true;
    };

    const getRestart = () => {
       restartVisible.value = true;
    };

    const start = () => {
      let p =  playerNum.value;
      if (p == "") {
        ElMessage.error("人数尚未确定!");
      } else {
        ElMessageBox.confirm("你将开启新一轮游戏，确定吗?", "注意", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          confirmButtonClass: "confirmButton",
          cancelButtonClass: "cancelButton",
        })
          .then(() => {
            setTimeout(() => {
               restartVisible.value = false;
               welcomeVisible.value = false;
            }, 100);
            const loading = startLoading("创建中...");
            setTimeout(() => {
              store
                .dispatch("getNewRun", p)
                .then(() => {
                  setTimeout(() => {
                    endLoading(loading);
                    ElMessage({
                      type: "success",
                      message: "已创建新一轮游戏!",
                    });
                  }, 400);
                })
                .catch((action) => {});
            }, 300);
          })
          .catch((err) => {
            if (err == "cancel") {
              ElMessage({
                type: "info",
                message: "已取消开启新一轮游戏",
              });
            }
          });
      }
    };

    const getNextPlayerResults = () => {
      if (playerNow.value == -1) {
         restartVisible.value = true;
        ElMessage({
          type: "error",
          message: "The number of players is not set yet!",
        });
      } else {
        const loading = startLoading("掷骰入碗...");
        setTimeout(() => {
          store
            .dispatch("getNextResult")
            .then(() => {
              setTimeout(() => {
                endLoading(loading);
              }, 400);
            })
            .then(() => {
              setTimeout(() => {
                 prizeResultVisible.value = true;
              }, 700);
            });
        }, 300);
      }
    };

    const startLoading = (loadingText:string) => {
      const loading = ElLoading.service({
        lock: true,
        target: ".homePage",
        text: loadingText,
        background: "rgba(200, 200, 200, 1)",
      });
      return loading;
    };

    const endLoading = (loading: { setText?: (text: string) => void; removeElLoadingChild?: () => void; close: any; handleAfterLeave?: () => void; vm?: ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}>, {}, {}>; $el?: HTMLElement; originalPosition?: Ref<string>; originalOverflow?: Ref<string>; visible?: Ref<boolean>; parent?: Ref<LoadingParentElement>; background?: Ref<string>; svg?: Ref<string>; svgViewBox?: Ref<string>; spinner?: Ref<string | boolean>; text?: Ref<string>; fullscreen?: Ref<boolean>; lock?: Ref<boolean>; customClass?: Ref<string>; target?: Ref<HTMLElement>; beforeClose?: Ref<(() => boolean) | undefined> | undefined; closed?: Ref<(() => void) | undefined> | undefined; }) => {
      loading.close();
    };

    const playerRankDataFormatter = (row: any, column: any, cellValue: any[], index: any) => {
      let formattedCellValue = "";
      cellValue.forEach((singlePrizeObj: { prizeName: any; prizeGetNum: string; }) => {
        let prizeRealName = "";
        store.state.prizeName.forEach((SingleRealName: any, index: string | number) => {
          if (SingleRealName === singlePrizeObj.prizeName) {
            prizeRealName = store.state.prizeRealName[index];
          }
        });
        formattedCellValue += prizeRealName;
        formattedCellValue += "*";
        formattedCellValue += singlePrizeObj.prizeGetNum;
        formattedCellValue += ", ";
      });
      return formattedCellValue.slice(0, -2);
    };

    onBeforeMount(() => {
      // this.restartVisible = true;
      // this.loadingVisible = true;
    }),
    
    onMounted(() => {
        let localPlayersRankJSON = localStorage.getItem("Bobing_playersRank")
        if (localPlayersRankJSON) {
            let localPlayersRank = JSON.parse(localPlayersRankJSON);
          const loading = startLoading("正在读取存档...");
          setTimeout(() => {
            store.commit("changePlayerAmount", localPlayersRank.playerAmount);
            store.commit("changePlayerNow", localPlayersRank.playerNow);
            store.commit("setPlayerRank", localPlayersRank.playerRank);
            store.commit(
              "setResultDiceNumArr",
              localPlayersRank.resultDiceNumArr
            );
            store.dispatch("setNowPlayerRank");
             loadingVisible.value = false;
          }, 2000);
          setTimeout(() => {
            endLoading(loading);
          }, 2500);
        } else {
          const loading = startLoading("加载中...");
          setTimeout(() => {
             welcomeVisible.value = true;
             loadingVisible.value = false;
          }, 2000);
          setTimeout(() => {
            endLoading(loading);
          }, 2500);
        }
      });

    return {
        prizeResultVisible,
        aboutVisible,
        rulesVisible,
        rankVisible,
        restartVisible,
        welcomeVisible,
        loadingVisible,
        playerNum,
        playerNumOptions,
      ruleData,
      ElIconInfo,
      ElIconSData,
      ElIconRefresh,
      ElIconTickets,
      ElIconIceCreamRound,
      rankData,
      singleRankData,
      diceNumArr,
      playerNow,
      prizeNow,
      poorLuck,
      playerAmount,
      jumpFrontEnd,
      getDiseImg,
      getDiceImgByIndex,
      getRan,
      getRestart,
      start,
      getNextPlayerResults,
      startLoading,
      endLoading,
      playerRankDataFormatter,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../style/variables.scss";
.homePage {
  font-family: "HarmonyOS_Sans_SC_Medium", Avenir, Helvetica, Arial, sans-serif;
  --heightRate: calc(100vh / #{$base-height});
  --widthRate: calc(100vw / #{$base-width});
  width: inherit;
  height: 100vh;
  background-image: url("../../public/image/homepage_background_img.png");
  background-color: rgba(242, 242, 242, 0.5);

  nav {
    width: calc(var(--widthRate) * 1920);
    height: calc(var(--heightRate) * 62);
    background: rgba(204, 204, 204, 0);
    border-bottom: 1px solid rgb(0, 0, 0);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .navBtnGroup {
      height: inherit;
      display: flex;

      button {
        margin: 0 calc(var(--heightRate) * 25);
        padding: 0;
        color: #4d4747;
        font-family: "HarmonyOS_Sans_SC_Medium";
        font-size: calc(var(--heightRate) * 30);
      }

      .navBtnText {
        display: inline;
        @media (aspect-ratio < calc(830 / 1080)) {
          display: none;
        }
      }
    }
  }

  .mobileSpecificSection {
    @media (aspect-ratio < calc(1100 / 1080)) {
      display: flex;
      flex-direction: column;
    }
  }

  .titleImgSection {
    width: 100vw;
    height: fit-content;
    height: -moz-fit-content;
    display: flex;
    justify-content: center;
    align-items: center;

    .titleImg {
      max-width: calc(var(--widthRate) * 1120);
      max-height: calc(var(--heightRate) * 330);
      padding: calc(var(--heightRate) * 22) 0 calc(var(--heightRate) * 22)
        calc(var(--heightRate) * 30);
      @media (aspect-ratio < calc(1100 / 1080)) {
        padding: calc(var(--heightRate) * 10) 0;
        max-width: calc(var(--widthRate) * 1350);
        max-height: calc(var(--heightRate) * 330);
      }
    }
  }

  .bodySection {
    width: calc(var(--widthRate) * 1920);
    height: calc(var(--heightRate) * 520);
    margin-top: calc(var(--heightRate) * 30);
    display: flex;
    justify-content: space-around;
    align-items: center;

    @media (aspect-ratio < calc(1100 / 1080)) {
      height: calc(var(--heightRate) * 695);
      margin-top: calc(var(--heightRate) * 15);
      flex-direction: column;
      justify-content: space-evenly;
    }

    @media (aspect-ratio < calc(980 / 1080)) {
      height: calc(var(--heightRate) * 695);
    }

    @media (aspect-ratio < calc(600 / 1080)) {
      //   height: calc(var(--heightRate) * 800);
    }

    .singleRankSection {
      width: calc(var(--widthRate) * 322);
      //   margin-left: calc(var(--widthRate) * 56);
      background-color: rgba(204, 204, 204, 1);
      border: calc(var(--heightRate) * 2) solid rgba(77, 71, 71, 1);
      box-shadow: 9px 15px 44px rgba(0, 0, 0, 0.25);
      border-radius: calc(var(--heightRate) * 20);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      overflow: hidden;
      @media (aspect-ratio < calc(1821 / 1080)) {
        display: none;
      }

      .playerName {
        font-family: "HarmonyOS_Sans_SC_Black";
        margin-top: calc(var(--heightRate) * 17);
        padding-bottom: calc(var(--heightRate) * 12);
        font-size: calc(var(--heightRate) * 54);
        width: calc(var(--widthRate) * 242);
        height: calc(var(--heightRate) * 90);
        // border-bottom: calc(var(--heightRate) * 3) solid rgba(166, 166, 166, 1);
      }

      .prizeSection {
        display: flex;
        border-radius: calc(var(--heightRate) * 40) calc(var(--heightRate) * 40)
          0 0;
        background-color: #dfdfdf;
        align-items: center;
        justify-content: center;

        :deep(.el-table__inner-wrapper) {
          .el-table__body-wrapper {
            &::-webkit-scrollbar {
              width: calc(var(--heightRate) * 8);
            }

            &::-webkit-scrollbar-track {
              border-radius: calc(var(--heightRate) * 1);
              background-color: #e5e5e5;
            }

            &::-webkit-scrollbar-corner {
              background-color: #f0f0f0;
            }

            &::-webkit-scrollbar-thumb {
              border-radius: 4px;
              background-color: #c5c5c5;
            }

            .el-scrollbar
              .el-scrollbar__wrap
              .el-scrollbar__view
              .el-table__body {
              width: inherit !important;
              display: flex;
              justify-content: center;
              colgroup {
                display: none;
              }

              tbody tr {
                background-color: #dfdfdf;
                .el-table__cell {
                  border-bottom: 1px solid rgb(191, 195, 202);
                }
                td {
                  &:first-child .cell {
                    height: calc(var(--heightRate) * 57);
                    width: calc(var(--widthRate) * 185);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }

                  &:last-child .cell {
                    height: calc(var(--heightRate) * 57);
                    width: calc(var(--widthRate) * 132);
                    display: flex;
                    justify-content: center;
                    font-size: calc(var(--heightRate) * 40);
                    align-items: center;
                  }
                }
              }
            }

            .el-table__empty-block {
              //   width: 100% !important;
              line-height: calc(var(--heightRate) * 36);
              height: calc(var(--heightRate) * 36);
              font-size: calc(var(--heightRate) * 36);
            }
          }
        }
      }
    }

    .diceDisplaySection {
      width: calc(var(--widthRate) * 1000);
      height: calc(var(--heightRate) * 480);
      background-color: rgba(204, 204, 204, 1);
      border: calc(var(--heightRate) * 2) solid rgba(71, 72, 76, 1);
      box-shadow: 8px 10px 32px rgba(0, 0, 0, 0.25);
      border-radius: calc(var(--heightRate) * 20);
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, auto);
      justify-items: center;
      align-items: center;

      @media (aspect-ratio < calc(1100 / 1080)) {
        width: calc(var(--widthRate) * 1050);
        height: calc(var(--heightRate) * 400);
        flex-direction: column;
      }

      @media (aspect-ratio < calc(980 / 1080)) {
        width: calc(var(--widthRate) * 1200);
        height: calc(var(--heightRate) * 400);
      }

      @media (aspect-ratio < calc(800 / 1080)) {
        width: calc(var(--widthRate) * 1400);
        height: calc(var(--heightRate) * 400);
      }

      @media (aspect-ratio < calc(600 / 1080)) {
        width: calc(var(--widthRate) * 1650);
        height: calc(var(--heightRate) * 340);
      }

      .diceImgSection {
        max-width: calc(var(--heightRate) * 200);
        padding: calc(var(--heightRate) * 20);
        display: flex;
        text-align: center;
        @media (aspect-ratio < calc(1821 / 1080)) {
          padding: calc(var(--heightRate) * 15);
        }

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .rollButtonSection {
      width: calc(var(--widthRate) * 300);
      height: calc(var(--heightRate) * 330);
      //   margin-left: calc(var(--widthRate) * 82);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      @media (aspect-ratio < calc(1821 / 1080)) {
        width: calc(var(--widthRate) * 500);
      }

      @media (aspect-ratio < calc(1100 / 1080)) {
        width: calc(var(--widthRate) * 650);
        height: calc(var(--heightRate) * 250);
        flex-direction: column;
      }

      @media (aspect-ratio < calc(980 / 1080)) {
        height: calc(var(--heightRate) * 250);
        width: calc(var(--widthRate) * 850);
      }

      @media (aspect-ratio < calc(770 / 1080)) {
        width: calc(var(--widthRate) * 1050);
      }

      @media (aspect-ratio < calc(600 / 1080)) {
        width: calc(var(--widthRate) * 1050);
      }
      :deep(.el-button) {
        width: inherit;
        padding: 0;
        height: inherit;
        border-radius: calc(var(--heightRate) * 20);
        background: #de5757;
        border: 1px solid rgba(71, 72, 76, 1);
        word-wrap: break-word;
        word-break: normal;
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          margin: 0;
          padding: 0;
          word-break: normal;
          justify-content: center;
          width: auto;
          display: flex;
          white-space: pre-wrap;
          word-wrap: break-word;
          width: inherit;
          height: calc(var(--heightRate) * 180);
          font-size: calc(var(--heightRate) * 64);
          color: rgba(242, 242, 242, 1);
          line-height: calc(var(--heightRate) * 100);
          flex-direction: column;
          @media (aspect-ratio < calc(500 / 1080)) {
            font-size: calc(var(--heightRate) * 50);
          }
        }
      }
    }
  }

  .aboutLayer {
    :deep(.el-dialog) {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: space-around;
      align-items: center;
      width: calc(var(--widthRate) * 1280);
      height: calc(var(--heightRate) * 960);
      margin: 0;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: calc(var(--heightRate) * 20);
      background: rgba(240, 240, 240, 1);
      @media (aspect-ratio < calc(1100 / 1080)) {
        width: calc(var(--widthRate) * 1650);
        height: calc(var(--heightRate) * 750);
      }
      @media (aspect-ratio < calc(750 / 1080)) {
        width: calc(var(--widthRate) * 1850);
        height: calc(var(--heightRate) * 750);
      }
    }

    :deep(.el-dialog__header) {
      padding: 0;
      .el-dialog__headerbtn:focus .el-dialog__close,
      .el-dialog__headerbtn:hover .el-dialog__close {
        color: #de5757;
      }

      .el-dialog__title {
        font-family: "HarmonyOS_Sans_SC_Black";
        height: calc(var(--heightRate) * 100);
        line-height: calc(var(--heightRate) * 100);
        font-size: calc(var(--heightRate) * 100);
        @media (aspect-ratio < calc(1660 / 1080)) {
          font-size: calc(var(--heightRate) * 72);
          height: calc(var(--heightRate) * 72);
          line-height: calc(var(--heightRate) * 72);
        }
      }
    }

    :deep(.el-dialog__body) {
      padding: 0;
      @media (aspect-ratio < calc(1100 / 1080)) {
      }
    }

    :deep(.el-dialog__footer) {
      padding: 0;
      padding-top: calc(var(--heightRate) * 80);
      font-size: 0.5rem;
      height: 0.5rem;
      line-height: 0.5rem;
    }

    .aboutSection {
      font-family: "HarmonyOS_Sans_SC_Black";
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: calc(var(--heightRate) * 80);
      font-size: calc(var(--heightRate) * 48);
      @media (aspect-ratio < calc(750 / 1080)) {
        font-size: calc(var(--heightRate) * 48);
      }
      @media (aspect-ratio < calc(570 / 1080)) {
        font-size: calc(var(--heightRate) * 36);
      }
      .aboutSection_Title {
        padding-right: calc(var(--heightRate) * 30);
      }

      .aboutSection_Name {
        color: #fafafa;
        -webkit-text-stroke: calc(var(--heightRate) * 2) rgba(117, 117, 117, 1);
        text-shadow: calc(var(--heightRate) * 3) calc(var(--heightRate) * 2)
          calc(var(--heightRate) * 9) rgba(0, 0, 0, 0.25);
        padding-right: calc(var(--heightRate) * 40);
      }

      .item {
        cursor: pointer;
        text-shadow: calc(var(--heightRate) * 3) calc(var(--heightRate) * 2)
          calc(var(--heightRate) * 9) rgba(0, 0, 0, 0.25);
        font-size: calc(var(--heightRate) * 48);
      }
    }
  }

  .rulesLayer {
    position: fixed;
    height: fit-content;
    height: -moz-fit-content;
    z-index: 10;
    :deep(.el-overlay-dialog) {
      height: 120vh;
      position: absolute;
    }
    :deep(.el-dialog) {
      padding: 0;
      margin: 0;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: calc(var(--widthRate) * 1280);
      height: fit-content;
      height: -moz-fit-content;
      border-radius: calc(var(--heightRate) * 20);
      background: rgba(240, 240, 240, 1);
      @media (aspect-ratio < calc(1300 / 1080)) {
        top: 42%;
        width: calc(var(--widthRate) * 1680);
      }
      @media (aspect-ratio < calc(980 / 1080)) {
        width: calc(var(--widthRate) * 1680);
      }
      @media (aspect-ratio < calc(800 / 1080)) {
        width: calc(var(--widthRate) * 1800);
        height: fit-content;
        height: -moz-fit-content;
      }
      @media (aspect-ratio < calc(600 / 1080)) {
        top: 42%;
      }
    }

    :deep(.el-dialog__header) {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      height: calc(var(--heightRate) * 80);
      line-height: calc(var(--heightRate) * 80);
      padding-top: calc(var(--heightRate) * 30);
      padding-bottom: calc(var(--heightRate) * 5);
      @media (aspect-ratio < calc(800 / 1080)) {
        height: calc(var(--heightRate) * 60);
        line-height: calc(var(--heightRate) * 60);
      }

      .el-dialog__headerbtn:focus .el-dialog__close,
      .el-dialog__headerbtn:hover .el-dialog__close {
        color: #de5757;
      }

      .el-dialog__title {
        font-family: "HarmonyOS_Sans_SC_Bold";
        height: calc(var(--heightRate) * 80);
        line-height: calc(var(--heightRate) * 80);
        font-size: calc(var(--heightRate) * 80);
        color: #757575;
        @media (aspect-ratio < calc(800 / 1080)) {
          height: calc(var(--heightRate) * 60);
          line-height: calc(var(--heightRate) * 60);
          font-size: calc(var(--heightRate) * 60);
        }
        @media (aspect-ratio < calc(410 / 1080)) {
          height: 3rem;
          line-height: 3rem;
          font-size: 3rem;
        }
      }
    }

    :deep(.el-dialog__body) {
      padding: 0;
      margin: 0;
      display: flex;
      justify-content: center;
      padding-top: calc(var(--heightRate) * 20);
      padding-bottom: calc(var(--heightRate) * 20);
      width: inherit;
      height: fit-content;
      height: -moz-fit-content;
    }

    .ruleSection {
      padding: 0;
      margin: 0;
      width: calc(var(--widthRate) * 1110);
      height: fit-content;
      height: -moz-fit-content;
      border-radius: calc(var(--heightRate) * 20);
      border: 2px solid rgba(77, 71, 71, 1);
      display: flex;
      flex-direction: column;
      align-content: center;
      align-items: center;
      @media (aspect-ratio < calc(1300 / 1080)) {
        width: calc(var(--widthRate) * 1560);
        margin: 0 calc(var(--widthRate) * 100) 0 calc(var(--widthRate) * 100);
      }
      @media (aspect-ratio < calc(800 / 1080)) {
        width: calc(var(--widthRate) * 1700);
      }

      .ruleIntro {
        padding: calc(var(--heightRate) * 10) calc(var(--heightRate) * 10);
        word-wrap: break-word;
        word-break: normal;
        line-height: calc(var(--heightRate) * 25);
        font-size: calc(var(--heightRate) * 20);
        @media (aspect-ratio < calc(1100 / 1080)) {
          line-height: calc(var(--heightRate) * 20);
          font-size: calc(var(--heightRate) * 17);
        }

        @media (aspect-ratio < calc(885 / 1080)) {
          line-height: calc(var(--heightRate) * 17);
          font-size: calc(var(--heightRate) * 15);
        }

        @media (aspect-ratio < calc(800 / 1080)) {
          line-height: calc(var(--heightRate) * 15);
          font-size: calc(var(--heightRate) * 12);
        }

        @media (aspect-ratio < calc(510 / 1080)) {
          line-height: calc(var(--heightRate) * 12);
          font-size: calc(var(--heightRate) * 10);
        }
      }

      .ruleImg {
        width: calc(var(--widthRate) * 1053);
        height: fit-content;
        height: -moz-fit-content;
        @media (aspect-ratio < calc(1300 / 1080)) {
          width: 98%;
          margin: 0 calc(var(--widthRate) * 20) 0 calc(var(--widthRate) * 20);
        }

        :deep(.el-table) {
          border: calc(var(--heightRate) * 4) solid #c5c5c5;
          border-radius: calc(var(--heightRate) * 10);
          background-color: transparent;
          tr {
            background-color: #f0f0f0;
          }
          th {
            background-color: #f0f0f0;
          }
          .el-table__inner-wrapper {
            .el-table__header-wrapper {
              .el-table__header {
                tr {
                  th {
                    border-left: calc(var(--widthRate) * 2) solid #c5c5c5;
                    border-bottom: calc(var(--widthRate) * 2) solid #c5c5c5;
                    &:first-child {
                      border-left: 0;
                    }
                    &:last-child > td {
                      border-bottom: 0;
                    }
                    .cell {
                      padding: 0;
                      margin: 0;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      flex-wrap: nowrap;
                      flex-direction: row;
                      line-height: calc(var(--heightRate) * 50);
                      height: calc(var(--heightRate) * 50);
                      color: #4d4747;
                      font-size: calc(var(--heightRate) * 40);
                      @media (aspect-ratio < calc(2300 / 1080)) {
                        line-height: calc(var(--heightRate) * 40);
                        height: calc(var(--heightRate) * 40);
                        font-size: calc(var(--heightRate) * 30);
                      }
                      @media (aspect-ratio < calc(1770 / 1080)) {
                        line-height: calc(var(--heightRate) * 32);
                        height: calc(var(--heightRate) * 32);
                        font-size: calc(var(--heightRate) * 25);
                      }
                      @media (aspect-ratio < calc(1530 / 1080)) {
                        line-height: calc(var(--heightRate) * 30);
                        height: calc(var(--heightRate) * 30);
                        font-size: calc(var(--heightRate) * 22);
                      }
                      @media (aspect-ratio < calc(1390 / 1080)) {
                        line-height: calc(var(--heightRate) * 28);
                        height: calc(var(--heightRate) * 28);
                        font-size: calc(var(--heightRate) * 20);
                      }
                      @media (aspect-ratio < calc(1300 / 1080)) {
                        line-height: calc(var(--heightRate) * 25);
                        height: calc(var(--heightRate) * 25);
                        font-size: calc(var(--heightRate) * 15);
                      }
                      @media (aspect-ratio < calc(950 / 1080)) {
                        line-height: calc(var(--heightRate) * 30);
                        height: calc(var(--heightRate) * 30);
                        font-size: calc(var(--heightRate) * 20);
                      }
                      @media (aspect-ratio < calc(950 / 1080)) {
                        line-height: calc(var(--heightRate) * 30);
                        height: calc(var(--heightRate) * 30);
                        font-size: calc(var(--heightRate) * 17);
                      }
                      @media (aspect-ratio < calc(730 / 1080)) {
                        line-height: calc(var(--heightRate) * 23);
                        height: calc(var(--heightRate) * 23);
                        font-size: calc(var(--heightRate) * 15);
                      }
                      @media (aspect-ratio < calc(665 / 1080)) {
                        line-height: 1rem;
                        height: 1rem;
                        font-size: 0.8rem;
                      }
                      @media (aspect-ratio < calc(520 / 1080)) {
                        line-height: 0.7rem;
                        height: 0.7rem;
                        font-size: 0.7rem;
                      }
                      @media (aspect-ratio < calc(420 / 1080)) {
                        line-height: 0.7rem;
                        height: 0.7rem;
                        font-size: 0.4rem;
                      }
                      @media (aspect-ratio < calc(330 / 1080)) {
                        line-height: 0.4rem;
                        height: 0.4rem;
                        font-size: 0.3rem;
                      }
                    }
                  }
                }
              }
            }
            .el-table__body-wrapper {
              .el-table__row {
                td {
                  border-left: calc(var(--widthRate) * 2) solid #c5c5c5;
                  border-bottom: calc(var(--widthRate) * 2) solid #c5c5c5;
                  &:first-child {
                    border-left: 0;
                    .cell {
                      padding-left: 0;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      flex-wrap: nowrap;
                      flex-direction: row;
                    }
                  }
                }
                &:last-child > td {
                  border-bottom: 0;
                }
                td > .cell {
                  padding: 0;
                  margin: 0;
                  line-height: calc(var(--heightRate) * 35);
                  height: calc(var(--heightRate) * 35);
                  padding-left: calc(var(--widthRate) * 35);
                  color: #4d4747;
                  font-size: calc(var(--heightRate) * 24);
                  @media (aspect-ratio < calc(2300 / 1080)) {
                    line-height: calc(var(--heightRate) * 30);
                    height: calc(var(--heightRate) * 30);
                    font-size: calc(var(--heightRate) * 20);
                  }
                  @media (aspect-ratio < calc(2000 / 1080)) {
                    line-height: calc(var(--heightRate) * 28);
                    height: calc(var(--heightRate) * 28);
                    font-size: calc(var(--heightRate) * 18);
                  }

                  @media (aspect-ratio < calc(1390 / 1080)) {
                    line-height: calc(var(--heightRate) * 25);
                    height: calc(var(--heightRate) * 25);
                    font-size: calc(var(--heightRate) * 17);
                  }
                  @media (aspect-ratio < calc(730 / 1080)) {
                    line-height: calc(var(--heightRate) * 23);
                    height: calc(var(--heightRate) * 23);
                    font-size: calc(var(--heightRate) * 13);
                  }
                  @media (aspect-ratio < calc(600 / 1080)) {
                    line-height: calc(var(--heightRate) * 17);
                    height: calc(var(--heightRate) * 17);
                    font-size: calc(var(--heightRate) * 10);
                  }
                }
                :nth-child(2) > .cell {
                  @media (aspect-ratio < calc(730 / 1080)) {
                    width: max-content;
                  }
                }
                :nth-child(3) > .cell {
                  img {
                    height: calc(var(--heightRate) * 35);
                    padding-right: calc(var(--widthRate) * 10);
                    @media (aspect-ratio < calc(2530 / 1080)) {
                      height: calc(var(--heightRate) * 32);
                    }
                    @media (aspect-ratio < calc(2300 / 1080)) {
                      height: calc(var(--heightRate) * 30);
                    }
                    @media (aspect-ratio < calc(2000 / 1080)) {
                      height: calc(var(--heightRate) * 28);
                    }
                    @media (aspect-ratio < calc(1840 / 1080)) {
                      height: calc(var(--heightRate) * 23);
                    }
                    @media (aspect-ratio < calc(1570 / 1080)) {
                      height: calc(var(--heightRate) * 20);
                    }
                    @media (aspect-ratio < calc(1390 / 1080)) {
                      height: calc(var(--heightRate) * 17);
                    }
                    @media (aspect-ratio < calc(1220 / 1080)) {
                      height: calc(var(--heightRate) * 15);
                    }
                    @media (aspect-ratio < calc(640 / 1080)) {
                      width: max-content;
                      height: calc(var(--heightRate) * 13);
                    }
                    @media (aspect-ratio < calc(600 / 1080)) {
                      height: calc(var(--heightRate) * 7);
                    }
                  }
                }
              }
            }
          }
          .el-popper {
            font-size: 0.7rem;
          }
        }
      }
    }

    :deep(.el-dialog__footer) {
      padding: 0;
      padding-top: calc(var(--heightRate) * 140);
      font-size: calc(var(--heightRate) * 14);
    }
  }

  .rankLayer {
    :deep(.el-dialog) {
      position: fixed;
      top: 35%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: calc(var(--widthRate) * 1280);
      height: fit-content;
      height: -moz-fit-content;
      background-color: #f0f0f0;
      border-radius: calc(var(--heightRate) * 20);
      @media (aspect-ratio < calc(860 / 1080)) {
        min-width: calc(var(--widthRate) * 1450);
      }
      @media (aspect-ratio < calc(680 / 1080)) {
        min-width: calc(var(--widthRate) * 1920);
      }
    }

    :deep(.el-dialog__header) {
      display: flex;
      padding: 0;
      padding-top: calc(var(--heightRate) * 32);
      padding-left: calc(var(--heightRate) * 32);

      .el-dialog__headerbtn:focus .el-dialog__close,
      .el-dialog__headerbtn:hover .el-dialog__close {
        color: #de5757;
      }

      .el-dialog__title {
        font-family: "HarmonyOS_Sans_SC_Black";
        font-size: calc(var(--heightRate) * 72);
        color: #47484c;
      }
    }

    :deep(.el-dialog__body) {
      padding: calc(var(--heightRate) * 30);
      padding-top: calc(var(--heightRate) * 40);
      height: calc(var(--heightRate) * 800);
      margin: 0;
      display: flex;
      justify-content: center;

      @media (aspect-ratio < calc(680 / 1080)) {
        height: calc(var(--heightRate) * 600);
      }

      .rankSection {
        height: inherit;
      }

      .el-table {
        border-radius: calc(var(--heightRate) * 20);
      }

      .el-table th.el-table__cell {
        background-color: #dedede;
      }
    }
  }

  .restartLayer {
    :deep(.el-dialog) {
      margin: 0;
      background-color: #f0f0f0;
      border-radius: calc(var(--heightRate) * 20);
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: calc(var(--widthRate) * 420);
      min-height: calc(var(--heightRate) * 550);
      @media (aspect-ratio < calc(2020 / 1080)) {
        max-width: calc(var(--widthRate) * 500);
      }
      @media (aspect-ratio < calc(1800 / 1080)) {
        max-width: calc(var(--widthRate) * 600);
      }
      @media (aspect-ratio < calc(1400 / 1080)) {
        max-width: calc(var(--widthRate) * 800);
      }
      @media (aspect-ratio < calc(1000 / 1080)) {
        min-width: calc(var(--widthRate) * 1120);
      }
      @media (aspect-ratio < calc(790 / 1080)) {
        min-width: calc(var(--widthRate) * 1520);
        // min-height: calc(var(--heightRate) * 350);
      }
    }

    :deep(.el-dialog__header) {
      display: flex;
      padding: 0;
      padding-top: calc(var(--heightRate) * 60);
      justify-content: center;

      .el-dialog__headerbtn:focus .el-dialog__close,
      .el-dialog__headerbtn:hover .el-dialog__close {
        color: #de5757;
      }

      .el-dialog__title {
        font-family: "HarmonyOS_Sans_SC_Black";
        font-size: calc(var(--heightRate) * 60);
        line-height: calc(var(--heightRate) * 60);
        color: #47484c;
        width: inherit;
        padding-bottom: calc(var(--heightRate) * 50);
        word-break: normal;
        @media (aspect-ratio < calc(1850 / 1080)) {
          font-size: calc(var(--heightRate) * 60);
        }
        @media (aspect-ratio < calc(860 / 1080)) {
          font-size: calc(var(--heightRate) * 54);
        }
        @media (aspect-ratio < calc(580 / 1080)) {
          font-size: calc(var(--heightRate) * 45);
        }
      }
    }

    :deep(.el-dialog__body) {
      padding: calc(var(--heightRate) * 20) 0;
      height: calc(var(--heightRate) * 160);
      margin: 0;
      //   width: calc(var(--widthRate) * 224);
      //   height: calc(var(--heightRate) * 40);
      font-family: "HarmonyOS_Sans_SC_Midium";

      display: flex;
      justify-content: center;
      .restartSection {
        display: flex;
        align-items: center;
      }
      .el-select {
        --el-color-primary: #de5757;
        width: calc(var(--widthRate) * 360);
        height: calc(var(--heightRate) * 64);
        line-height: calc(var(--heightRate) * 39);
        @media (aspect-ratio < calc(2020 / 1080)) {
          width: calc(var(--widthRate) * 380);
        }
        @media (aspect-ratio < calc(1800 / 1080)) {
          width: calc(var(--widthRate) * 470);
        }
        @media (aspect-ratio < calc(1400 / 1080)) {
          width: calc(var(--widthRate) * 650);
        }
        @media (aspect-ratio < calc(1000 / 1080)) {
          width: calc(var(--widthRate) * 920);
        }
        @media (aspect-ratio < calc(790 / 1080)) {
          width: calc(var(--widthRate) * 1120);
        }
        @media (aspect-ratio < calc(580 / 1080)) {
          width: calc(var(--widthRate) * 1320);
        }
        .el-select__wrapper {
          height: inherit;
          font-size: calc(var(--heightRate) * 39);
          line-height: calc(var(--heightRate) * 39);
          @media (aspect-ratio < calc(790 / 1080)) {
            font-size: calc(var(--heightRate) * 35);
          }
          @media (aspect-ratio < calc(580 / 1080)) {
            font-size: calc(var(--heightRate) * 32);
          }
        }
      }

      .el-input__inner {
        // width: calc(var(--widthRate) * 224);
        // height: calc(var(--heightRate) * 40);
        font-size: calc(var(--heightRate) * 150);
        line-height: calc(var(--heightRate) * 150);
        padding: 0;
        padding-right: calc(var(--widthRate) * 14);
        padding-left: calc(var(--widthRate) * 14);
      }

      .el-select .el-input__inner:focus,
      .el-range-editor.is-active,
      .el-range-editor.is-active:hover,
      .el-select .el-input.is-focus .el-input__inner {
        border-color: #de5757;
      }

      .el-select-dropdown__item.selected {
        color: #de5757;
      }

      .el-select-dropdown__list {
        max-height: calc(var(--heightRate) * 247);
      }
    }

    :deep(.el-dialog__footer) {
      margin: 0;
      padding: 0;
      //   padding-top: calc(var(--heightRate) * 70);
      height: calc(var(--heightRate) * 130);
      .restartFooter {
        width: calc(var(--widthRate) * 200);
        height: inherit;
        border-radius: calc(var(--heightRate) * 15);
        font-size: calc(var(--heightRate) * 39);
        @media (aspect-ratio < calc(2020 / 1080)) {
          width: calc(var(--widthRate) * 220);
        }
        @media (aspect-ratio < calc(1800 / 1080)) {
          width: calc(var(--widthRate) * 300);
        }
        @media (aspect-ratio < calc(1400 / 1080)) {
          width: calc(var(--widthRate) * 400);
        }
        @media (aspect-ratio < calc(1000 / 1080)) {
          width: calc(var(--widthRate) * 560);
        }
        @media (aspect-ratio < calc(790 / 1080)) {
          width: calc(var(--widthRate) * 650);
        }
        @media (aspect-ratio < calc(580 / 1080)) {
          width: calc(var(--widthRate) * 820);
        }
      }

      .el-button {
        margin: 0;
        padding: 0;
      }

      .el-button:focus,
      .el-button:hover {
        color: #f2f2f2;
        border-color: #4d4747;
        background-color: #de5757;
      }
    }
  }

  .prizeResultLayer {
    :deep(.el-dialog) {
      max-width: calc(var(--widthRate) * 420);
      min-height: calc(var(--heightRate) * 550);
      margin: 0;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #f0f0f0;
      border-radius: calc(var(--heightRate) * 20);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      @media (aspect-ratio < calc(2020 / 1080)) {
        max-width: calc(var(--widthRate) * 420);
      }
      @media (aspect-ratio < calc(1800 / 1080)) {
        padding: calc(var(--heightRate) * 10) 0;
        max-width: calc(var(--widthRate) * 600);
      }
      @media (aspect-ratio < calc(1100 / 1080)) {
        max-width: calc(var(--widthRate) * 800);
      }
      @media (aspect-ratio < calc(860 / 1080)) {
        min-width: calc(var(--widthRate) * 1120);
      }
      @media (aspect-ratio < calc(580 / 1080)) {
        min-width: calc(var(--widthRate) * 1720);
        min-height: calc(var(--heightRate) * 350);
      }
    }

    :deep(.el-dialog__header) {
      .el-dialog__headerbtn:focus .el-dialog__close,
      .el-dialog__headerbtn:hover .el-dialog__close {
        color: #de5757;
      }
    }

    :deep(.el-dialog__body) {
      padding: 0;
      margin: 0;
      padding: calc(var(--heightRate) * 40) 0;
      width: calc(var(--widthRate) * 250);
      height: calc(var(--heightRate) * 250);
      @media (aspect-ratio < calc(2020 / 1080)) {
        width: calc(var(--widthRate) * 300);
        // height: calc(var(--heightRate) * 300);
      }
      @media (aspect-ratio < calc(1800 / 1080)) {
        width: calc(var(--widthRate) * 400);
        height: calc(var(--heightRate) * 270);
      }
      @media (aspect-ratio < calc(1100 / 1080)) {
        width: calc(var(--widthRate) * 550);
        height: calc(var(--heightRate) * 300);
      }
      @media (aspect-ratio < calc(860 / 1080)) {
        width: calc(var(--widthRate) * 750);
        height: calc(var(--heightRate) * 250);
      }
      @media (aspect-ratio < calc(580 / 1080)) {
        width: calc(var(--widthRate) * 850);
        height: calc(var(--heightRate) * 250);
      }
      .prizeResultSection {
        width: inherit;
        height: inherit;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    :deep(.el-dialog__footer) {
      span {
        margin: 0;
        padding: 0;
        padding-top: calc(var(--heightRate) * 50);
        color: #de5757;
        font-family: "HarmonyOS_Sans_SC_Black";
        font-size: calc(var(--heightRate) * 70);
        @media (aspect-ratio < calc(1850 / 1080)) {
          font-size: calc(var(--heightRate) * 60);
        }
        @media (aspect-ratio < calc(860 / 1080)) {
          font-size: calc(var(--heightRate) * 54);
        }
        @media (aspect-ratio < calc(580 / 1080)) {
          font-size: calc(var(--heightRate) * 45);
        }
      }
      .poorLuck {
        color: #757575;
      }
    }
  }

  .welcomePage {
    height: fit-content;
    height: -moz-fit-content;
    padding-bottom: calc(var(--heightRate) * 20);
    :deep(.el-overlay) {
      background-image: url("../../public/image/homepage_background_img.png");
      background-color: rgb(228, 228, 228);
    }

    :deep(.el-dialog) {
      width: calc(var(--widthRate) * 1280);
      height: fit-content;
      height: -moz-fit-content;
      margin: 0;
      padding: 0;
      position: absolute;
      top: 90%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: calc(var(--heightRate) * 20);
      background: rgba(240, 240, 240, 1);
      @media (aspect-ratio < calc(1950 / 1080)) {
        top: 85%;
      }
      @media (aspect-ratio < calc(1300 / 1080)) {
        width: calc(var(--widthRate) * 1680);
        top: 85%;
      }
      @media (aspect-ratio < calc(980 / 1080)) {
        width: calc(var(--widthRate) * 1880);
      }
      @media (aspect-ratio < calc(800 / 1080)) {
        width: calc(var(--widthRate) * 1800);
        top: 80%;
      }
      @media (aspect-ratio < calc(600 / 1080)) {
        top: 70%;
      }
      @media (height < 1080px) {
        top: 80%;
      }
      @media (height < 912px) {
        top: 90%;
      }
      @media (height < 860px) {
        top: 100%;
      }
    }

    :deep(.el-dialog__header) {
      padding: 0;
      padding-top: calc(var(--heightRate) * 100);
      height: fit-content;
      height: -moz-fit-content;
      @media (aspect-ratio < calc(800 / 1080)) {
        padding-top: calc(var(--heightRate) * 60);
      }

      .el-dialog__headerbtn:focus .el-dialog__close,
      .el-dialog__headerbtn:hover .el-dialog__close {
        color: #de5757;
      }

      .el-dialog__title {
        font-family: "HarmonyOS_Sans_SC_Black";
        font-size: calc(var(--heightRate) * 72);
        color: #757575;
        @media (aspect-ratio < calc(980 / 1080)) {
          font-size: calc(var(--heightRate) * 65);
        }
        @media (aspect-ratio < calc(800 / 1080)) {
          font-size: calc(var(--heightRate) * 58);
        }
        @media (aspect-ratio < calc(660 / 1080)) {
          font-size: calc(var(--heightRate) * 50);
        }
        @media (aspect-ratio < calc(550 / 1080)) {
          font-size: calc(var(--heightRate) * 40);
        }
        @media (aspect-ratio < calc(460 / 1080)) {
          font-size: calc(var(--heightRate) * 30);
        }
      }
    }

    :deep(.el-dialog__body) {
      padding: 0;
      margin: 0;
      width: inherit;
      height: fit-content;
      height: -moz-fit-content;
      display: flex;
      justify-content: center;
      padding-top: calc(var(--heightRate) * 66);
      padding-bottom: calc(var(--heightRate) * 20);
      @media (aspect-ratio < calc(800 / 1080)) {
        padding-top: calc(var(--heightRate) * 30);
      }
    }

    .welcomeSection {
      padding: 0;
      margin: 0;
      width: fit-content;
      width: -moz-fit-content;
      height: fit-content;
      height: -moz-fit-content;

      display: flex;
      flex-direction: column;
      align-content: center;
      align-items: center;

      .rootSection,
      .ruleSection {
        width: 100%;
        border-radius: calc(var(--heightRate) * 20);
        border: 2px solid rgba(77, 71, 71, 1);
        display: flex;
        flex-direction: column;
        align-content: center;

        .title {
          font-family: "HarmonyOS_Sans_SC_Black";
          font-size: calc(var(--heightRate) * 60);
          color: #757575;
          padding-left: calc(var(--widthRate) * 16);
          @media (aspect-ratio < calc(980 / 1080)) {
            font-size: calc(var(--heightRate) * 58);
          }
          @media (aspect-ratio < calc(800 / 1080)) {
            font-size: calc(var(--heightRate) * 50);
          }
          @media (aspect-ratio < calc(660 / 1080)) {
            font-size: calc(var(--heightRate) * 45);
          }
        }

        .info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .intro {
          width: calc(var(--widthRate) * 1070);
          padding: calc(var(--heightRate) * 10) 0 calc(var(--heightRate) * 10)
            calc(var(--widthRate) * 10);
          word-wrap: break-word;
          word-break: normal;
          @media (aspect-ratio < calc(1300 / 1080)) {
            width: calc(var(--widthRate) * 1400);
          }
          @media (aspect-ratio < calc(980 / 1080)) {
            width: calc(var(--widthRate) * 1560);
          }
        }
      }

      .ruleSection {
        margin-top: calc(var(--heightRate) * 52);
        @media (aspect-ratio < calc(800 / 1080)) {
          margin-top: calc(var(--heightRate) * 30);
        }
        .mb {
          margin-bottom: calc(var(--heightRate) * 20);
        }
      }

      //   .ruleImg {
      //     width: calc(var(--widthRate) * 1053);
      //     height: calc(var(--heightRate) * 1040);
      //   }
      .ruleImg {
        width: calc(var(--widthRate) * 1053);
        height: fit-content;
        height: -moz-fit-content;
        @media (aspect-ratio < calc(1300 / 1080)) {
          width: calc(var(--widthRate) * 1400);
          margin: 0 calc(var(--widthRate) * 20) 0 calc(var(--widthRate) * 20);
        }

        @media (aspect-ratio < calc(980 / 1080)) {
          width: calc(var(--widthRate) * 1600);
          margin: 0 calc(var(--widthRate) * 20) 0 calc(var(--widthRate) * 20);
        }

        :deep(.el-table) {
          border: calc(var(--heightRate) * 4) solid #c5c5c5;
          border-radius: calc(var(--heightRate) * 10);
          background-color: transparent;
          tr {
            background-color: #f0f0f0;
          }
          th {
            background-color: #f0f0f0;
          }
          .el-table__inner-wrapper {
            .el-table__header-wrapper {
              .el-table__header {
                tr {
                  th {
                    border-left: calc(var(--widthRate) * 2) solid #c5c5c5;
                    border-bottom: calc(var(--widthRate) * 2) solid #c5c5c5;
                    &:first-child {
                      border-left: 0;
                    }
                    &:last-child > td {
                      border-bottom: 0;
                    }
                    .cell {
                      padding: 0;
                      margin: 0;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      flex-wrap: nowrap;
                      flex-direction: row;
                      line-height: calc(var(--heightRate) * 50);
                      height: calc(var(--heightRate) * 50);
                      color: #4d4747;
                      font-size: calc(var(--heightRate) * 40);
                      @media (aspect-ratio < calc(2300 / 1080)) {
                        line-height: calc(var(--heightRate) * 40);
                        height: calc(var(--heightRate) * 40);
                        font-size: calc(var(--heightRate) * 30);
                      }
                      @media (aspect-ratio < calc(1770 / 1080)) {
                        line-height: calc(var(--heightRate) * 32);
                        height: calc(var(--heightRate) * 32);
                        font-size: calc(var(--heightRate) * 25);
                      }
                      @media (aspect-ratio < calc(1530 / 1080)) {
                        line-height: calc(var(--heightRate) * 30);
                        height: calc(var(--heightRate) * 30);
                        font-size: calc(var(--heightRate) * 22);
                      }
                      @media (aspect-ratio < calc(1390 / 1080)) {
                        line-height: calc(var(--heightRate) * 28);
                        height: calc(var(--heightRate) * 28);
                        font-size: calc(var(--heightRate) * 20);
                      }
                      @media (aspect-ratio < calc(1300 / 1080)) {
                        line-height: calc(var(--heightRate) * 25);
                        height: calc(var(--heightRate) * 25);
                        font-size: calc(var(--heightRate) * 15);
                      }
                      @media (aspect-ratio < calc(980 / 1080)) {
                        line-height: calc(var(--heightRate) * 30);
                        height: calc(var(--heightRate) * 30);
                        font-size: calc(var(--heightRate) * 20);
                      }
                      @media (aspect-ratio < calc(950 / 1080)) {
                        line-height: calc(var(--heightRate) * 30);
                        height: calc(var(--heightRate) * 30);
                        font-size: calc(var(--heightRate) * 17);
                      }
                      @media (aspect-ratio < calc(730 / 1080)) {
                        line-height: calc(var(--heightRate) * 23);
                        height: calc(var(--heightRate) * 23);
                        font-size: calc(var(--heightRate) * 15);
                      }
                      @media (aspect-ratio < calc(665 / 1080)) {
                        line-height: 1rem;
                        height: 1rem;
                        font-size: 0.8rem;
                      }
                      @media (aspect-ratio < calc(520 / 1080)) {
                        line-height: 0.7rem;
                        height: 0.7rem;
                        font-size: 0.7rem;
                      }
                      @media (aspect-ratio < calc(420 / 1080)) {
                        line-height: 0.7rem;
                        height: 0.7rem;
                        font-size: 0.4rem;
                      }
                      @media (aspect-ratio < calc(330 / 1080)) {
                        line-height: 0.4rem;
                        height: 0.4rem;
                        font-size: 0.3rem;
                      }
                    }
                  }
                }
              }
            }
            .el-table__body-wrapper {
              .el-table__row {
                td {
                  border-left: calc(var(--widthRate) * 2) solid #c5c5c5;
                  border-bottom: calc(var(--widthRate) * 2) solid #c5c5c5;
                  &:first-child {
                    border-left: 0;
                    .cell {
                      padding-left: 0;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      flex-wrap: nowrap;
                      flex-direction: row;
                    }
                  }
                }
                &:last-child > td {
                  border-bottom: 0;
                }
                td > .cell {
                  padding: 0;
                  margin: 0;
                  line-height: calc(var(--heightRate) * 35);
                  height: calc(var(--heightRate) * 35);
                  padding-left: calc(var(--widthRate) * 35);
                  color: #4d4747;
                  font-size: calc(var(--heightRate) * 24);
                  @media (aspect-ratio < calc(2300 / 1080)) {
                    line-height: calc(var(--heightRate) * 30);
                    height: calc(var(--heightRate) * 30);
                    font-size: calc(var(--heightRate) * 20);
                  }
                  @media (aspect-ratio < calc(2000 / 1080)) {
                    line-height: calc(var(--heightRate) * 28);
                    height: calc(var(--heightRate) * 28);
                    font-size: calc(var(--heightRate) * 18);
                  }

                  @media (aspect-ratio < calc(1390 / 1080)) {
                    line-height: calc(var(--heightRate) * 25);
                    height: calc(var(--heightRate) * 25);
                    font-size: calc(var(--heightRate) * 17);
                  }
                  @media (aspect-ratio < calc(730 / 1080)) {
                    line-height: calc(var(--heightRate) * 23);
                    height: calc(var(--heightRate) * 23);
                    font-size: calc(var(--heightRate) * 13);
                  }
                  @media (aspect-ratio < calc(600 / 1080)) {
                    line-height: calc(var(--heightRate) * 17);
                    height: calc(var(--heightRate) * 17);
                    font-size: calc(var(--heightRate) * 10);
                  }
                }
                :nth-child(2) > .cell {
                  @media (aspect-ratio < calc(730 / 1080)) {
                    width: max-content;
                  }
                }
                :nth-child(3) > .cell {
                  img {
                    height: calc(var(--heightRate) * 35);
                    padding-right: calc(var(--widthRate) * 10);
                    @media (aspect-ratio < calc(2530 / 1080)) {
                      height: calc(var(--heightRate) * 32);
                    }
                    @media (aspect-ratio < calc(2300 / 1080)) {
                      height: calc(var(--heightRate) * 30);
                    }
                    @media (aspect-ratio < calc(2000 / 1080)) {
                      height: calc(var(--heightRate) * 28);
                    }
                    @media (aspect-ratio < calc(1840 / 1080)) {
                      height: calc(var(--heightRate) * 23);
                    }
                    @media (aspect-ratio < calc(1570 / 1080)) {
                      height: calc(var(--heightRate) * 20);
                    }
                    @media (aspect-ratio < calc(1390 / 1080)) {
                      height: calc(var(--heightRate) * 17);
                    }
                    @media (aspect-ratio < calc(640 / 1080)) {
                      width: max-content;
                      height: calc(var(--heightRate) * 15);
                    }
                    @media (aspect-ratio < calc(540 / 1080)) {
                      height: calc(var(--heightRate) * 12);
                    }
                  }
                }
              }
            }
          }
          .el-popper {
            font-size: 0.7rem;
          }
        }
      }
    }

    :deep(.el-dialog__footer) {
      padding: 0;
      padding-top: calc(var(--heightRate) * 25);
      font-size: calc(var(--heightRate) * 14);

      .title {
        font-family: "HarmonyOS_Sans_SC_Black";
        font-size: calc(var(--heightRate) * 100);
        color: #757575;
        padding-left: calc(var(--widthRate) * 16);
        padding-bottom: calc(var(--heightRate) * 60);
        @media (aspect-ratio < calc(700 / 1080)) {
          font-size: calc(var(--heightRate) * 58);
          padding-bottom: calc(var(--heightRate) * 40);
        }
        @media (aspect-ratio < calc(560 / 1080)) {
          font-size: calc(var(--heightRate) * 50);
        }
        @media (aspect-ratio < calc(460 / 1080)) {
          font-size: calc(var(--heightRate) * 40);
        }
      }

      .btn {
        width: fit-content;
        height: fit-content;
        width: -moz-fit-content;
        height: -moz-fit-content;
        padding: 0;
        margin-bottom: calc(var(--heightRate) * 60);
        color: #f2f2f2;
        border-color: #4d4747;
        background-color: #de5757;
        font-family: "HarmonyOS_Sans_SC_Bold";
        font-size: calc(var(--heightRate) * 80);
        line-height: calc(var(--heightRate) * 80);
        border: calc(var(--heightRate) * 4) solid rgba(71, 72, 76, 1);
        border-radius: calc(var(--heightRate) * 30);

        @media (aspect-ratio < calc(700 / 1080)) {
          font-size: calc(var(--heightRate) * 58);
        }
        @media (aspect-ratio < calc(560 / 1080)) {
          font-size: calc(var(--heightRate) * 50);
        }

        span {
          padding: calc(var(--heightRate) * 30);
        }
      }

      .el-button:focus,
      .el-button:hover {
        color: #fffefe;
        border-color: #232222;
        background-color: #ad3e3e;
      }
    }
  }

  .loadingPage {
    :deep(.el-overlay-dialog) {
      background-image: url("../../public/image/homepage_background_img.png");
      background-color: rgb(228, 228, 228);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    :deep(.el-dialog) {
      width: calc(var(--widthRate) * 1280);
      height: inherit;
      margin-top: calc(var(--heightRate) * 30) !important;
      margin-bottom: calc(var(--heightRate) * 30) !important;
      margin-left: calc(var(--widthRate) * 320);
      border-radius: calc(var(--heightRate) * 20);
      background: rgba(240, 240, 240, 1);
    }
    :deep(.el-dialog__header) {
      padding: 0;
    }
    .ruleImg {
      width: 100%;
      height: 100%;
    }
  }

  :deep(.el-loading-spinner) {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: calc(var(--widthRate) * 420);
    min-height: calc(var(--heightRate) * 550);
    background-color: #f0f0f0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: calc(var(--heightRate) * 2) solid #757575;
    border-radius: calc(var(--heightRate) * 20);
    box-shadow: calc(var(--heightRate) * 6) calc(var(--heightRate) * 30)
      calc(var(--heightRate) * 52) 0 #383737d2;

    @media (aspect-ratio < calc(2020 / 1080)) {
      max-width: calc(var(--widthRate) * 420);
    }
    @media (aspect-ratio < calc(1800 / 1080)) {
      padding: calc(var(--heightRate) * 10) 0;
      max-width: calc(var(--widthRate) * 600);
    }
    @media (aspect-ratio < calc(1100 / 1080)) {
      max-width: calc(var(--widthRate) * 800);
    }
    @media (aspect-ratio < calc(860 / 1080)) {
      max-width: calc(var(--widthRate) * 1120);
    }
    @media (aspect-ratio < calc(580 / 1080)) {
      max-width: calc(var(--widthRate) * 1520);
    }
    .circular {
      width: calc(var(--heightRate) * 180);
      height: calc(var(--heightRate) * 180);
      margin-bottom: calc(var(--heightRate) * 100);
      .path {
        stroke: #de5757;
      }
    }

    .el-loading-text {
      font-family: "HarmonyOS_Sans_SC_Black";
      font-size: calc(var(--heightRate) * 60);
      color: #de5757;
    }
  }

  footer {
    // margin-top: calc(var(--heightRate) * 121);
    height: calc(var(--heightRate) * 50);
    width: 100vw;
    background-color: #ccccccb0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0;

    span {
      font-size: calc(var(--heightRate) * 17);
      font-family: "HarmonyOS_Sans_SC_Medium";
    }
  }
}
</style>
