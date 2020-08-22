const socket = io("/");

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

const peer = new Peer(undefined, { path: "/peerjs", host: "/", port: "3030" });
console.log(peer);
let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: false,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    console.log(peer);

    peer.on("call", (call) => {
      console.log("peer", peer);
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        console.log(video, userVideoStream);
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  })
  .catch((err) => console.log(err));

peer.on("open", (id) => {
  console.log("peer open", id);
  socket.emit("join-room", ROOM_ID, id);
});

peer.on("connection", (dataConnection) => {
  console.log("peer cnx", dataConnection);
});

const connectToNewUser = (userId, stream) => {
  console.log(userId, stream);
  const call = peer.call(userId, stream);
  const video = document.createElement("video");

  console.log("call", call);
  console.log("video", video);

  call.on("stream", (userVideoStream) => {
    console.log("sadsdfdsf");
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  console.log("addVideoStream", video);

  videoGrid.append(video);
};
