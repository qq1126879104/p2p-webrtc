<template>
	<div class="content">
		<div class="bg" v-show="!show"></div>
		<div class="content-block" v-show="show">
			<div class="row">
				<div class="col-md-6" style="height: 500px">
					<video id="localVideo" :src="local_video" autoplay></video>
				</div>
				<div class="col-md-6" style="height: 500px">
					<video id="remoteVideo" :src="remote_video" autoplay></video>
				</div>
			</div>
			<div class="btn-box" @click="hangUp">挂断</div>
			<div class="msg" v-show="msgShow"><span>{{msg}}</span></div>
			<div class="audio-box">
				<audio autoplay="autoplay" loop="loop" :src="open_audio"></audio>
				<iframe allow="autoplay"></iframe>
				<audio autoplay="autoplay" :src="close_audio"></audio>
				<!-- <iframe allow="autoplay" :src="close_audio"></iframe> -->
			</div>
		</div>
		<div class="preview" v-show="accept_video">
			<div class="preview-wrapper">
				<div class="preview-container">
					<div class="preview-body">
						<h4>设备编号{{call_username}}发起视频邀请，是否接受?</h4>
						<button class="btn-success btn" @click="accept">接受</button>
						<button class="btn-danger btn" style="margin-right: 70px" @click="reject">拒绝</button>
					</div>
					<div class="confirm" @click="closePreview">×</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
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
			url: "turn:turn.sczhou.com:3478",
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
						this.createConnection();
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
			},
			handleAccept(data) {
				if (data.accept) {
					// create an offer
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
				setTimeout(() => {
					window.history.back();
				}, 3000)
			}
		},
	};
</script>

<style>
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

	.btn-box {
		position: absolute;
		top: 616px;
		left: 460px;
		width: 160px;
		height: 48px;
		line-height: 48px;
		font-size: 26px;
		color: #c50000;
		font-weight: 400;
		letter-spacing: 10px;
		background: url(/static/button.png) center center no-repeat;
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
		width: 400px;
		height: 150px;
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
		font-size: 40px;
	}

	.confirm:hover {
		color: red;
		cursor: pointer;
	}

	.preview-body {
		position: absolute;
		width: 380px;
		height: 130px;
		margin: 10px 10px 10px 10px;
	}

	.preview-body>h4 {
		margin-top: 40px;
	}

	.preview-body>button {
		position: absolute;
		right: 10px;
		bottom: 0px;
	}

	.green_color {
		color: green;
	}

	.red_color {
		color: red;
	}
</style>
