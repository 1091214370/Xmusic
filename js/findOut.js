var audio = document.getElementById("audio");
let vm = new Vue({
    el: "#inp",
    data: {
        key: "",
        itemCount: "",
        showResult: false,
        isPlay: false,
        isLoop: false,
        items: [],
        tip: ""
    },
    methods: {
        // search button event
        clickFun: function() {
            let xml = new XMLHttpRequest();
            xml.open('get', "https://api.imjad.cn/cloudmusic/?type=search&s=" + this.key + "&br=128000&limit=20", true);
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
            xml.open('get', "https://api.imjad.cn/cloudmusic/?type=song&id=" + id + "&br=128000", true);
            xml.send();
            xml.onreadystatechange = () => {
                if (xml.readyState === 4 && xml.status === 200) {
                    var res = JSON.parse(xml.responseText);
                    audio.src = res.data[0].url;
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
        }
    }
});
audio.onended=function(){
    vm.isPlay=false;
};
audio.onplay=function(){
    vm.isPlay=true;
}