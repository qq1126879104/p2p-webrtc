<template>
	<div class="content">
		<div class="content-block" v-show="show">
			<div id="top" style="width:1080px; height:200px;margin-bottom: 20PX;">
				<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="1080" height="200">
					<param name="movie" value="/static/top.swf">
					<param name="quality" value="high">
					<param name="wmode" value="transparent">
					<embed src="/static/top.swf" width="1080" height="200" quality="high" type="application/x-shockwave-flash"></object>
			</div>
			<div class="video local">
				<div class="video-box">
					<video id="localVideo" :src="local_video" autoplay></video>
				</div>
				<div class="video-msg" v-show="localMsgShow">{{localMsg}}</div>
			</div>
			<div class="video center">
				<div class="video-box">
					<video id="remoteVideo" :src="remote_video" autoplay></video>
				</div>
				<div class="video-msg" v-show="remoteMsgShow">{{remoteMsg}}</div>
			</div>
			<div class="btn-box" @click="hangUp"></div>
		</div>
		<div class="msg" v-show="msgShow"><span>{{msg}}</span></div>
		<div class="audio-box">
			<audio autoplay="autoplay" loop="loop" :src="open_audio"></audio>
			<iframe allow="autoplay"></iframe>
			<audio autoplay="autoplay" :src="close_audio"></audio>
			<!-- <iframe allow="autoplay" :src="close_audio"></iframe> -->
		</div>
		<div class="preview" v-show="accept_video">
			<div class="preview-wrapper">
				<div class="preview-container">
					<div class="preview-body">
						<h4>您有视频邀请，是否接受?</h4>
						<button class="btn-success btn" @click="accept">接受</button>
						<button class="btn-danger btn" style="margin-right: 70px" @click="reject">拒绝</button>
					</div>
					<div class="confirm" @click="closePreview">×</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script scoped>
	navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
	window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
	window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
	window.RTCSessionDescription =
		window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;
	var myhost = location.origin;
	var socket = io.connect(myhost);
	var localStream;
	var peerConn;
	var connectedUser = null;
	var configuration = {
		iceServers: [{
			url: "turn:" + location.hostname + ":3478",
			credential: "ling1234",
			username: "ling"
		}]
	};

	function getQuery(name) {
		let reg = `(^|&)${name}=([^&]*)(&|$)`
		let r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}

	export default {
		data() {
			return {
				user_name: "",
				show: true,
				users: '',
				call_username: '',
				local_video: '',
				remote_video: '',
				accept_video: false,
				localMsgShow: true,
				localMsg: "正在加载摄像头数据...",
				remoteMsgShow: true,
				remoteMsg: "等待对方连接...",
				msgShow: false,
				msg: "",
				open_audio: "/static/wx.mp3",
				close_audio: "",
			};
		},
		mounted() {
			this.user_name = getQuery("callerid") || ("unknown-" + Math.floor(Math.random() * 900 + 100));
			console.log(this.user_name)
			this.send({
				event: 'join',
				name: this.user_name,
			});
			socket.on(
				'message',
				function(data) {
					console.log(data);
					switch (data.event) {
						case 'show':
							this.users = data.allUsers;
							break;
						case 'join':
							this.handleLogin(data);
							break;
						case 'call':
							this.handleCall(data);
							break;
						case 'accept':
							this.handleAccept(data);
							break;
						case 'offer':
							this.handleOffer(data);
							break;
						case 'candidate':
							this.handleCandidate(data);
							break;
						case 'msg':
							this.handleMsg(data);
							break;
						case 'answer':
							this.handleAnswer(data);
							break;
						case 'leave':
							this.handleLeave();
							break;
						default:
							break;
					}
				}.bind(this)
			);
		},
		methods: {
			send(message) {
				if (connectedUser != null) {
					message.connectedUser = connectedUser;
				}
				socket.send(JSON.stringify(message));
			},
			handleLogin(data) {
				if (data.success === false) {
					this.showMsgToBack("连接失败");
				} else {
					this.users = data.allUsers;
					this.call_username = "admin";
					this.initCreate();
					this.call();
				}
			},
			initCreate() {
				const self = this;
				navigator.getUserMedia({
					video: true,
					audio: true
				}, gotStream, logError);

				function gotStream(e) {
					//displaying local video stream on the page
					self.local_video = window.URL.createObjectURL(e);
					self.localMsgShow = false;
					// var audioTracks = e.getAudioTracks();
					// // if MediaStream has reference to microphone
					// if (audioTracks[0]) {
					//   audioTracks[0].enabled = false;
					// }
					const vid = document.getElementById('localVideo');
					vid.muted = true;
					localStream = e;
				}

				function logError(error) {
					console.log(error);
				}
			},
			call() {
				connectedUser = this.call_username;
				this.send({
					event: 'call',
				});
			},
			createConnection() {
				peerConn = new RTCPeerConnection(configuration);
				peerConn.addStream(localStream);
				peerConn.onaddstream = e => {
					this.remote_video = window.URL.createObjectURL(e.stream);
					this.remoteMsgShow = false;
				};
				peerConn.onicecandidate = event => {
					setTimeout(() => {
						if (event.candidate) {
							this.send({
								event: 'candidate',
								candidate: event.candidate,
							});
						}
					});
				};
			},
			handleCall(data) {
				this.accept_video = true;
				connectedUser = data.name;
			},
			reject() {
				this.send({
					event: 'accept',
					accept: false,
				});
				this.accept_video = false;
				this.open_audio = "";
			},
			accept() {
				this.send({
					event: 'accept',
					accept: true,
				});
				this.accept_video = false;
			},
			handleAccept(data) {
				if (data.accept) {
					// create an offer
					this.createConnection();
					peerConn.createOffer(
						offer => {
							this.send({
								event: 'offer',
								offer: offer,
							});
							peerConn.setLocalDescription(offer);
						},
						error => {
							this.showMsgToBack("连接失败");
						}
					);
				} else {
					this.showMsgToBack("对方繁忙");
				}
				this.open_audio = "";
			},
			handleOffer(data) {
				connectedUser = data.name;
				this.createConnection();
				peerConn.setRemoteDescription(new RTCSessionDescription(data.offer));
				//create an answer to an offer
				peerConn.createAnswer(
					answer => {
						peerConn.setLocalDescription(answer);
						this.send({
							event: 'answer',
							answer: answer,
						});
					},
					error => {
						this.showMsgToBack("连接失败");
					}
				);
				this.open_audio = "";
			},
			handleMsg(data) {
				this.showMsgToBack(data.message);
			},
			handleAnswer(data) {
				peerConn.setRemoteDescription(new RTCSessionDescription(data.answer));
			},
			handleCandidate(data) {
				//ClientB通过PeerConnection的AddIceCandidate方法保存起来
				peerConn.addIceCandidate(new RTCIceCandidate(data.candidate));
			},
			hangUp() {
				this.send({
					event: 'leave',
				});
				this.handleLeave();
			},
			handleLeave() {
				connectedUser = null;
				this.remote_video = '';
				if (peerConn) {
					peerConn.close();
					peerConn.onicecandidate = null;
					peerConn.onaddstream = null;
					if (peerConn.signalingState == 'closed') {
						this.initCreate();
					}
				}
				this.showMsgToBack("通话结束");
			},
			closePreview() {
				this.accept_video = false;
			},
			showMsgToBack(msg) {
				this.msg = msg;
				this.msgShow = true;
				this.close_audio = "/static/1.mp3"
				this.open_audio = "";
				socket = {};
				setTimeout(() => {
					window.history.back();
				}, 3000)
			}
		},
	};
