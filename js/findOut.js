let vm = new Vue({
    el: "#inp",
    data: {
        key: "",
        itemCount: "",
        showResult: false,
        items: [],
        tip: ""
    },
    methods: {
        clickFun: function() {
            let xml = new XMLHttpRequest();
            xml.open('get', "https://api.imjad.cn/cloudmusic/?type=search&s=" + this.key + "&br=128000&limit=8", true);
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
        sing: function(e) {
            let id = e.target.id;
            let xml = new XMLHttpRequest();
            xml.open('get', "https://api.imjad.cn/cloudmusic/?type=song&id=" + id + "&br=128000", true);
            xml.send();
            xml.onreadystatechange = () => {
                if (xml.readyState === 4 && xml.status === 200) {
                    var res = JSON.parse(xml.responseText);
                    document.getElementById("audio").src = res.data[0].url;
                }
            };
            // :src="item.al.picUrl"
        }
    }
})