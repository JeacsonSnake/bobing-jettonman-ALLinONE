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
      <el-dialog title="Rank: " v-model="rankVisible" center>
        <!-- <div class="rankSection"></div> -->
        <el-table :data="rankData" class="rankSection" empty-text="No Data yet">
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
      <el-dialog title="博饼怎么玩？" v-model="rulesVisible" center>
        <div class="ruleSection">
          <span class="ruleIntro">
            博饼的规则如下：多人游戏中，选择玩家人数和决定玩家顺序后，点击按钮掷骰子。如果玩家所获得骰子点数与下表中的点数吻合，则判定赢得奖品。不同的点数对应不同等级的奖品，通常而言从次到好共分为“秀才”、“进士”、“探花”、“榜眼”、“状元”五等。
            具体参见下表：
          </span>
          <img src="../../public/image/rule.png" alt="" class="ruleImg" />
          <div class="ruleImg">
            <el-table :data="ruleData" stripe border>
              <el-table-column
                prop="prize"
                label="奖项"
                min-width="15%"
                fixed
              />
              <el-table-column prop="name" label="具体名称" min-width="25%" />
              <el-table-column
                prop="diceNumArr"
                label="骰子拟合图"
                min-width="30%"
              >
                <template #default="scope">
                  <div
                    class="diceImgSection"
                    v-for="(item, index) in scope.row.diceNumArr"
                    :key="index"
                  >
                    <img :src="getDiceImgByIndex(item)" alt="" />
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                prop="description"
                label="描述"
                show-overflow-tooltip
              />
            </el-table>
          </div>
          <span class="ruleIntro">
            注：由于“状元”等级较为稀有，且在“状元”条件下，由于越靠近表格底部的点数掷出概率越小，因此亦有“在已出现状元的情况下，博到越稀有点数者可以顺走前一状元奖品”的进阶规则。玩的开心！
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
          <img :src="getDiseImg(this.prizeNow.imgUrl)" alt="" />
        </div>
        <template v-slot:footer>
          <span :class="{ poorLuck: poorLuck }">
            {{ this.prizeNow.prizeName }}
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
            <span class="title">啥是博饼？</span>
            <div class="info">
              <span class="intro">
                "博饼
                "是闽南地区在中秋节的一种传统习俗，它最早起源于福建厦门，后盛行于闽南地区和台湾省。游戏规则简单、公平，充满竞技悬念和生活情趣。一直深受分布在世界各地的广大群众喜爱。
              </span>
            </div>
          </div>
          <div class="ruleSection">
            <span class="title">怎么玩?</span>
            <div class="info mb">
              <span class="intro">
                很简单。例如，在多人游戏中，选择玩家人数和决定玩家顺序后，点击按钮掷骰子。
                <br />
                如果玩家符合下表中的点数，就能赢得奖品。
              </span>
              <img src="../../public/image/rule.png" alt="" class="ruleImg" />
            </div>
          </div>
        </div>

        <template v-slot:footer>
          <div>
            <div class="title">即刻开始?</div>
            <el-button class="btn" @click="restartVisible = true"
              >点我!</el-button
            >
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { shallowRef } from "vue";
import {
  InfoFilled,
  Histogram,
  Refresh,
  Tickets,
  IceCreamRound,
} from "@element-plus/icons-vue";

const ElIconInfo = shallowRef(InfoFilled);
const ElIconSData = shallowRef(Histogram);
const ElIconRefresh = shallowRef(Refresh);
const ElIconTickets = shallowRef(Tickets);
const ElIconIceCreamRound = shallowRef(IceCreamRound);

