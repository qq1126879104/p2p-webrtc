var express = require('express');
var app = express();
var http = require('http');
var fs = require('fs');
var IO = require('socket.io');

app.use(express.static('dist'));
process.on('uncaughtException', function(err) {
	//打印出错误
	console.log(err);
	//打印出错误的调用栈方便调试
	console.log(err.stack);
});
var server = http.createServer(app).listen(3000);
var io = IO(server);
console.log('Socket Secure server is up and running.');

// 所有用户名单
var allUsers = {};
// 所有客户端
var allSockets = {};

io.on('connect', function(socket) {
	var user = ''; //当前登录用户名

	socket.on('message', function(data) {
		var data = JSON.parse(data);
		switch (data.event) {
			//当有新用户加入时
			case 'join':
				user = data.name;
				//当昵称重复时
				if (allUsers[user]) {
					var conn = allSockets[user];
					console.log('User out', data.name);
					sendTo(conn, {
						event: 'out',
						message: "你的ID在其他设备登陆，你已被强制下线！",
					});
				}
				console.log('User joined', data.name);
				//保存用户信息
				allUsers[user] = true; //true表示未通话，false表示正在通话
				allSockets[user] = socket;
				socket.name = user;
				sendTo(socket, {
					event: 'join',
					allUsers: allUsers,
					success: true,
				});
				showUserInfo(allUsers);
				break;

			case 'call':
				var conn = allSockets[data.connectedUser];
				console.log('call to: ', data.connectedUser);
				if (!conn) {
					sendTo(socket, {
						event: 'msg',
						message: '对方未在线'
					});
					console.log('fail:', '对方未在线');
					return;
				}
				if (conn.accept) {
					sendTo(socket, {
						event: 'msg',
						message: '对方繁忙'
					});
					console.log('fail:', '对方繁忙');
					return;
				}
				socket.callName = data.connectedUser;
				sendTo(conn, {
					event: 'call',
					name: socket.name,
				});
				break;

			case 'offer':
				//for example: UserA wants to call UserB
				console.log('Sending offer to: ', data.connectedUser);
				//if UserB exists then send him offer details
				var conn = allSockets[data.connectedUser];
				allUsers[user] = false;
				if (conn != null) {
					if (conn.accept) {
						sendTo(socket, {
							event: 'msg',
							message: '对方繁忙'
						});
						console.log('fail:', '对方繁忙');
						return;
					}
					showUserInfo(allUsers);
					//setting that UserA connected with UserB
					socket.otherName = data.connectedUser;
					sendTo(conn, {
						event: 'offer',
						offer: data.offer,
						name: socket.name,
					});
				} else {
					console.log('fail:', '对方未在线');
					sendTo(socket, {
						event: 'msg',
						message: '对方未在线',
					});
				}
				break;

			case 'accept':
				var conn = allSockets[data.connectedUser];
				if (conn != null) {
					if (data.accept) {
						sendTo(conn, {
							event: 'accept',
							accept: true,
						});
					} else {
						allUsers[data.connectedUser] = true;
						conn.callName = null;
						conn.otherName = null;
						sendTo(conn, {
							event: 'accept',
							accept: false,
						});
					}
				}
				break;

			case 'answer':
				console.log('Sending answer to: ', data.connectedUser);
				//for ex. UserB answers UserA
				var conn = allSockets[data.connectedUser];
				allUsers[user] = false;
				if (conn != null) {
					showUserInfo(allUsers);
					socket.otherName = data.connectedUser;
					sendTo(conn, {
						event: 'answer',
						answer: data.answer,
					});
				}
				break;

			case 'candidate':
				console.log('Sending candidate to:', data.connectedUser);
				var conn1 = allSockets[data.connectedUser];
				var conn2 = allSockets[socket.otherName];
				if (conn1 != null) {
					sendTo(conn1, {
						event: 'candidate',
						candidate: data.candidate,
					});
				} else {
					sendTo(conn2, {
						event: 'candidate',
						candidate: data.candidate,
					});
				}
				break;

			case 'leave':
				console.log('Disconnecting from', data.connectedUser);
				var conn = allSockets[data.connectedUser];
				allUsers[socket.name] = true;
				allUsers[data.connectedUser] = true;
				socket.callName = null;
				socket.otherName = null;
				//notify the other user so he can disconnect his peer connection
				if (conn != null) {
					showUserInfo(allUsers);
					sendTo(conn, {
						event: 'leave',
					});
				}
				break;
		}
	});

	socket.on('disconnect', function() {
		console.log('disconnect ', socket.name);
		removeUser(socket)
	});
});

function removeUser(user) {
	if (user.name) {
		delete allUsers[user.name];
		delete allSockets[user.name];
		showUserInfo(allUsers);
		if (user.callName) {
			console.log('Disconnecting sendTo callName ', user.callName);
			var conn = allSockets[user.callName];
			if (conn != null) {
				sendTo(conn, {
					event: 'call_fail',
				});
			}
		}
		if (user.otherName) {
			console.log('Disconnecting sendTo otherName ', user.otherName);
			var conn = allSockets[user.otherName];
			allUsers[user.otherName] = true;
			user.otherName = null;
			if (conn != null) {
				sendTo(conn, {
					event: 'leave',
				});
			}
		}
	}
}

function showUserInfo(allUsers) {
	sendTo(io, {
		event: 'show',
		allUsers: allUsers,
	});
}

function sendTo(connection, message) {
	if (!connection) {
		for (key in allSockets) {
			if (!allSockets[key]) {
				delete allUsers[key];
				delete allSockets[key];
				showUserInfo(allUsers);
			}
		}
		return;
	}
	if (!io.sockets.connected[connection.id]) {
		removeUser(connection);
		return;
	}
	connection.send(message);
}
