import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import getDeviceId from './getDeviceId';

function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

export default class Webcam extends Component {
    static defaultProps = {
        audio: false,
        style: {
            height: 480,
            width: 640
        },
        screenshotFormat: 'image/jpeg',
        onUserMedia: () => {}
    };

    static propTypes = {
        audio: PropTypes.bool,
        muted: PropTypes.bool,
        onUserMedia: PropTypes.func,
        style: PropTypes.object,
        facingMode: PropTypes.oneOf([
            'front',
            'rear'
        ]),
        audioSource: PropTypes.string,
        videoSource: PropTypes.string,
        screenshotFormat: PropTypes.oneOf([
            'image/webp',
            'image/png',
            'image/jpeg'
        ]),
        className: PropTypes.string
    };

    static mountedInstances = [];

    static userMediaRequested = false;

    constructor() {
        super();
        this.state = {
            hasUserMedia: false
        };
    }

    componentDidMount() {
        if (!hasGetUserMedia()) return;

        Webcam.mountedInstances.push(this);

        if (!this.state.hasUserMedia && !Webcam.userMediaRequested) {
            this.requestUserMedia();
        }
    }

    requestUserMedia() {
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;

        let sourceSelected = (audioSource, videoSource) => {
            let constraints = {
                video: {
                    optional: [{sourceId: videoSource}]
                }
            };

            if (this.props.audio) {
                constraints.audio = {
                    optional: [{sourceId: audioSource}]
                };
            }

            navigator.getUserMedia(constraints, (stream) => {
                Webcam.mountedInstances.forEach((instance) => instance.handleUserMedia(null, stream));
            }, (e) => {
                Webcam.mountedInstances.forEach((instance) => instance.handleUserMedia(e));
            });
        };

        if (this.props.audioSource && this.props.videoSource) {
            sourceSelected(this.props.audioSource, this.props.videoSource);
        } else {
            let audioSource = 'default';
            getDeviceId(this.props.facingMode)
                .then(videoSource => sourceSelected(audioSource, videoSource))
                .catch(error => console.error(`${error.name}: ${error.message}`));
        }

        Webcam.userMediaRequested = true;
    }

    handleUserMedia(error, stream) {
        if (error) {
            this.setState({
                hasUserMedia: false
            });

            return;
        }

        let src = window.URL.createObjectURL(stream);

        this.stream = stream;
        this.setState({
            hasUserMedia: true,
            src
        });

        this.props.onUserMedia();
    }

    componentWillUnmount() {
        let index = Webcam.mountedInstances.indexOf(this);
        Webcam.mountedInstances.splice(index, 1);

        if (Webcam.mountedInstances.length === 0 && this.state.hasUserMedia) {
            if (this.stream.stop) {
                this.stream.stop();
            } else {
                if (this.stream.getVideoTracks) {
                    for (let track of this.stream.getVideoTracks()) {
                        track.stop();
                    }
                }
                if (this.stream.getAudioTracks) {
                    for (let track of this.stream.getAudioTracks()) {
                        track.stop();
                    }
                }
            }
            Webcam.userMediaRequested = false;
            window.URL.revokeObjectURL(this.state.src);
        }
    }

    getScreenshot() {
        if (!this.state.hasUserMedia) return null;

        let canvas = this.getCanvas();
        return canvas.toDataURL(this.props.screenshotFormat);
    }

    getCanvas() {
        if (!this.state.hasUserMedia) return null;

        const video = findDOMNode(this);
        if (!this.ctx) {
            let canvas = document.createElement('canvas');
            const aspectRatio = video.videoWidth / video.videoHeight;

            canvas.width = video.clientWidth;
            canvas.height = video.clientWidth / aspectRatio;

            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
        }

        const {ctx, canvas} = this;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        return canvas;
    }

    render() {
        return (
            <video
                autoPlay
                style={this.props.style}
                src={this.state.src}
                muted={this.props.muted}
                className={this.props.className}
            />
        );
    }
}
