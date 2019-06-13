<template>
	<div class="content">
		<div class="bg" v-show="!show"></div>
		<div class="content-block" v-show="show">
			<div class="row" style="height:75%">
				<div class="col-xs-6" style="height: 100%">
					<div class="video-box">
						<video id="localVideo" :src="local_video" autoplay></video>
					</div>
				</div>
				<div class="col-xs-6" style="height: 100%">
					<div class="video-box">
						<video id="remoteVideo" :src="remote_video" autoplay></video>
					</div>
				</div>
			</div>
			<div class="btn-box" @click="hangUp"></div>
			<div class="msg" v-show="msgShow"><span>{{msg}}</span></div>
			<div class="audio-box">
				<audio autoplay="autoplay" loop="loop" :src="open_audio"></audio>
				<iframe allow="autoplay"></iframe>
				<audio autoplay="autoplay" :src="close_audio"></audio>
				<iframe :src="timeurl"></iframe>
			</div>
		</div>
		<div class="preview" v-show="accept_video">
			<div class="preview-wrapper">
				<div class="preview-container">
					<div class="preview-body">
						<h4>设备编号{{call_username}}发起视频邀请<br>是否接受?</h4>
						<div class="btn-yes button" @click="accept"></div>
						<div class="btn-no button" style="margin-right: 210px" @click="reject"></div>
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
	const socket = io.connect(myhost);
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

	export default {
		data() {
			return {
				user_name: 'admin',
				show: true,
				users: '',
				call_username: '',
				local_video: '',
				remote_video: '',
				accept_video: false,
				msgShow: false,
				msg: "",
				open_audio: "",
				close_audio: "",
				startTime: "",
				timeurl: ""
			};
		},
		mounted() {
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
						case 'call_fail':
							this.handleCallFail();
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
					this.show = false;
					this.users = data.allUsers;
					this.initCreate();
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
				if (this.call_username.length > 0) {
					if (this.users[this.call_username] === true) {
						connectedUser = this.call_username;
						this.send({
							event: 'call',
						});
					} else {
						this.showMsgToBack("连接失败");
					}
				} else {
					this.showMsgToBack("对方繁忙");
				}
			},
			createConnection() {
				peerConn = new RTCPeerConnection(configuration);
				peerConn.addStream(localStream);
				peerConn.onaddstream = e => {
					this.remote_video = window.URL.createObjectURL(e.stream);
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
				this.call_username = data.name;
				this.accept_video = true;
				connectedUser = data.name;
				this.open_audio = "/static/wx.mp3";
				console.log(this.call_username)
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
				this.open_audio = "";
				this.show = true;
				this.initCreate();
				this.startTime = new Date().getTime();
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
					this.showMsgToBack('对方已拒绝');
				}
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
						this.showMsgToBack('连接失败');
					}
				);
			},
			handleMsg(data) {
				console.log(data.message);
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
				if (this.startTime) this.timeurl = "https://" + location.hostname + ":5151/get.asp?start=" + this.startTime +
					"&endTime=" + new Date().getTime() + "&callerid=" + connectedUser;
				this.startTime = null;
				connectedUser = null;
				this.remote_video = '';
				if (peerConn) {
					peerConn.close();
					peerConn.onicecandidate = null;
					peerConn.onaddstream = null;
					// if (peerConn.signalingState == 'closed') {
					// 	this.initCreate();
					// }
				}
				this.showMsgToBack("通话结束");
			},
			handleCallFail() {
				console.log("通话取消")
				this.remote_video = '';
				this.showMsgToBack("通话取消");
			},
			closePreview() {
				this.accept_video = false;
			},
			showMsgToBack(msg) {
				this.msg = msg;
				this.msgShow = true;
				this.close_audio = "/static/1.mp3";
				this.open_audio = "";
				this.accept_video = false;
				setTimeout(() => {
					this.close_audio = "";
					this.msgShow = false;
					this.show = false;
					this.timeurl = "";
				}, 3000)
			}
		},
	};
</script>

<style scoped>
	.col-xs-6 .video-box {
		margin-left: 20px;
		padding: 20px;
		height: 100%;
		border-radius: 20px;
		background: #193473;
	}

	.col-xs-6:last-child .video-box {
		margin-left: 0;
		margin-right: 20px;
	}

	video {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		background: #ccc;
		object-fit: contain;
	}

	.bg {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		overflow: hidden;
		background: url(/static/bg.jpg) center center no-repeat;
		background-size: cover;
	}

	.content-block {
		padding-top: 3%;
		height: 100%;
		background: url("/static/2.jpg") center center no-repeat;
		background-size: cover;
		background-attachment: fixed;
	}

	.btn-box {
		float: right;
		margin-right: 50px;
		margin-top: 30px;
		margin-bottom: 50px;
		width: 130px;
		height: 100px;
		background: url(/static/guaduan2.png) center center no-repeat;
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

	.preview {
		position: fixed;
		z-index: 9998;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: table;
		transition: opacity 0.3s ease;
	}

	.preview-wrapper {
		display: table-cell;
		vertical-align: middle;
	}

	.preview-container {
		width: 540px;
		height: 250px;
		margin: 0px auto;
		background-color: #fff;
		border-radius: 2px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
		transition: all 0.3s ease;
		font-family: Helvetica, Arial, sans-serif;
		position: relative;
	}

	.confirm {
		position: absolute;
		right: 10px;
		top: 0px;
		font-size: 58px;
	}

	.confirm:hover {
		color: red;
		cursor: pointer;
	}

	.preview-body {
		position: absolute;
		width: 520px;
		height: 230px;
		margin: 10px 10px 10px 10px;
	}

	.preview-body>h4 {
		margin-top: 50px;
		font-size: 24px;
		line-height: 40px;
	}

	.preview-body>.button {
		position: absolute;
		right: 10px;
		bottom: 10px;
		width: 180px;
		height: 60px;
	}

	.btn-yes {
		background: url(/static/jiehsou.png) center center no-repeat;
		background-size: 100% auto;
	}

	.btn-no {
		background: url(/static/jujue.png) center center no-repeat;
		background-size: 100% auto;
	}

	.green_color {
		color: green;
	}

	.red_color {
		color: red;
	}
</style>
