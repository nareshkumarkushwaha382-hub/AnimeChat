const CallManager = {
    localStream: null,
    isAudioMuted: false,
    isVideoDisabled: false,

    init() {
        const phoneBtn = document.getElementById("phone-call-btn");
        const videoBtn = document.getElementById("video-call-btn");
        const endCallBtn = document.getElementById("end-call-btn");
        const muteBtn = document.getElementById("mute-audio-btn");
        const toggleVideoBtn = document.getElementById("toggle-video-btn");

        if (phoneBtn) {
            phoneBtn.addEventListener("click", () => this.startCall(false));
        }
        if (videoBtn) {
            videoBtn.addEventListener("click", () => this.startCall(true));
        }
        if (endCallBtn) {
            endCallBtn.addEventListener("click", () => this.endCall());
        }
        if (muteBtn) {
            muteBtn.addEventListener("click", () => this.toggleMute());
        }
        if (toggleVideoBtn) {
            toggleVideoBtn.addEventListener("click", () => this.toggleVideo());
        }
    },

    async startCall(isVideoCall) {
        const callModal = document.getElementById("call-modal");
        const callTitle = document.getElementById("call-title");
        const remoteVideo = document.getElementById("remoteVideo");
        const localVideo = document.getElementById("localVideo");
        const activeName = document.getElementById("active-name").textContent;

        if (callTitle) callTitle.textContent = `Calling ${activeName}...`;
        if (callModal) callModal.classList.remove("hidden");

        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: isVideoCall,
                audio: true
            });

            if (localVideo) {
                localVideo.srcObject = this.localStream;
            }

            // Simulated remote connection feedback for AI / Characters
            if (remoteVideo && !isVideoCall) {
                remoteVideo.srcObject = null; // Audio only call state
            }
        } catch (error) {
            console.error("Error accessing media devices:", error);
            alert("Could not access camera or microphone. Please check permissions.");
            this.endCall();
        }
    },

    toggleMute() {
        if (!this.localStream) return;
        this.isAudioMuted = !this.isAudioMuted;
        this.localStream.getAudioTracks().forEach(track => {
            track.enabled = !this.isAudioMuted;
        });
        const muteBtn = document.getElementById("mute-audio-btn");
        if (muteBtn) {
            muteBtn.innerHTML = this.isAudioMuted ? '<i class="fa-solid fa-microphone-slash"></i>' : '<i class="fa-solid fa-microphone"></i>';
        }
    },

    toggleVideo() {
        if (!this.localStream) return;
        this.isVideoDisabled = !this.isVideoDisabled;
        this.localStream.getVideoTracks().forEach(track => {
            track.enabled = !this.isVideoDisabled;
        });
        const toggleVideoBtn = document.getElementById("toggle-video-btn");
        if (toggleVideoBtn) {
            toggleVideoBtn.innerHTML = this.isVideoDisabled ? '<i class="fa-solid fa-video-slash"></i>' : '<i class="fa-solid fa-video"></i>';
        }
    },

    endCall() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }
        const callModal = document.getElementById("call-modal");
        if (callModal) callModal.classList.add("hidden");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    CallManager.init();
});
          
