webpackJsonp([0],[,,,,function(e,t,n){"use strict";var a=n(2),i=n(23),s=n(18),o=n.n(s),c=n(19),r=n.n(c);a.a.use(i.a),t.a=new i.a({routes:[{path:"/",name:"room",component:o.a},{path:"/admin",name:"admin",component:r.a}]})},function(e,t,n){function a(e){n(13)}var i=n(0)(n(6),n(21),a,null,null);e.exports=i.exports},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"app"}},function(e,t,n){"use strict";function a(e){var t="(^|&)"+e+"=([^&]*)(&|$)",n=window.location.search.substr(1).match(t);return null!=n?unescape(n[2]):null}Object.defineProperty(t,"__esModule",{value:!0});var i=n(3),s=n.n(i);navigator.getUserMedia=navigator.getUserMedia||navigator.mozGetUserMedia||navigator.webkitGetUserMedia,window.RTCPeerConnection=window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection,window.RTCIceCandidate=window.RTCIceCandidate||window.mozRTCIceCandidate||window.webkitRTCIceCandidate,window.RTCSessionDescription=window.RTCSessionDescription||window.mozRTCSessionDescription||window.webkitRTCSessionDescription;var o,c,r=location.origin,d=io.connect(r),l=null,h={iceServers:[{url:"turn:turn.sczhou.com:3478",credential:"ling1234",username:"ling"}]};t.default={data:function(){return{user_name:"",show:!0,users:"",call_username:"",local_video:"",remote_video:"",accept_video:!1,localMsgShow:!0,localMsg:"正在加载摄像头数据...",remoteMsgShow:!0,remoteMsg:"等待对方连接...",msgShow:!1,msg:"",open_audio:"/static/wx.mp3",close_audio:""}},mounted:function(){this.user_name=a("callerid")||"unknown-"+Math.floor(900*Math.random()+100),console.log(this.user_name),this.send({event:"join",name:this.user_name}),d.on("message",function(e){switch(console.log(e),e.event){case"show":this.users=e.allUsers;break;case"join":this.handleLogin(e);break;case"call":this.handleCall(e);break;case"accept":this.handleAccept(e);break;case"offer":this.handleOffer(e);break;case"candidate":this.handleCandidate(e);break;case"msg":this.handleMsg(e);break;case"answer":this.handleAnswer(e);break;case"leave":this.handleLeave()}}.bind(this))},methods:{send:function(e){null!=l&&(e.connectedUser=l),d.send(s()(e))},handleLogin:function(e){!1===e.success?this.showMsgToBack("连接失败"):(this.users=e.allUsers,this.call_username="admin",this.initCreate())},initCreate:function(){function e(e){n.local_video=window.URL.createObjectURL(e),n.localMsgShow=!1,document.getElementById("localVideo").muted=!0,o=e}function t(e){console.log(e)}var n=this;navigator.getUserMedia({video:!0,audio:!0},e,t),this.call()},call:function(){l=this.call_username,this.send({event:"call"})},createConnection:function(){var e=this;c=new RTCPeerConnection(h),c.addStream(o),c.onaddstream=function(t){e.remote_video=window.URL.createObjectURL(t.stream),e.remoteMsgShow=!1},c.onicecandidate=function(t){setTimeout(function(){t.candidate&&e.send({event:"candidate",candidate:t.candidate})})}},handleCall:function(e){this.accept_video=!0,l=e.name},reject:function(){this.send({event:"accept",accept:!1}),this.accept_video=!1,this.open_audio=""},accept:function(){this.send({event:"accept",accept:!0}),this.accept_video=!1},handleAccept:function(e){var t=this;e.accept?c.createOffer(function(e){t.send({event:"offer",offer:e}),c.setLocalDescription(e)},function(e){t.showMsgToBack("连接失败")}):this.showMsgToBack("对方繁忙"),this.open_audio=""},handleOffer:function(e){var t=this;l=e.name,this.createConnection(),c.setRemoteDescription(new RTCSessionDescription(e.offer)),c.createAnswer(function(e){c.setLocalDescription(e),t.send({event:"answer",answer:e})},function(e){t.showMsgToBack("连接失败")}),this.open_audio=""},handleMsg:function(e){this.showMsgToBack(e.message)},handleAnswer:function(e){c.setRemoteDescription(new RTCSessionDescription(e.answer))},handleCandidate:function(e){c.addIceCandidate(new RTCIceCandidate(e.candidate))},hangUp:function(){this.send({event:"leave"}),this.handleLeave()},handleLeave:function(){l=null,this.remote_video="",c&&(c.close(),c.onicecandidate=null,c.onaddstream=null,"closed"==c.signalingState&&this.initCreate()),this.showMsgToBack("通话结束")},closePreview:function(){this.accept_video=!1},showMsgToBack:function(e){this.msg=e,this.msgShow=!0,this.close_audio="/static/1.mp3",this.open_audio="",setTimeout(function(){window.history.back()},3e3)}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n(3),i=n.n(a);navigator.getUserMedia=navigator.getUserMedia||navigator.mozGetUserMedia||navigator.webkitGetUserMedia,window.RTCPeerConnection=window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection,window.RTCIceCandidate=window.RTCIceCandidate||window.mozRTCIceCandidate||window.webkitRTCIceCandidate,window.RTCSessionDescription=window.RTCSessionDescription||window.mozRTCSessionDescription||window.webkitRTCSessionDescription;var s,o,c=location.origin,r=io.connect(c),d=null,l={iceServers:[{url:"turn:turn.sczhou.com:3478",credential:"ling1234",username:"ling"}]};t.default={data:function(){return{user_name:"admin",show:!0,users:"",call_username:"",local_video:"",remote_video:"",accept_video:!1,msgShow:!1,msg:"",open_audio:"",close_audio:""}},mounted:function(){this.send({event:"join",name:this.user_name}),r.on("message",function(e){switch(console.log(e),e.event){case"show":this.users=e.allUsers;break;case"join":this.handleLogin(e);break;case"call":this.handleCall(e);break;case"accept":this.handleAccept(e);break;case"offer":this.handleOffer(e);break;case"candidate":this.handleCandidate(e);break;case"msg":this.handleMsg(e);break;case"answer":this.handleAnswer(e);break;case"leave":this.handleLeave()}}.bind(this))},methods:{send:function(e){null!=d&&(e.connectedUser=d),r.send(i()(e))},handleLogin:function(e){!1===e.success?this.showMsgToBack("连接失败"):(this.show=!1,this.users=e.allUsers,this.initCreate())},initCreate:function(){function e(e){n.local_video=window.URL.createObjectURL(e),document.getElementById("localVideo").muted=!0,s=e}function t(e){console.log(e)}var n=this;navigator.getUserMedia({video:!0,audio:!0},e,t)},call:function(){this.call_username.length>0?!0===this.users[this.call_username]?(d=this.call_username,this.send({event:"call"})):this.showMsgToBack("连接失败"):this.showMsgToBack("对方繁忙")},createConnection:function(){var e=this;o=new RTCPeerConnection(l),o.addStream(s),o.onaddstream=function(t){e.remote_video=window.URL.createObjectURL(t.stream)},o.onicecandidate=function(t){setTimeout(function(){t.candidate&&e.send({event:"candidate",candidate:t.candidate})})}},handleCall:function(e){this.call_username=e.name,this.accept_video=!0,d=e.name,this.open_audio="/static/wx.mp3",console.log(this.call_username)},reject:function(){this.send({event:"accept",accept:!1}),this.accept_video=!1,this.open_audio=""},accept:function(){this.send({event:"accept",accept:!0}),this.accept_video=!1,this.open_audio="",this.show=!0,this.initCreate()},handleAccept:function(e){var t=this;e.accept?o.createOffer(function(e){t.send({event:"offer",offer:e}),o.setLocalDescription(e)},function(e){t.showMsgToBack("连接失败")}):this.showMsgToBack("对方已拒绝")},handleOffer:function(e){var t=this;d=e.name,this.createConnection(),o.setRemoteDescription(new RTCSessionDescription(e.offer)),o.createAnswer(function(e){o.setLocalDescription(e),t.send({event:"answer",answer:e})},function(e){t.showMsgToBack("连接失败")})},handleMsg:function(e){console.log(e.message)},handleAnswer:function(e){o.setRemoteDescription(new RTCSessionDescription(e.answer))},handleCandidate:function(e){o.addIceCandidate(new RTCIceCandidate(e.candidate))},hangUp:function(){this.send({event:"leave"}),this.handleLeave()},handleLeave:function(){d=null,this.remote_video="",o&&(o.close(),o.onicecandidate=null,o.onaddstream=null),this.showMsgToBack("通话结束")},closePreview:function(){this.accept_video=!1},showMsgToBack:function(e){var t=this;this.msg=e,this.msgShow=!0,this.close_audio="/static/1.mp3",this.open_audio="",setTimeout(function(){t.close_audio="",t.msgShow=!1,t.show=!1},3e3)}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n(2),i=n(5),s=n.n(i),o=n(4);a.a.config.productionTip=!1,new a.a({el:"#app",router:o.a,template:"<App/>",components:{App:s.a}})},,,function(e,t){},function(e,t){},function(e,t){},,,,function(e,t,n){function a(e){n(14)}var i=n(0)(n(7),n(22),a,"data-v-a2a32360",null);e.exports=i.exports},function(e,t,n){function a(e){n(12)}var i=n(0)(n(8),n(20),a,"data-v-198b7c6c",null);e.exports=i.exports},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"content"},[n("div",{directives:[{name:"show",rawName:"v-show",value:!e.show,expression:"!show"}],staticClass:"bg"}),e._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:e.show,expression:"show"}],staticClass:"content-block"},[n("div",{staticClass:"row"},[n("div",{staticClass:"col-md-6",staticStyle:{height:"500px"}},[n("video",{attrs:{id:"localVideo",src:e.local_video,autoplay:""}})]),e._v(" "),n("div",{staticClass:"col-md-6",staticStyle:{height:"500px"}},[n("video",{attrs:{id:"remoteVideo",src:e.remote_video,autoplay:""}})])]),e._v(" "),n("div",{staticClass:"btn-box",on:{click:e.hangUp}},[e._v("挂断")]),e._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:e.msgShow,expression:"msgShow"}],staticClass:"msg"},[n("span",[e._v(e._s(e.msg))])]),e._v(" "),n("div",{staticClass:"audio-box"},[n("audio",{attrs:{autoplay:"autoplay",loop:"loop",src:e.open_audio}}),e._v(" "),n("iframe",{attrs:{allow:"autoplay"}}),e._v(" "),n("audio",{attrs:{autoplay:"autoplay",src:e.close_audio}})])]),e._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:e.accept_video,expression:"accept_video"}],staticClass:"preview"},[n("div",{staticClass:"preview-wrapper"},[n("div",{staticClass:"preview-container"},[n("div",{staticClass:"preview-body"},[n("h4",[e._v("设备编号"+e._s(e.call_username)+"发起视频邀请，是否接受?")]),e._v(" "),n("button",{staticClass:"btn-success btn",on:{click:e.accept}},[e._v("接受")]),e._v(" "),n("button",{staticClass:"btn-danger btn",staticStyle:{"margin-right":"70px"},on:{click:e.reject}},[e._v("拒绝")])]),e._v(" "),n("div",{staticClass:"confirm",on:{click:e.closePreview}},[e._v("×")])])])])])},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"content"},[n("div",{directives:[{name:"show",rawName:"v-show",value:e.show,expression:"show"}],staticClass:"content-block"},[e._m(0),e._v(" "),n("div",{staticClass:"video local"},[n("video",{attrs:{id:"localVideo",src:e.local_video,autoplay:""}}),e._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:e.localMsgShow,expression:"localMsgShow"}],staticClass:"video-msg"},[e._v(e._s(e.localMsg))])]),e._v(" "),n("div",{staticClass:"video center"},[n("video",{attrs:{id:"remoteVideo",src:e.remote_video,autoplay:""}}),e._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:e.remoteMsgShow,expression:"remoteMsgShow"}],staticClass:"video-msg"},[e._v(e._s(e.remoteMsg))])]),e._v(" "),n("div",{staticClass:"btn-box",on:{click:e.hangUp}},[e._v("挂断")])]),e._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:e.msgShow,expression:"msgShow"}],staticClass:"msg"},[n("span",[e._v(e._s(e.msg))])]),e._v(" "),n("div",{staticClass:"audio-box"},[n("audio",{attrs:{autoplay:"autoplay",loop:"loop",src:e.open_audio}}),e._v(" "),n("iframe",{attrs:{allow:"autoplay"}}),e._v(" "),n("audio",{attrs:{autoplay:"autoplay",src:e.close_audio}})]),e._v(" "),n("div",{directives:[{name:"show",rawName:"v-show",value:e.accept_video,expression:"accept_video"}],staticClass:"preview"},[n("div",{staticClass:"preview-wrapper"},[n("div",{staticClass:"preview-container"},[n("div",{staticClass:"preview-body"},[n("h4",[e._v("您有视频邀请，是否接受?")]),e._v(" "),n("button",{staticClass:"btn-success btn",on:{click:e.accept}},[e._v("接受")]),e._v(" "),n("button",{staticClass:"btn-danger btn",staticStyle:{"margin-right":"70px"},on:{click:e.reject}},[e._v("拒绝")])]),e._v(" "),n("div",{staticClass:"confirm",on:{click:e.closePreview}},[e._v("×")])])])])])},staticRenderFns:[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticStyle:{width:"1080px",height:"200px"},attrs:{id:"top"}},[n("object",{attrs:{classid:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",width:"1080",height:"200"}},[n("param",{attrs:{name:"movie",value:"/static/top.swf"}}),e._v(" "),n("param",{attrs:{name:"quality",value:"high"}}),e._v(" "),n("param",{attrs:{name:"wmode",value:"transparent"}}),e._v(" "),n("embed",{attrs:{src:"/static/top.swf",width:"1080",height:"200",quality:"high",type:"application/x-shockwave-flash"}})])])}]}}],[9]);
//# sourceMappingURL=app.60cb4b4cecbc5a299461.js.map