export default {
  data() {
    return {
      loading: false,
      prizeResultVisible: false,
      aboutVisible: false,
      rulesVisible: false,
      rankVisible: false,
      restartVisible: false,
      welcomeVisible: false,
      loadingVisible: true,
      playerNum: "",
      playerNumOptions: [
        {
          value: "1",
          label: "1",
        },
        {
          value: "2",
          label: "2",
        },
        {
          value: "3",
          label: "3",
        },
        {
          value: "4",
          label: "4",
        },
        {
          value: "5",
          label: "5",
        },
        {
          value: "6",
          label: "6",
        },
        {
          value: "7",
          label: "7",
        },
        {
          value: "8",
          label: "8",
        },
      ],
      ruleData: [
        {
          prize: "12987122",
          name: "Tom",
          diceNumArr: ["2", "1"],
          description: "3.2",
        },
      ],
      ElIconInfo,
      ElIconSData,
      ElIconTickets,
      ElIconRefresh,
      ElIconIceCreamRound,
    };
  },
  computed: {
    rankData: function () {
      return this.$store.state.playerRank;
    },
    singleRankData: function () {
      return this.$store.state.singleRank;
    },
    diceNumArr: function () {
      return this.$store.state.resultDiceNumArr;
    },
    playerNow: function () {
      return this.$store.state.playerNow;
    },
    prizeNow: function () {
      return this.$store.state.prizeNow;
    },
    poorLuck: function () {
      return this.$store.state.poorLuck;
    },
    playerAmount: function () {
      return this.$store.state.playerAmount;
    },
  },
  methods: {
    jumpFrontEnd() {
      window.open(
        "https://github.com/JeacsonSnake/bobing-jettonman-ALLinONE",
        "_blank"
      );
    },

    getDiseImg(imgUrl) {
      return `${import.meta.env.BASE_URL}image/${imgUrl}`;
    },

    getDiceImgByIndex(index) {
      let imgUrl = "dice/DICE-" + index + ".svg";
      return this.getDiseImg(imgUrl);
    },

    getRan() {
      this.rankVisible = true;
    },

    getRestart() {
      this.restartVisible = true;
    },

    start() {
      let p = this.playerNum;
      if (p == "") {
        this.$message.error("人数尚未确定！");
      } else {
        this.$confirm("你将开启新一轮游戏，确定吗？", "注意", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          confirmButtonClass: "confirmButton",
          cancelButtonClass: "cancelButton",
        })
          .then(() => {
            setTimeout(() => {
              this.restartVisible = false;
              this.welcomeVisible = false;
            }, 100);
            const loading = this.startLoading("创建中...");
            setTimeout(() => {
              this.$store
                .dispatch("getNewRun", p)
                .then(() => {
                  setTimeout(() => {
                    this.endLoading(loading);
                    this.$message({
                      type: "success",
                      message: "已创建新一轮游戏!",
                    });
                  }, 400);
                })
                .catch((action) => {});
            }, 300);
          })
          .catch((err) => {
            // console.log(err);
            if (err == "cancel") {
              this.$message({
                type: "info",
                message: "已取消开启新一轮游戏",
              });
            }
          });
      }
    },

    getNextPlayerResults() {
      if (this.playerNow == -1) {
        this.restartVisible = true;
        this.$message({
          type: "error",
          message: "The number of players is not set yet!",
        });
      } else {
        const loading = this.startLoading("掷骰入碗...");
        setTimeout(() => {
          this.$store
            .dispatch("getNextResult")
            .then(() => {
              setTimeout(() => {
                this.endLoading(loading);
              }, 400);
            })
            .then(() => {
              setTimeout(() => {
                this.prizeResultVisible = true;
              }, 700);
            });
        }, 300);
      }
    },

    startLoading(loadingText) {
      const loading = this.$elLoading.service({
        lock: true,
        target: ".homePage",
        text: loadingText,
        background: "rgba(200, 200, 200, 1)",
      });
      return loading;
    },

    endLoading(loading) {
      loading.close();
    },

    playerRankDataFormatter(row, column, cellValue, index) {
      // console.log(row);
      // console.log(column);
      // console.log("cellvalue", cellValue);
      // console.log(index);
      let formattedCellValue = "";
      cellValue.forEach((singlePrizeObj, index) => {
        let prizeRealName = "";
        this.$store.state.prizeName.forEach((SingleRealName, index) => {
          if (SingleRealName === singlePrizeObj.prizeName) {
            prizeRealName = this.$store.state.prizeRealName[index];
          }
        });
        formattedCellValue += prizeRealName;
        formattedCellValue += "*";
        formattedCellValue += singlePrizeObj.prizeGetNum;
        formattedCellValue += ", ";
      });
      return formattedCellValue.slice(0, -2);
    },
  },
  created() {
    // this.restartVisible = true;
    // this.loadingVisible = true;
  },
  mounted() {
    let localPlayersRank = JSON.parse(
      localStorage.getItem("Bobing_playersRank")
    );
    // console.log(localPlayersRank);
    if (localPlayersRank) {
      const loading = this.startLoading("正在读取存档...");
      setTimeout(() => {
        this.$store.commit("changePlayerAmount", localPlayersRank.playerAmount);
        this.$store.commit("changePlayerNow", localPlayersRank.playerNow);
        this.$store.commit("setPlayerRank", localPlayersRank.playerRank);
        this.$store.commit(
          "setResultDiceNumArr",
          localPlayersRank.resultDiceNumArr
        );
        this.$store.dispatch("setNowPlayerRank");
        this.loadingVisible = false;
      }, 2000);
      setTimeout(() => {
        this.endLoading(loading);
      }, 2500);
    } else {
      const loading = this.startLoading("加载中...");
      setTimeout(() => {
        this.welcomeVisible = true;
        this.loadingVisible = false;
      }, 2000);
      setTimeout(() => {
        this.endLoading(loading);
      }, 2500);
    }
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
    width: inherit;
    height: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;

    .titleImg {
      max-width: calc(var(--widthRate) * 1120);
      max-height: calc(var(--heightRate) * 330);
      padding: calc(var(--heightRate) * 22) 0;
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

    @media (aspect-ratio < calc(600 / 1079)) {
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
        font-size: calc(var(--heightRate) * 60);
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
              width: 100% !important;
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

      @media (aspect-ratio < calc(800 / 1079)) {
        width: calc(var(--widthRate) * 1400);
        height: calc(var(--heightRate) * 400);
      }

      @media (aspect-ratio < calc(600 / 1079)) {
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

      @media (aspect-ratio < calc(600 / 1079)) {
        width: calc(var(--widthRate) * 1050);
      }
      :deep(.el-button) {
        width: inherit;
        padding: 0;
        height: inherit;
        border-radius: calc(var(--heightRate) * 20);
        background: rgba(222, 87, 87, 1);
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
      width: calc(var(--widthRate) * 1280);
      height: calc(var(--heightRate) * 960);
      margin-top: calc(var(--heightRate) * 60) !important;
      margin-bottom: calc(var(--heightRate) * 60) !important;
      margin-left: calc(var(--widthRate) * 320);
      border-radius: calc(var(--heightRate) * 20);
      background: rgba(240, 240, 240, 1);
    }

    :deep(.el-dialog__header) {
      padding: 0;
      padding-top: calc(var(--heightRate) * 100);
      .el-dialog__headerbtn:focus .el-dialog__close,
      .el-dialog__headerbtn:hover .el-dialog__close {
        color: #de5757;
      }

      .el-dialog__title {
        font-family: "HarmonyOS_Sans_SC_Black";
        font-size: calc(var(--heightRate) * 72);
      }
    }

    :deep(.el-dialog__body) {
      padding: 0;
      padding-top: calc(var(--heightRate) * 193);
    }

    :deep(.el-dialog__footer) {
      padding: 0;
      padding-top: calc(var(--heightRate) * 140);
      font-size: calc(var(--heightRate) * 14);
    }

    .aboutSection {
      font-family: "HarmonyOS_Sans_SC_Black";
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: calc(var(--heightRate) * 80);
      font-size: calc(var(--heightRate) * 48);

      .aboutSection_Title {
        padding-right: calc(var(--heightRate) * 80);
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
    z-index: 10;
    top: 50%;
    left: 50%;
    // transform: translate(-50%, -50%);
    :deep(.el-dialog) {
      width: calc(var(--widthRate) * 1280);
      height: calc(var(--heightRate) * 1930);
      //   margin-top: calc(var(--heightRate) * 60) !important;
      //   margin-bottom: calc(var(--heightRate) * 60) !important;
      //   margin-left: calc(var(--widthRate) * 320);
      border-radius: calc(var(--heightRate) * 20);
      background: rgba(240, 240, 240, 1);
    }

    :deep(.el-dialog__header) {
      padding: 0;
      padding-top: calc(var(--heightRate) * 100);

      .el-dialog__headerbtn:focus .el-dialog__close,
      .el-dialog__headerbtn:hover .el-dialog__close {
        color: #de5757;
      }

      .el-dialog__title {
        font-family: "HarmonyOS_Sans_SC_Bold";
        font-size: calc(var(--heightRate) * 60);
        color: #757575;
      }
    }

    :deep(.el-dialog__body) {
      padding: 0;
      margin: 0;
      display: flex;
      justify-content: center;
      padding-top: calc(var(--heightRate) * 20);
    }

    .ruleSection {
      padding: 0;
      margin: 0;
      width: calc(var(--widthRate) * 1110);
      height: calc(var(--heightRate) * 1610);
      border-radius: calc(var(--heightRate) * 20);
      border: 2px solid rgba(77, 71, 71, 1);
      display: flex;
      flex-direction: column;
      align-content: center;
      align-items: center;
      @media (aspect-ratio < calc(1100 / 1080)) {
        font-size: calc(var(--heightRate) * 17);
      }

      @media (aspect-ratio < calc(980 / 1080)) {
        font-size: calc(var(--heightRate) * 14);
      }

      @media (aspect-ratio < calc(800 / 1079)) {
        font-size: calc(var(--heightRate) * 12);
      }

      @media (aspect-ratio < calc(600 / 1079)) {
        font-size: calc(var(--heightRate) * 10);
      }

      .ruleIntro {
        padding: calc(var(--heightRate) * 10) calc(var(--heightRate) * 10);
        word-wrap: break-word;
        word-break: normal;
        font-size: calc(var(--heightRate) * 20);
        @media (aspect-ratio < calc(1100 / 1080)) {
          font-size: calc(var(--heightRate) * 17);
        }

        @media (aspect-ratio < calc(980 / 1080)) {
          font-size: calc(var(--heightRate) * 14);
        }

        @media (aspect-ratio < calc(800 / 1079)) {
          font-size: calc(var(--heightRate) * 12);
        }

        @media (aspect-ratio < calc(600 / 1079)) {
          font-size: calc(var(--heightRate) * 10);
        }
      }

      .ruleImg {
        width: calc(var(--widthRate) * 1053);
        height: calc(var(--heightRate) * 3040);
        // border-radius: 20px;

        :deep(.el-table--border) {
          background-color: transparent;
          ::before,
          ::after {
            display: none;
          }
        }

        :deep(.el-table--border)::before,
        :deep(.el-table--border)::after {
          display: none;
        }

        :deep(.el-table) {
          background-color: transparent;
          ::before,
          ::after {
            display: none;
          }
          .el-table__inner-wrapper {
            border: calc(var(--heightRate) * 3) solid #4d4747;
            border-radius: calc(var(--heightRate) * 15);
            background-color: transparent;
          }
          tr {
            background-color: transparent;
          }
          .el-table__border-left-patch {
            display: none;
          }
          .el-table__header {
            background-color: transparent;

            :last-child {
              border-right: none !important;
            }
            .el-table__cell {
              background-color: transparent;

              font-size: calc(var(--heightRate) * 20);
              border-right: calc(var(--heightRate) * 2) solid #4d4747;
              border-bottom: calc(var(--heightRate) * 2) solid #4d4747;
              .cell {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: calc(var(--heightRate) * 30);
                line-height: calc(var(--heightRate) * 30);
                color: #4d4747;
              }
              @media (aspect-ratio < calc(1100 / 1080)) {
                font-size: calc(var(--heightRate) * 17);
              }

              @media (aspect-ratio < calc(980 / 1080)) {
                font-size: calc(var(--heightRate) * 14);
              }

              @media (aspect-ratio < calc(800 / 1079)) {
                font-size: calc(var(--heightRate) * 12);
              }

              @media (aspect-ratio < calc(600 / 1079)) {
                font-size: calc(var(--heightRate) * 10);
              }
            }
          }
          .el-table__body {
            border-radius: calc(var(--heightRate) * 15);

            tbody {
              border-radius: calc(var(--heightRate) * 15);
            }
            tr:hover > td.el-table__cell {
              background-color: #dfdfdf;
            }
            tr:hover > td:first-child {
              border-radius: 0 0 0 calc(var(--heightRate) * 15);
            }
            tr:hover > td:last-child {
              border-radius: 0 0 calc(var(--heightRate) * 15) 0;
            }
            :last-child {
              border-right: none !important;
            }
            .el-table__cell {
              border-right: calc(var(--heightRate) * 2) solid #4d4747;
              .cell {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: calc(var(--heightRate) * 15);
                line-height: calc(var(--heightRate) * 30);
                color: #4d4747;
              }

              @media (aspect-ratio < calc(1100 / 1080)) {
                font-size: calc(var(--heightRate) * 17);
              }

              @media (aspect-ratio < calc(980 / 1080)) {
                font-size: calc(var(--heightRate) * 14);
              }

              @media (aspect-ratio < calc(800 / 1079)) {
                font-size: calc(var(--heightRate) * 12);
              }

              @media (aspect-ratio < calc(600 / 1079)) {
                font-size: calc(var(--heightRate) * 10);
              }
            }
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
      height: calc(var(--heightRate) * 960);
      background-color: #f0f0f0;
      border-radius: calc(var(--heightRate) * 20);
      @media (aspect-ratio < calc(860 / 1080)) {
        min-width: calc(var(--widthRate) * 1450);
      }
      @media (aspect-ratio < calc(680 / 1080)) {
        min-width: calc(var(--widthRate) * 1920);
        height: calc(var(--heightRate) * 760);
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

      .el-table--fit {
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
    :deep(.el-overlay) {
      background-image: url("../../public/image/homepage_background_img.png");
      background-color: rgb(228, 228, 228);
    }

    :deep(.el-dialog) {
      width: calc(var(--widthRate) * 1280);
      height: calc(var(--heightRate) * 2357);
      margin-top: calc(var(--heightRate) * 60) !important;
      margin-bottom: calc(var(--heightRate) * 60) !important;
      margin-left: calc(var(--widthRate) * 320);
      border-radius: calc(var(--heightRate) * 20);
      background: rgba(240, 240, 240, 1);
    }

    :deep(.el-dialog__header) {
      padding: 0;
      padding-top: calc(var(--heightRate) * 100);

      .el-dialog__headerbtn:focus .el-dialog__close,
      .el-dialog__headerbtn:hover .el-dialog__close {
        color: #de5757;
      }

      .el-dialog__title {
        font-family: "HarmonyOS_Sans_SC_Black";
        font-size: calc(var(--heightRate) * 72);
        color: #757575;
      }
    }

    :deep(.el-dialog__body) {
      padding: 0;
      margin: 0;
      display: flex;
      justify-content: center;
      padding-top: calc(var(--heightRate) * 66);
    }

    .welcomeSection {
      padding: 0;
      margin: 0;
      width: calc(var(--widthRate) * 1110);
      height: calc(var(--heightRate) * 1550);

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
        }

        .info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .intro {
          width: calc(var(--widthRate) * 1070);
          padding: calc(var(--heightRate) * 10) 0;
          word-wrap: break-word;
          word-break: normal;
        }
      }

      .ruleSection {
        margin-top: calc(var(--heightRate) * 52);
        .mb {
          margin-bottom: calc(var(--heightRate) * 20);
        }
      }

      .ruleImg {
        width: calc(var(--widthRate) * 1053);
        height: calc(var(--heightRate) * 1040);
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
        padding-bottom: calc(var(--heightRate) * 100);
      }

      .btn {
        width: calc(var(--widthRate) * 555);
        height: calc(var(--heightRate) * 120);
        padding: 0;
        color: #f2f2f2;
        border-color: #4d4747;
        background-color: #de5757;
        font-family: "HarmonyOS_Sans_SC_Bold";
        font-size: calc(var(--heightRate) * 80);
        line-height: calc(var(--heightRate) * 80);
        border: calc(var(--heightRate) * 4) solid rgba(71, 72, 76, 1);
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
