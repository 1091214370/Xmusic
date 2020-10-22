<template>
  <div class="inp">
    <header>
      <div class="searchBox">
        <input class="scanIn" placeholder="找首歌儿给自己听" type="text" v-model="key" @keyup.enter="clickFun">
        <input class="search" type="button" value="查找" @click="clickFun">
      </div>
    </header>
    <div class="content">
      <h2 class="defaultTip" v-if="!showResult">只听好歌，不听话！</h2>
      <ol v-if="showResult" class="resultList">
        <li class="resultItem" v-for="item in items">
          <div class="resultImg playDef" v-if="item.album"></div>
          <p class="songName"><span :id="item.id" @click.stop="sing">{{item.name}}</span></p>
          <p class="singerName"><span v-if="item.artists" v-for="singer in item.artists">{{singer.name}} </span></p>
        </li>
      </ol>
    </div>
    <footer>
      <div class="controlBtns">
        <img class="poster" alt="poster" src="static/icon/icon.png">
        <div class="befSong"></div>
        <div :class="{playSong:!isPlay,pauseSong:isPlay}" @click.stop="playOrPause"></div>
        <div class="nextSong"></div>
        <div :class="{loopList:!isLoop,loopOne:isLoop}" @click.stop="loopOrList"></div>
      </div>
      <div class="lyric">{{detial}}</div>
      <audio id="audio" @ended="playEnd" @play="playIng"></audio>
    </footer>
  </div>
</template>
<script>
export default{
    name: "inp",
    data () {
        return{
        key: "",
        itemCount: "",
        showResult: false,
        isPlay: false,
        isLoop: false,
        items: [],
        tip: "",
        detial:"just listening",
        }
    },
    methods: {
        // search button event
        clickFun: function() {
            let xml = new XMLHttpRequest();
            xml.open('get', "http://musicapi.leanapp.cn/search?keywords=" + this.key, true);
            xml.send();
            xml.onreadystatechange = () => {
                if (xml.readyState === 4 && xml.status === 200) {
                    var res = JSON.parse(xml.responseText);
                    if (res.result) {
                        this.showResult = true;
                        this.items = res.result.songs;
                        this.itemCount = res.result.songCount;
                    } else {
                        this.showResult = false;
                        alert("未找到资源！");
                    }
                }
            }
        },
        // play event 
        sing: function(e) {
            let id = e.target.id;
            let xml = new XMLHttpRequest();
            xml.open('get', "https://api.imjad.cn/cloudmusic/?type=song&id=" + id + "&search_type=1", true);
            xml.send();
            xml.onreadystatechange = () => {
                if (xml.readyState === 4 && xml.status === 200) {
                    var res = JSON.parse(xml.responseText);
                    audio.src = res.data[0].url;
                    this.detial=e.target.innerHTML;
                    audio.play();
                    this.isPlay = true;
                }
            };
            // :src="item.al.picUrl"
        },
        // 创建播放列表
        createSongsList: function() {
            
        },
        /**
         * 列表播放与显示正在播放
         */

        // 正在播放
        playIng:function(){
          if(!this.isPlay){
            this.isPlay = true;
          }
        },
        // 播放结束
        playEnd:function(){
            this.isPlay = false;
        },
        /* *
         *底部控制栏按钮事件
         * */
        //海报跳转歌词页面
        //上一曲
        //播放、暂停
        playOrPause: function() {
            if (audio.src) {
                if (this.isPlay) {
                    audio.pause();
                } else {
                    audio.play();
                };
                this.isPlay = !this.isPlay;
            } else {
                alert("播放列表还没歌曲哦！");
            }
        },
        //下一曲
        //单曲循环、顺序播放
        loopOrList: function() {
            if(this.isLoop){
                audio.loop=false;
            }else{
                audio.loop=true;
            }
            this.isLoop = !this.isLoop;
        },
        // 弹窗
        tipWindow:function(){
            
        }
    }
}
</script>
<style>
html,
body {
  height: 100%;
  font-size: 62.5%;
}