</script>

<style scoped>
	.content{
		background:url("/static/1.jpg") center center no-repeat;
		background-size: cover;
		background-attachment: fixed;
	}
	
	.video {
		position: relative;
		width: 1080px;
		height: 770px;
		margin: 0;
		padding: 0;
		text-align: center;
		overflow: hidden;
	}

	.video-msg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		line-height: 770px;
		text-align: center;
		font-size: 20px;
		color: #000;
	}

	.video-box {
		margin: 20px 30px;
		padding: 30px;
		width: 1020px;
		height: 730px;
		border-radius: 30px;
		background: #cf5400;
	}

	video {
		width: 100%;
		height: 100%;
		background: #ccc;
		object-fit: contain;
	}

	.btn-box {
		position: absolute;
		bottom: 40px;
		right: 40px;
		width: 130px;
		height: 100px;
		background: url(/static/guaduan1.png) center center no-repeat;
		background-size: 100% auto;
		cursor: pointer;
	}

	.msg {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		text-align: center;
		line-height: 50px;
		height: 50px;
		margin-top: -25px;
	}

	.msg span {
		display: inline-block;
		padding: 0 20px;
		color: #fff;
		background: rgba(0, 0, 0, 0.8);
		line-height: 40px;
		font-size: 20px;
	}

	.audio-box {
		position: absolute;
		width: 10px;
		height: 10px;
		overflow: hidden;
		top: -100px;
		left: -100px;
	}
</style>
