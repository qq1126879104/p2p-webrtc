webpackJsonp([0],[,,,,function(e,t,a){"use strict";var i=a(2),n=a(23),s=a(18),o=a.n(s),c=a(19),r=a.n(c);i.a.use(n.a),t.a=new n.a({routes:[{path:"/",name:"room",component:o.a},{path:"/admin",name:"admin",component:r.a}]})},function(e,t,a){function i(e){a(13)}var n=a(0)(a(6),a(21),i,null,null);e.exports=n.exports},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"app"}},function(e,t,a){"use strict";function i(e){var t="(^|&)"+e+"=([^&]*)(&|$)",a=window.location.search.substr(1).match(t);return null!=a?unescape(a[2]):null}Object.defineProperty(t,"__esModule",{value:!0});var n=a(3),s=a.n(n);navigator.getUserMedia=navigator.getUserMedia||navigator.mozGetUserMedia||navigator.webkitGetUserMedia,window.RTCPeerConnection=window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection,window.RTCIceCandidate=window.RTCIceCandidate||window.mozRTCIceCandidate||window.webkitRTCIceCandidate,window.RTCSessionDescription=window.RTCSessionDescription||window.mozRTCSessionDescription||window.webkitRTCSessionDescription;var o,c,r=location.origin,d=io.connect(r),l=null,h={iceServers:[{url:"turn:"+location.hostname+":3478",credential:"ling1234",username:"ling"}]};t.default={data:function(){return{user_name:"",show:!0,users:"",call_username:"",local_video:"",remote_video:"",accept_video:!1,localMsgShow:!0,localMsg:"正在加载摄像头数据...",remoteMsgShow:!0,remoteMsg:"等待对方连接...",msgShow:!1,msg:"",open_audio:"/static/wx.mp3",close_audio:""}},mounted:function(){this.user_name=i("callerid")||"unknown-"+Math.floor(900*Math.random()+100),console.log(this.user_name),this.send({event:"join",name:this.user_name}),d.on("message",function(e){switch(console.log(e),e.event){case"show":this.users=e.allUsers;break;case"join":this.handleLogin(e);break;case"call":this.handleCall(e);break;case"accept":this.handleAccept(e);break;case"offer":this.handleOffer(e);break;case"candidate":this.handleCandidate(e);break;case"msg":this.handleMsg(e);break;case"answer":this.handleAnswer(e);break;case"leave":this.handleLeave()}}.bind(this))},methods:{send:function(e){null!=l&&(e.connectedUser=l),d.send(s()(e))},handleLogin:function(e){!1===e.success?this.showMsgToBack("连接失败"):(this.users=e.allUsers,this.call_username="admin",this.initCreate(),this.call())},initCreate:function(){function e(e){a.local_video=window.URL.createObjectURL(e),a.localMsgShow=!1,document.getElementById("localVideo").muted=!0,o=e}function t(e){console.log(e)}var a=this;navigator.getUserMedia({video:!0,audio:!0},e,t)},call:function(){l=this.call_username,this.send({event:"call"})},createConnection:function(){var e=this;c=new RTCPeerConnection(h),c.addStream(o),c.onaddstream=function(t){e.remote_video=window.URL.createObjectURL(t.stream),e.remoteMsgShow=!1},c.onicecandidate=function(t){setTimeout(function(){t.candidate&&e.send({event:"candidate",candidate:t.candidate})})}},handleCall:function(e){this.accept_video=!0,l=e.name},reject:function(){this.send({event:"accept",accept:!1}),this.accept_video=!1,this.open_audio=""},accept:function(){this.send({event:"accept",accept:!0}),this.accept_video=!1},handleAccept:function(e){var t=this;e.accept?(this.createConnection(),c.createOffer(function(e){t.send({event:"offer",offer:e}),c.setLocalDescription(e)},function(e){t.showMsgToBack("连接失败")})):this.showMsgToBack("对方繁忙"),this.open_audio=""},handleOffer:function(e){var t=this;l=e.name,this.createConnection(),c.setRemoteDescription(new RTCSessionDescription(e.offer)),c.createAnswer(function(e){c.setLocalDescription(e),t.send({event:"answer",answer:e})},function(e){t.showMsgToBack("连接失败")}),this.open_audio=""},handleMsg:function(e){this.showMsgToBack(e.message)},handleAnswer:function(e){c.setRemoteDescription(new RTCSessionDescription(e.answer))},handleCandidate:function(e){c.addIceCandidate(new RTCIceCandidate(e.candidate))},hangUp:function(){this.send({event:"leave"}),this.handleLeave()},handleLeave:function(){l=null,this.remote_video="",c&&(c.close(),c.onicecandidate=null,c.onaddstream=null,"closed"==c.signalingState&&this.initCreate()),this.showMsgToBack("通话结束")},closePreview:function(){this.accept_video=!1},showMsgToBack:function(e){this.msg=e,this.msgShow=!0,this.close_audio="/static/1.mp3",this.open_audio="",d={},setTimeout(function(){window.history.back()},3e3)}}}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a(3),n=a.n(i);navigator.getUserMedia=navigator.getUserMedia||navigator.mozGetUserMedia||navigator.webkitGetUserMedia,window.RTCPeerConnection=window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection,window.RTCIceCandidate=window.RTCIceCandidate||window.mozRTCIceCandidate||window.webkitRTCIceCandidate,window.RTCSessionDescription=window.RTCSessionDescription||window.mozRTCSessionDescription||window.webkitRTCSessionDescription;var s,o,c=location.origin,r=io.connect(c),d=null,l={iceServers:[{url:"turn:"+location.hostname+":3478",credential:"ling1234",username:"ling"}]};t.default={data:function(){return{user_name:"admin",show:!0,users:"",call_username:"",local_video:"",remote_video:"",accept_video:!1,msgShow:!1,msg:"",open_audio:"",close_audio:"",startTime:"",timeurl:""}},mounted:function(){this.send({event:"join",name:this.user_name}),r.on("message",function(e){switch(console.log(e),e.event){case"show":this.users=e.allUsers;break;case"join":this.handleLogin(e);break;case"call":this.handleCall(e);break;case"accept":this.handleAccept(e);break;case"offer":this.handleOffer(e);break;case"candidate":this.handleCandidate(e);break;case"msg":this.handleMsg(e);break;case"answer":this.handleAnswer(e);break;case"leave":this.handleLeave()}}.bind(this))},methods:{send:function(e){null!=d&&(e.connectedUser=d),r.send(n()(e))},handleLogin:function(e){!1===e.success?this.showMsgToBack("连接失败"):(this.show=!1,this.users=e.allUsers,this.initCreate())},initCreate:function(){function e(e){a.local_video=window.URL.createObjectURL(e),document.getElementById("localVideo").muted=!0,s=e}function t(e){console.log(e)}var a=this;navigator.getUserMedia({video:!0,audio:!0},e,t)},call:function(){this.call_username.length>0?!0===this.users[this.call_username]?(d=this.call_username,this.send({event:"call"})):this.showMsgToBack("连接失败"):this.showMsgToBack("对方繁忙")},createConnection:function(){var e=this;o=new RTCPeerConnection(l),o.addStream(s),o.onaddstream=function(t){e.remote_video=window.URL.createObjectURL(t.stream)},o.onicecandidate=function(t){setTimeout(function(){t.candidate&&e.send({event:"candidate",candidate:t.candidate})})}},handleCall:function(e){this.call_username=e.name,this.accept_video=!0,d=e.name,this.open_audio="/static/wx.mp3",console.log(this.call_username)},reject:function(){this.send({event:"accept",accept:!1}),this.accept_video=!1,this.open_audio=""},accept:function(){this.send({event:"accept",accept:!0}),this.accept_video=!1,this.open_audio="",this.show=!0,this.initCreate(),this.startTime=(new Date).getTime()},handleAccept:function(e){var t=this;e.accept?(this.createConnection(),o.createOffer(function(e){t.send({event:"offer",offer:e}),o.setLocalDescription(e)},function(e){t.showMsgToBack("连接失败")})):this.showMsgToBack("对方已拒绝")},handleOffer:function(e){var t=this;d=e.name,this.createConnection(),o.setRemoteDescription(new RTCSessionDescription(e.offer)),o.createAnswer(function(e){o.setLocalDescription(e),t.send({event:"answer",answer:e})},function(e){t.showMsgToBack("连接失败")})},handleMsg:function(e){console.log(e.message)},handleAnswer:function(e){o.setRemoteDescription(new RTCSessionDescription(e.answer))},handleCandidate:function(e){o.addIceCandidate(new RTCIceCandidate(e.candidate))},hangUp:function(){this.send({event:"leave"}),this.handleLeave()},handleLeave:function(){this.timeurl="https://"+location.hostname+":5151/get.asp?start="+this.startTime+"&endTime="+(new Date).getTime()+"&callerid="+d,d=null,this.remote_video="",o&&(o.close(),o.onicecandidate=null,o.onaddstream=null),this.showMsgToBack("通话结束")},closePreview:function(){this.accept_video=!1},showMsgToBack:function(e){var t=this;this.msg=e,this.msgShow=!0,this.close_audio="/static/1.mp3",this.open_audio="",setTimeout(function(){t.close_audio="",t.msgShow=!1,t.show=!1,t.timeurl=""},3e3)}}}},function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a(2),n=a(5),s=a.n(n),o=a(4);i.a.config.productionTip=!1,new i.a({el:"#app",router:o.a,template:"<App/>",components:{App:s.a}})},,,function(e,t){},function(e,t){},function(e,t){},,,,function(e,t,a){function i(e){a(14)}var n=a(0)(a(7),a(22),i,"data-v-a2a32360",null);e.exports=n.exports},function(e,t,a){function i(e){a(12)}var n=a(0)(a(8),a(20),i,"data-v-198b7c6c",null);e.exports=n.exports},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content"},[a("div",{directives:[{name:"show",rawName:"v-show",value:!e.show,expression:"!show"}],staticClass:"bg"}),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:e.show,expression:"show"}],staticClass:"content-block"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col-md-6",staticStyle:{height:"500px"}},[a("video",{attrs:{id:"localVideo",src:e.local_video,autoplay:""}})]),e._v(" "),a("div",{staticClass:"col-md-6",staticStyle:{height:"500px"}},[a("video",{attrs:{id:"remoteVideo",src:e.remote_video,autoplay:""}})])]),e._v(" "),a("div",{staticClass:"btn-box",on:{click:e.hangUp}},[e._v("挂断")]),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:e.msgShow,expression:"msgShow"}],staticClass:"msg"},[a("span",[e._v(e._s(e.msg))])]),e._v(" "),a("div",{staticClass:"audio-box"},[a("audio",{attrs:{autoplay:"autoplay",loop:"loop",src:e.open_audio}}),e._v(" "),a("iframe",{attrs:{allow:"autoplay"}}),e._v(" "),a("audio",{attrs:{autoplay:"autoplay",src:e.close_audio}}),e._v(" "),a("iframe",{attrs:{src:e.timeurl}})])]),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:e.accept_video,expression:"accept_video"}],staticClass:"preview"},[a("div",{staticClass:"preview-wrapper"},[a("div",{staticClass:"preview-container"},[a("div",{staticClass:"preview-body"},[a("h4",[e._v("设备编号"+e._s(e.call_username)+"发起视频邀请，是否接受?")]),e._v(" "),a("button",{staticClass:"btn-success btn",on:{click:e.accept}},[e._v("接受")]),e._v(" "),a("button",{staticClass:"btn-danger btn",staticStyle:{"margin-right":"70px"},on:{click:e.reject}},[e._v("拒绝")])]),e._v(" "),a("div",{staticClass:"confirm",on:{click:e.closePreview}},[e._v("×")])])])])])},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"app"}},[a("router-view")],1)},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content"},[a("div",{directives:[{name:"show",rawName:"v-show",value:e.show,expression:"show"}],staticClass:"content-block"},[e._m(0),e._v(" "),a("div",{staticClass:"video local"},[a("video",{attrs:{id:"localVideo",src:e.local_video,autoplay:""}}),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:e.localMsgShow,expression:"localMsgShow"}],staticClass:"video-msg"},[e._v(e._s(e.localMsg))])]),e._v(" "),a("div",{staticClass:"video center"},[a("video",{attrs:{id:"remoteVideo",src:e.remote_video,autoplay:""}}),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:e.remoteMsgShow,expression:"remoteMsgShow"}],staticClass:"video-msg"},[e._v(e._s(e.remoteMsg))])]),e._v(" "),a("div",{staticClass:"btn-box",on:{click:e.hangUp}},[e._v("挂断")])]),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:e.msgShow,expression:"msgShow"}],staticClass:"msg"},[a("span",[e._v(e._s(e.msg))])]),e._v(" "),a("div",{staticClass:"audio-box"},[a("audio",{attrs:{autoplay:"autoplay",loop:"loop",src:e.open_audio}}),e._v(" "),a("iframe",{attrs:{allow:"autoplay"}}),e._v(" "),a("audio",{attrs:{autoplay:"autoplay",src:e.close_audio}})]),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:e.accept_video,expression:"accept_video"}],staticClass:"preview"},[a("div",{staticClass:"preview-wrapper"},[a("div",{staticClass:"preview-container"},[a("div",{staticClass:"preview-body"},[a("h4",[e._v("您有视频邀请，是否接受?")]),e._v(" "),a("button",{staticClass:"btn-success btn",on:{click:e.accept}},[e._v("接受")]),e._v(" "),a("button",{staticClass:"btn-danger btn",staticStyle:{"margin-right":"70px"},on:{click:e.reject}},[e._v("拒绝")])]),e._v(" "),a("div",{staticClass:"confirm",on:{click:e.closePreview}},[e._v("×")])])])])])},staticRenderFns:[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticStyle:{width:"1080px",height:"200px"},attrs:{id:"top"}},[a("object",{attrs:{classid:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",width:"1080",height:"200"}},[a("param",{attrs:{name:"movie",value:"/static/top.swf"}}),e._v(" "),a("param",{attrs:{name:"quality",value:"high"}}),e._v(" "),a("param",{attrs:{name:"wmode",value:"transparent"}}),e._v(" "),a("embed",{attrs:{src:"/static/top.swf",width:"1080",height:"200",quality:"high",type:"application/x-shockwave-flash"}})])])}]}}],[9]);
//# sourceMappingURL=app.6c7a0daa655e1d249ec2.js.map