.inp {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

header {
  width: 100%;
  height: 8rem;
  min-height: 8rem;
  max-height: 8rem;
  flex: 1;
  background-color: #54FF9F;
  display: flex;
  align-items: center;
  justify-content: center;
  position: static;
}

header .searchBox {
  width: 50rem;
  height: 4rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-radius: 1.4rem;
  background-color: #fff;
}

@media screen and (max-width: 900px) {
  header .searchBox {
    width: 40rem;
  }
}

@media screen and (max-width: 620px) {
  header .searchBox {
    width: 32rem;
  }
}

@media screen and (max-width: 420px) {
  header .searchBox {
    width: 28rem;
  }
}

header .searchBox input {
  border: 0;
  outline: 0;
}

header .searchBox .scanIn {
  flex: 5;
  height: 100%;
  float: right;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 1.6rem;
  background-color: #fff;
}

header .searchBox .search {
  flex: 1;
  height: 100%;
  margin: auto;
  display: block;
  font-size: 1.6rem;
  background-color: #fff;
  border-left: 1px solid #C1FFC1;
  cursor: pointer;
}

.content {
  width: 100%;
  min-height: 40rem;
  margin: 0 auto;
  background: radial-gradient(#C1FFC1, #fff);
  flex: 5;
  overflow-x: hidden;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
}

.content p {
  margin-bottom: 0;
  font-size: 1.4rem;
  line-height: 1.4rem;
}

.content .resultTip {
  width: 80%;
  height: 2rem;
  display: block;
  margin: 1rem auto 0 auto;
  line-height: 1.6rem;
  font-size: 1.6rem;
}

.content .resultTip i {
  font-size: inherit;
}

.content .defaultTip {
  font-size: 1.6rem;
  line-height: 1.6rem;
  height: 1.6rem;
  width: 100%;
  text-align: center;
  position: absolute;
  top: 50%;
  margin-top: -.8rem;
}

.content .resultList {
  width: 80%;
  display: flex;
  flex-direction: column;
  margin: .5rem auto;
  padding: 0;
  flex: 1;
}

.content .resultList .resultItem {
  width: 100%;
  min-height: 10%;
  padding: .25rem 0;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;
  justify-content: space-between;
  font-size: 1.2rem;
}

.content .resultList .resultItem .resultImg {
  width: 3rem;
  height: 3rem;
  display: block;
  margin: 0 .5rem;
  float: left;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: 3rem;
}

.content .resultList .resultItem .playDef {
  background-image: url(./images/playDef.png);
}

.content .resultList .resultItem .playing {
  background-image: url(./images/playing.png);
}

.content .resultList .resultItem .songName {
  flex: 5;
  height: inherit;
  padding-left: .5rem;
  font-size: 1.6rem;
  line-height: 3rem;
}

.content .resultList .resultItem .songName span {
  max-height: 1.6rem;
  line-height: 1.6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  display: inline-block;
}

.content .resultList .resultItem .songName span:hover {
  color: #1874CD;
}

.content .resultList .resultItem .singerName {
  color: #696969;
  flex: 3;
}

.content .resultList .resultItem .beforePage,
.content .resultList .resultItem .nextPage {
  display: block;
  width: 8rem;
  text-align: right;
  line-height: 3rem;
  cursor: pointer;
}

.content .resultList .resultItem .nextPage {
  text-align: left;
}

.content .resultList .resultItem:nth-child(2n) {
  background-color: rgba(255, 255, 255, 0.2);
}

.content .resultList .resultItem:nth-child(2n+1) {
  background-color: rgba(193, 255, 193, 0.2);
}

footer {
  flex: 1;
  min-height: 4rem;
  height: 4rem;
  background-color: #54FF9F;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: static;
  bottom: 0;
}

footer #audio {
  display: none;
}

footer .controlBtns {
  min-width: 30rem;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

@media screen and (max-width: 900px) {
  footer .controlBtns {
    flex: 2;
    min-width: 20rem;
  }
}

@media screen and (max-width: 620px) {
  footer{
    flex-direction: column-reverse;
  }
  footer .controlBtns {
    flex: 2;
    width:100%;
  }
}

footer .controlBtns .poster {
  flex: 1;
  max-width: 4rem;
  height: 4rem;
  display: block;
  background-color: #fff;
  margin-left: 5rem;
  cursor: pointer;
}

@media screen and (max-width: 900px) {
  footer .controlBtns .poster {
    margin-left: 1rem;
    margin-right: 1rem;
  }
}

@media screen and (max-width: 620px) {
  
  footer .controlBtns .poster {
    margin-left: 1rem;
  }
}

footer .controlBtns div {
  flex: 1;
  width: 2rem;
  height: 2rem;
  background-size: 2rem;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}

footer .controlBtns .befSong {
  background-image: url(./images/sys.png);
}

footer .controlBtns .playSong {
  background-image: url(./images/start.png);
}

footer .controlBtns .nextSong {
  background-image: url(./images/xys.png);
}

footer .controlBtns .pauseSong {
  background-image: url(./images/zt.png);
}

footer .controlBtns .loopOne {
  background-image: url(./images/dqxh.png);
}

footer .controlBtns .loopList {
  background-image: url(./images/sxbf.png);
}

footer .lyric {
  flex: 2;
  height: 4rem;
  overflow: hidden;
  text-align: center;
  padding: 0 1rem;
  font-size: 1.6rem;
  line-height: 4rem;
  letter-spacing: .2rem;
  color: #fff;
  font-weight: bolder;
}

@media screen and (max-width: 900px) {
  footer .lyric {
    flex: 3;
  }
}

@media screen and (max-width: 620px) {
  footer .lyric {
    width: 100%;
    text-align: center;
    flex:1;
  }
}


/*# sourceMappingURL=layout.css.map */

</style>
