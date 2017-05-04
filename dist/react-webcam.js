(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom"], factory);
	else if(typeof exports === 'object')
		exports["Webcam"] = factory(require("react"), require("react-dom"));
	else
		root["Webcam"] = factory(root["React"], root["ReactDOM"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(3);

	var _getDeviceId = __webpack_require__(1);

	var _getDeviceId2 = _interopRequireDefault(_getDeviceId);

	function hasGetUserMedia() {
	    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
	}

	var Webcam = (function (_Component) {
	    _inherits(Webcam, _Component);

	    _createClass(Webcam, null, [{
	        key: 'defaultProps',
	        value: {
	            audio: false,
	            style: {
	                height: 480,
	                width: 640
	            },
	            screenshotFormat: 'image/jpeg',
	            onUserMedia: function onUserMedia() {}
	        },
	        enumerable: true
	    }, {
	        key: 'propTypes',
	        value: {
	            audio: _react.PropTypes.bool,
	            muted: _react.PropTypes.bool,
	            onUserMedia: _react.PropTypes.func,
	            style: _react.PropTypes.object,
	            facingMode: _react.PropTypes.oneOf(['front', 'rear']),
	            audioSource: _react.PropTypes.string,
	            videoSource: _react.PropTypes.string,
	            screenshotFormat: _react.PropTypes.oneOf(['image/webp', 'image/png', 'image/jpeg']),
	            className: _react.PropTypes.string
	        },
	        enumerable: true
	    }, {
	        key: 'mountedInstances',
	        value: [],
	        enumerable: true
	    }, {
	        key: 'userMediaRequested',
	        value: false,
	        enumerable: true
	    }]);

	    function Webcam() {
	        _classCallCheck(this, Webcam);

	        _Component.call(this);
	        this.state = {
	            hasUserMedia: false
	        };
	    }

	    Webcam.prototype.componentDidMount = function componentDidMount() {
	        if (!hasGetUserMedia()) return;

	        Webcam.mountedInstances.push(this);

	        if (!this.state.hasUserMedia && !Webcam.userMediaRequested) {
	            this.requestUserMedia();
	        }
	    };

	    Webcam.prototype.requestUserMedia = function requestUserMedia() {
	        var _this = this;

	        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

	        var sourceSelected = function sourceSelected(audioSource, videoSource) {
	            var constraints = {
	                video: {
	                    optional: [{ sourceId: videoSource }]
	                }
	            };

	            if (_this.props.audio) {
	                constraints.audio = {
	                    optional: [{ sourceId: audioSource }]
	                };
	            }

	            navigator.getUserMedia(constraints, function (stream) {
	                Webcam.mountedInstances.forEach(function (instance) {
	                    return instance.handleUserMedia(null, stream);
	                });
	            }, function (e) {
	                Webcam.mountedInstances.forEach(function (instance) {
	                    return instance.handleUserMedia(e);
	                });
	            });
	        };

	        if (this.props.audioSource && this.props.videoSource) {
	            sourceSelected(this.props.audioSource, this.props.videoSource);
	        } else {
	            (function () {
	                var audioSource = 'default';
	                _getDeviceId2['default'](_this.props.facingMode).then(function (videoSource) {
	                    return sourceSelected(audioSource, videoSource);
	                })['catch'](function (error) {
	                    return console.error(error.name + ': ' + error.message);
	                });
	            })();
	        }

	        Webcam.userMediaRequested = true;
	    };

	    Webcam.prototype.handleUserMedia = function handleUserMedia(error, stream) {
	        if (error) {
	            this.setState({
	                hasUserMedia: false
	            });

	            return;
	        }

	        var src = window.URL.createObjectURL(stream);

	        this.stream = stream;
	        this.setState({
	            hasUserMedia: true,
	            src: src
	        });

	        this.props.onUserMedia();
	    };

	    Webcam.prototype.componentWillUnmount = function componentWillUnmount() {
	        var index = Webcam.mountedInstances.indexOf(this);
	        Webcam.mountedInstances.splice(index, 1);

	        if (Webcam.mountedInstances.length === 0 && this.state.hasUserMedia) {
	            if (this.stream.stop) {
	                this.stream.stop();
	            } else {
	                if (this.stream.getVideoTracks) {
	                    for (var _iterator = this.stream.getVideoTracks(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	                        var _ref;

	                        if (_isArray) {
	                            if (_i >= _iterator.length) break;
	                            _ref = _iterator[_i++];
	                        } else {
	                            _i = _iterator.next();
	                            if (_i.done) break;
	                            _ref = _i.value;
	                        }

	                        var track = _ref;

	                        track.stop();
	                    }
	                }
	                if (this.stream.getAudioTracks) {
	                    for (var _iterator2 = this.stream.getAudioTracks(), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
	                        var _ref2;

	                        if (_isArray2) {
	                            if (_i2 >= _iterator2.length) break;
	                            _ref2 = _iterator2[_i2++];
	                        } else {
	                            _i2 = _iterator2.next();
	                            if (_i2.done) break;
	                            _ref2 = _i2.value;
	                        }

	                        var track = _ref2;

	                        track.stop();
	                    }
	                }
	            }
	            Webcam.userMediaRequested = false;
	            window.URL.revokeObjectURL(this.state.src);
	        }
	    };

	    Webcam.prototype.getScreenshot = function getScreenshot() {
	        if (!this.state.hasUserMedia) return null;

	        var canvas = this.getCanvas();
	        return canvas.toDataURL(this.props.screenshotFormat);
	    };

	    Webcam.prototype.getCanvas = function getCanvas() {
	        if (!this.state.hasUserMedia) return null;

	        var video = _reactDom.findDOMNode(this);
	        if (!this.ctx) {
	            var _canvas = document.createElement('canvas');
	            var aspectRatio = video.videoWidth / video.videoHeight;

	            _canvas.width = video.clientWidth;
	            _canvas.height = video.clientWidth / aspectRatio;

	            this.canvas = _canvas;
	            this.ctx = _canvas.getContext('2d');
	        }

	        var ctx = this.ctx;
	        var canvas = this.canvas;

	        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

	        return canvas;
	    };

	    Webcam.prototype.render = function render() {
	        return _react2['default'].createElement('video', {
	            autoPlay: true,
	            style: this.props.style,
	            src: this.state.src,
	            muted: this.props.muted,
	            className: this.props.className
	        });
	    };

	    return Webcam;
	})(_react.Component);

	exports['default'] = Webcam;
	module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	/**
	 * Created by Federico on 4/5/2017.
	 */
	'use strict';

	exports.__esModule = true;
	exports['default'] = getDeviceId;

	function getDeviceId(facingMode) {
	    // Get manual deviceId from available devices.
	    return new Promise(function (resolve, reject) {
	        navigator.mediaDevices.enumerateDevices().then(function (devices) {
	            // Filter out non-videoinputs
	            var videoDevices = devices.filter(function (device) {
	                return device.kind == 'videoinput';
	            });

	            if (videoDevices.length < 1) {
	                reject(new Error('No video input devices found'));
	                return;
	            } else if (videoDevices.length == 1) {
	                // Only 1 video device available thus stop here
	                resolve(devices[0].deviceId);
	                return;
	            }

	            var pattern = facingMode == 'rear' ? /rear|back|environment/ig : /front|user|face/ig;

	            // Filter out video devices without the pattern
	            var filteredDevices = videoDevices.filter(function (_ref) {
	                var label = _ref.label;
	                return pattern.test(label);
	            });

	            if (filteredDevices.length > 0) {
	                resolve(filteredDevices[0].deviceId);
	            } else {
	                // No device found with the pattern thus use another video device
	                resolve(videoDevices[0].deviceId);
	            }
	        });
	    });
	}

	module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ })
/******/ ])
});
;