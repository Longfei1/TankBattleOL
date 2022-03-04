/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("../../../packages/protobufjs/pb_minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.gamereq = (function() {

    /**
     * Namespace gamereq.
     * @exports gamereq
     * @namespace
     */
    var gamereq = {};

    gamereq.LoginIn = (function() {

        /**
         * Properties of a LoginIn.
         * @memberof gamereq
         * @interface ILoginIn
         * @property {number|null} [userid] LoginIn userid
         * @property {number|Long|null} [timestamp] LoginIn timestamp
         * @property {number|null} [syncframe] LoginIn syncframe
         */

        /**
         * Constructs a new LoginIn.
         * @memberof gamereq
         * @classdesc Represents a LoginIn.
         * @implements ILoginIn
         * @constructor
         * @param {gamereq.ILoginIn=} [properties] Properties to set
         */
        function LoginIn(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LoginIn userid.
         * @member {number} userid
         * @memberof gamereq.LoginIn
         * @instance
         */
        LoginIn.prototype.userid = 0;

        /**
         * LoginIn timestamp.
         * @member {number|Long} timestamp
         * @memberof gamereq.LoginIn
         * @instance
         */
        LoginIn.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * LoginIn syncframe.
         * @member {number} syncframe
         * @memberof gamereq.LoginIn
         * @instance
         */
        LoginIn.prototype.syncframe = 0;

        /**
         * Creates a new LoginIn instance using the specified properties.
         * @function create
         * @memberof gamereq.LoginIn
         * @static
         * @param {gamereq.ILoginIn=} [properties] Properties to set
         * @returns {gamereq.LoginIn} LoginIn instance
         */
        LoginIn.create = function create(properties) {
            return new LoginIn(properties);
        };

        /**
         * Encodes the specified LoginIn message. Does not implicitly {@link gamereq.LoginIn.verify|verify} messages.
         * @function encode
         * @memberof gamereq.LoginIn
         * @static
         * @param {gamereq.ILoginIn} message LoginIn message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginIn.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.userid != null && Object.hasOwnProperty.call(message, "userid"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.userid);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.timestamp);
            if (message.syncframe != null && Object.hasOwnProperty.call(message, "syncframe"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.syncframe);
            return writer;
        };

        /**
         * Encodes the specified LoginIn message, length delimited. Does not implicitly {@link gamereq.LoginIn.verify|verify} messages.
         * @function encodeDelimited
         * @memberof gamereq.LoginIn
         * @static
         * @param {gamereq.ILoginIn} message LoginIn message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginIn.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LoginIn message from the specified reader or buffer.
         * @function decode
         * @memberof gamereq.LoginIn
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {gamereq.LoginIn} LoginIn
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginIn.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gamereq.LoginIn();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userid = reader.uint32();
                    break;
                case 2:
                    message.timestamp = reader.uint64();
                    break;
                case 3:
                    message.syncframe = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LoginIn message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof gamereq.LoginIn
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {gamereq.LoginIn} LoginIn
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginIn.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LoginIn message.
         * @function verify
         * @memberof gamereq.LoginIn
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LoginIn.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.userid != null && message.hasOwnProperty("userid"))
                if (!$util.isInteger(message.userid))
                    return "userid: integer expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.syncframe != null && message.hasOwnProperty("syncframe"))
                if (!$util.isInteger(message.syncframe))
                    return "syncframe: integer expected";
            return null;
        };

        /**
         * Creates a LoginIn message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof gamereq.LoginIn
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {gamereq.LoginIn} LoginIn
         */
        LoginIn.fromObject = function fromObject(object) {
            if (object instanceof $root.gamereq.LoginIn)
                return object;
            var message = new $root.gamereq.LoginIn();
            if (object.userid != null)
                message.userid = object.userid >>> 0;
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
            if (object.syncframe != null)
                message.syncframe = object.syncframe >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a LoginIn message. Also converts values to other types if specified.
         * @function toObject
         * @memberof gamereq.LoginIn
         * @static
         * @param {gamereq.LoginIn} message LoginIn
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LoginIn.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.userid = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.syncframe = 0;
            }
            if (message.userid != null && message.hasOwnProperty("userid"))
                object.userid = message.userid;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
            if (message.syncframe != null && message.hasOwnProperty("syncframe"))
                object.syncframe = message.syncframe;
            return object;
        };

        /**
         * Converts this LoginIn to JSON.
         * @function toJSON
         * @memberof gamereq.LoginIn
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LoginIn.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LoginIn;
    })();

    gamereq.PlayerInfo = (function() {

        /**
         * Properties of a PlayerInfo.
         * @memberof gamereq
         * @interface IPlayerInfo
         * @property {number|null} [playerno] PlayerInfo playerno
         * @property {number|null} [userid] PlayerInfo userid
         * @property {boolean|null} [ready] PlayerInfo ready
         */

        /**
         * Constructs a new PlayerInfo.
         * @memberof gamereq
         * @classdesc Represents a PlayerInfo.
         * @implements IPlayerInfo
         * @constructor
         * @param {gamereq.IPlayerInfo=} [properties] Properties to set
         */
        function PlayerInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PlayerInfo playerno.
         * @member {number} playerno
         * @memberof gamereq.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.playerno = 0;

        /**
         * PlayerInfo userid.
         * @member {number} userid
         * @memberof gamereq.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.userid = 0;

        /**
         * PlayerInfo ready.
         * @member {boolean} ready
         * @memberof gamereq.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.ready = false;

        /**
         * Creates a new PlayerInfo instance using the specified properties.
         * @function create
         * @memberof gamereq.PlayerInfo
         * @static
         * @param {gamereq.IPlayerInfo=} [properties] Properties to set
         * @returns {gamereq.PlayerInfo} PlayerInfo instance
         */
        PlayerInfo.create = function create(properties) {
            return new PlayerInfo(properties);
        };

        /**
         * Encodes the specified PlayerInfo message. Does not implicitly {@link gamereq.PlayerInfo.verify|verify} messages.
         * @function encode
         * @memberof gamereq.PlayerInfo
         * @static
         * @param {gamereq.IPlayerInfo} message PlayerInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.playerno != null && Object.hasOwnProperty.call(message, "playerno"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.playerno);
            if (message.userid != null && Object.hasOwnProperty.call(message, "userid"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.userid);
            if (message.ready != null && Object.hasOwnProperty.call(message, "ready"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.ready);
            return writer;
        };

        /**
         * Encodes the specified PlayerInfo message, length delimited. Does not implicitly {@link gamereq.PlayerInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof gamereq.PlayerInfo
         * @static
         * @param {gamereq.IPlayerInfo} message PlayerInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PlayerInfo message from the specified reader or buffer.
         * @function decode
         * @memberof gamereq.PlayerInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {gamereq.PlayerInfo} PlayerInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gamereq.PlayerInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.playerno = reader.uint32();
                    break;
                case 2:
                    message.userid = reader.uint32();
                    break;
                case 3:
                    message.ready = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PlayerInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof gamereq.PlayerInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {gamereq.PlayerInfo} PlayerInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PlayerInfo message.
         * @function verify
         * @memberof gamereq.PlayerInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PlayerInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.playerno != null && message.hasOwnProperty("playerno"))
                if (!$util.isInteger(message.playerno))
                    return "playerno: integer expected";
            if (message.userid != null && message.hasOwnProperty("userid"))
                if (!$util.isInteger(message.userid))
                    return "userid: integer expected";
            if (message.ready != null && message.hasOwnProperty("ready"))
                if (typeof message.ready !== "boolean")
                    return "ready: boolean expected";
            return null;
        };

        /**
         * Creates a PlayerInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof gamereq.PlayerInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {gamereq.PlayerInfo} PlayerInfo
         */
        PlayerInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.gamereq.PlayerInfo)
                return object;
            var message = new $root.gamereq.PlayerInfo();
            if (object.playerno != null)
                message.playerno = object.playerno >>> 0;
            if (object.userid != null)
                message.userid = object.userid >>> 0;
            if (object.ready != null)
                message.ready = Boolean(object.ready);
            return message;
        };

        /**
         * Creates a plain object from a PlayerInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof gamereq.PlayerInfo
         * @static
         * @param {gamereq.PlayerInfo} message PlayerInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PlayerInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.playerno = 0;
                object.userid = 0;
                object.ready = false;
            }
            if (message.playerno != null && message.hasOwnProperty("playerno"))
                object.playerno = message.playerno;
            if (message.userid != null && message.hasOwnProperty("userid"))
                object.userid = message.userid;
            if (message.ready != null && message.hasOwnProperty("ready"))
                object.ready = message.ready;
            return object;
        };

        /**
         * Converts this PlayerInfo to JSON.
         * @function toJSON
         * @memberof gamereq.PlayerInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PlayerInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PlayerInfo;
    })();

    gamereq.LoginInRsp = (function() {

        /**
         * Properties of a LoginInRsp.
         * @memberof gamereq
         * @interface ILoginInRsp
         * @property {number|null} [userid] LoginInRsp userid
         * @property {number|Long|null} [timestamp] LoginInRsp timestamp
         * @property {number|null} [roomid] LoginInRsp roomid
         * @property {number|null} [roomstatus] LoginInRsp roomstatus
         * @property {number|null} [menuindex] LoginInRsp menuindex
         * @property {number|null} [gamemode] LoginInRsp gamemode
         * @property {number|null} [randomseed] LoginInRsp randomseed
         * @property {Array.<gamereq.IPlayerInfo>|null} [players] LoginInRsp players
         * @property {Array.<gamereq.IGameFrameNtf>|null} [framerecord] LoginInRsp framerecord
         */

        /**
         * Constructs a new LoginInRsp.
         * @memberof gamereq
         * @classdesc Represents a LoginInRsp.
         * @implements ILoginInRsp
         * @constructor
         * @param {gamereq.ILoginInRsp=} [properties] Properties to set
         */
        function LoginInRsp(properties) {
            this.players = [];
            this.framerecord = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LoginInRsp userid.
         * @member {number} userid
         * @memberof gamereq.LoginInRsp
         * @instance
         */
        LoginInRsp.prototype.userid = 0;

        /**
         * LoginInRsp timestamp.
         * @member {number|Long} timestamp
         * @memberof gamereq.LoginInRsp
         * @instance
         */
        LoginInRsp.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * LoginInRsp roomid.
         * @member {number} roomid
         * @memberof gamereq.LoginInRsp
         * @instance
         */
        LoginInRsp.prototype.roomid = 0;

        /**
         * LoginInRsp roomstatus.
         * @member {number} roomstatus
         * @memberof gamereq.LoginInRsp
         * @instance
         */
        LoginInRsp.prototype.roomstatus = 0;

        /**
         * LoginInRsp menuindex.
         * @member {number} menuindex
         * @memberof gamereq.LoginInRsp
         * @instance
         */
        LoginInRsp.prototype.menuindex = 0;

        /**
         * LoginInRsp gamemode.
         * @member {number} gamemode
         * @memberof gamereq.LoginInRsp
         * @instance
         */
        LoginInRsp.prototype.gamemode = 0;

        /**
         * LoginInRsp randomseed.
         * @member {number} randomseed
         * @memberof gamereq.LoginInRsp
         * @instance
         */
        LoginInRsp.prototype.randomseed = 0;

        /**
         * LoginInRsp players.
         * @member {Array.<gamereq.IPlayerInfo>} players
         * @memberof gamereq.LoginInRsp
         * @instance
         */
        LoginInRsp.prototype.players = $util.emptyArray;

        /**
         * LoginInRsp framerecord.
         * @member {Array.<gamereq.IGameFrameNtf>} framerecord
         * @memberof gamereq.LoginInRsp
         * @instance
         */
        LoginInRsp.prototype.framerecord = $util.emptyArray;

        /**
         * Creates a new LoginInRsp instance using the specified properties.
         * @function create
         * @memberof gamereq.LoginInRsp
         * @static
         * @param {gamereq.ILoginInRsp=} [properties] Properties to set
         * @returns {gamereq.LoginInRsp} LoginInRsp instance
         */
        LoginInRsp.create = function create(properties) {
            return new LoginInRsp(properties);
        };

        /**
         * Encodes the specified LoginInRsp message. Does not implicitly {@link gamereq.LoginInRsp.verify|verify} messages.
         * @function encode
         * @memberof gamereq.LoginInRsp
         * @static
         * @param {gamereq.ILoginInRsp} message LoginInRsp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginInRsp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.userid != null && Object.hasOwnProperty.call(message, "userid"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.userid);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.timestamp);
            if (message.roomid != null && Object.hasOwnProperty.call(message, "roomid"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.roomid);
            if (message.roomstatus != null && Object.hasOwnProperty.call(message, "roomstatus"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.roomstatus);
            if (message.menuindex != null && Object.hasOwnProperty.call(message, "menuindex"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.menuindex);
            if (message.gamemode != null && Object.hasOwnProperty.call(message, "gamemode"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.gamemode);
            if (message.randomseed != null && Object.hasOwnProperty.call(message, "randomseed"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.randomseed);
            if (message.players != null && message.players.length)
                for (var i = 0; i < message.players.length; ++i)
                    $root.gamereq.PlayerInfo.encode(message.players[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.framerecord != null && message.framerecord.length)
                for (var i = 0; i < message.framerecord.length; ++i)
                    $root.gamereq.GameFrameNtf.encode(message.framerecord[i], writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified LoginInRsp message, length delimited. Does not implicitly {@link gamereq.LoginInRsp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof gamereq.LoginInRsp
         * @static
         * @param {gamereq.ILoginInRsp} message LoginInRsp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginInRsp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LoginInRsp message from the specified reader or buffer.
         * @function decode
         * @memberof gamereq.LoginInRsp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {gamereq.LoginInRsp} LoginInRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginInRsp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gamereq.LoginInRsp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userid = reader.uint32();
                    break;
                case 2:
                    message.timestamp = reader.uint64();
                    break;
                case 3:
                    message.roomid = reader.uint32();
                    break;
                case 4:
                    message.roomstatus = reader.uint32();
                    break;
                case 5:
                    message.menuindex = reader.uint32();
                    break;
                case 6:
                    message.gamemode = reader.uint32();
                    break;
                case 7:
                    message.randomseed = reader.uint32();
                    break;
                case 8:
                    if (!(message.players && message.players.length))
                        message.players = [];
                    message.players.push($root.gamereq.PlayerInfo.decode(reader, reader.uint32()));
                    break;
                case 9:
                    if (!(message.framerecord && message.framerecord.length))
                        message.framerecord = [];
                    message.framerecord.push($root.gamereq.GameFrameNtf.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LoginInRsp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof gamereq.LoginInRsp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {gamereq.LoginInRsp} LoginInRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginInRsp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LoginInRsp message.
         * @function verify
         * @memberof gamereq.LoginInRsp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LoginInRsp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.userid != null && message.hasOwnProperty("userid"))
                if (!$util.isInteger(message.userid))
                    return "userid: integer expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.roomid != null && message.hasOwnProperty("roomid"))
                if (!$util.isInteger(message.roomid))
                    return "roomid: integer expected";
            if (message.roomstatus != null && message.hasOwnProperty("roomstatus"))
                if (!$util.isInteger(message.roomstatus))
                    return "roomstatus: integer expected";
            if (message.menuindex != null && message.hasOwnProperty("menuindex"))
                if (!$util.isInteger(message.menuindex))
                    return "menuindex: integer expected";
            if (message.gamemode != null && message.hasOwnProperty("gamemode"))
                if (!$util.isInteger(message.gamemode))
                    return "gamemode: integer expected";
            if (message.randomseed != null && message.hasOwnProperty("randomseed"))
                if (!$util.isInteger(message.randomseed))
                    return "randomseed: integer expected";
            if (message.players != null && message.hasOwnProperty("players")) {
                if (!Array.isArray(message.players))
                    return "players: array expected";
                for (var i = 0; i < message.players.length; ++i) {
                    var error = $root.gamereq.PlayerInfo.verify(message.players[i]);
                    if (error)
                        return "players." + error;
                }
            }
            if (message.framerecord != null && message.hasOwnProperty("framerecord")) {
                if (!Array.isArray(message.framerecord))
                    return "framerecord: array expected";
                for (var i = 0; i < message.framerecord.length; ++i) {
                    var error = $root.gamereq.GameFrameNtf.verify(message.framerecord[i]);
                    if (error)
                        return "framerecord." + error;
                }
            }
            return null;
        };

        /**
         * Creates a LoginInRsp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof gamereq.LoginInRsp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {gamereq.LoginInRsp} LoginInRsp
         */
        LoginInRsp.fromObject = function fromObject(object) {
            if (object instanceof $root.gamereq.LoginInRsp)
                return object;
            var message = new $root.gamereq.LoginInRsp();
            if (object.userid != null)
                message.userid = object.userid >>> 0;
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
            if (object.roomid != null)
                message.roomid = object.roomid >>> 0;
            if (object.roomstatus != null)
                message.roomstatus = object.roomstatus >>> 0;
            if (object.menuindex != null)
                message.menuindex = object.menuindex >>> 0;
            if (object.gamemode != null)
                message.gamemode = object.gamemode >>> 0;
            if (object.randomseed != null)
                message.randomseed = object.randomseed >>> 0;
            if (object.players) {
                if (!Array.isArray(object.players))
                    throw TypeError(".gamereq.LoginInRsp.players: array expected");
                message.players = [];
                for (var i = 0; i < object.players.length; ++i) {
                    if (typeof object.players[i] !== "object")
                        throw TypeError(".gamereq.LoginInRsp.players: object expected");
                    message.players[i] = $root.gamereq.PlayerInfo.fromObject(object.players[i]);
                }
            }
            if (object.framerecord) {
                if (!Array.isArray(object.framerecord))
                    throw TypeError(".gamereq.LoginInRsp.framerecord: array expected");
                message.framerecord = [];
                for (var i = 0; i < object.framerecord.length; ++i) {
                    if (typeof object.framerecord[i] !== "object")
                        throw TypeError(".gamereq.LoginInRsp.framerecord: object expected");
                    message.framerecord[i] = $root.gamereq.GameFrameNtf.fromObject(object.framerecord[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a LoginInRsp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof gamereq.LoginInRsp
         * @static
         * @param {gamereq.LoginInRsp} message LoginInRsp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LoginInRsp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.players = [];
                object.framerecord = [];
            }
            if (options.defaults) {
                object.userid = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.roomid = 0;
                object.roomstatus = 0;
                object.menuindex = 0;
                object.gamemode = 0;
                object.randomseed = 0;
            }
            if (message.userid != null && message.hasOwnProperty("userid"))
                object.userid = message.userid;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
            if (message.roomid != null && message.hasOwnProperty("roomid"))
                object.roomid = message.roomid;
            if (message.roomstatus != null && message.hasOwnProperty("roomstatus"))
                object.roomstatus = message.roomstatus;
            if (message.menuindex != null && message.hasOwnProperty("menuindex"))
                object.menuindex = message.menuindex;
            if (message.gamemode != null && message.hasOwnProperty("gamemode"))
                object.gamemode = message.gamemode;
            if (message.randomseed != null && message.hasOwnProperty("randomseed"))
                object.randomseed = message.randomseed;
            if (message.players && message.players.length) {
                object.players = [];
                for (var j = 0; j < message.players.length; ++j)
                    object.players[j] = $root.gamereq.PlayerInfo.toObject(message.players[j], options);
            }
            if (message.framerecord && message.framerecord.length) {
                object.framerecord = [];
                for (var j = 0; j < message.framerecord.length; ++j)
                    object.framerecord[j] = $root.gamereq.GameFrameNtf.toObject(message.framerecord[j], options);
            }
            return object;
        };

        /**
         * Converts this LoginInRsp to JSON.
         * @function toJSON
         * @memberof gamereq.LoginInRsp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LoginInRsp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LoginInRsp;
    })();

    gamereq.ErrorInfo = (function() {

        /**
         * Properties of an ErrorInfo.
         * @memberof gamereq
         * @interface IErrorInfo
         * @property {string|null} [description] ErrorInfo description
         */

        /**
         * Constructs a new ErrorInfo.
         * @memberof gamereq
         * @classdesc Represents an ErrorInfo.
         * @implements IErrorInfo
         * @constructor
         * @param {gamereq.IErrorInfo=} [properties] Properties to set
         */
        function ErrorInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ErrorInfo description.
         * @member {string} description
         * @memberof gamereq.ErrorInfo
         * @instance
         */
        ErrorInfo.prototype.description = "";

        /**
         * Creates a new ErrorInfo instance using the specified properties.
         * @function create
         * @memberof gamereq.ErrorInfo
         * @static
         * @param {gamereq.IErrorInfo=} [properties] Properties to set
         * @returns {gamereq.ErrorInfo} ErrorInfo instance
         */
        ErrorInfo.create = function create(properties) {
            return new ErrorInfo(properties);
        };

        /**
         * Encodes the specified ErrorInfo message. Does not implicitly {@link gamereq.ErrorInfo.verify|verify} messages.
         * @function encode
         * @memberof gamereq.ErrorInfo
         * @static
         * @param {gamereq.IErrorInfo} message ErrorInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ErrorInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.description);
            return writer;
        };

        /**
         * Encodes the specified ErrorInfo message, length delimited. Does not implicitly {@link gamereq.ErrorInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof gamereq.ErrorInfo
         * @static
         * @param {gamereq.IErrorInfo} message ErrorInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ErrorInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ErrorInfo message from the specified reader or buffer.
         * @function decode
         * @memberof gamereq.ErrorInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {gamereq.ErrorInfo} ErrorInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ErrorInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gamereq.ErrorInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.description = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ErrorInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof gamereq.ErrorInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {gamereq.ErrorInfo} ErrorInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ErrorInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ErrorInfo message.
         * @function verify
         * @memberof gamereq.ErrorInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ErrorInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.description != null && message.hasOwnProperty("description"))
                if (!$util.isString(message.description))
                    return "description: string expected";
            return null;
        };

        /**
         * Creates an ErrorInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof gamereq.ErrorInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {gamereq.ErrorInfo} ErrorInfo
         */
        ErrorInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.gamereq.ErrorInfo)
                return object;
            var message = new $root.gamereq.ErrorInfo();
            if (object.description != null)
                message.description = String(object.description);
            return message;
        };

        /**
         * Creates a plain object from an ErrorInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof gamereq.ErrorInfo
         * @static
         * @param {gamereq.ErrorInfo} message ErrorInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ErrorInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.description = "";
            if (message.description != null && message.hasOwnProperty("description"))
                object.description = message.description;
            return object;
        };

        /**
         * Converts this ErrorInfo to JSON.
         * @function toJSON
         * @memberof gamereq.ErrorInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ErrorInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ErrorInfo;
    })();

    gamereq.UserInfo = (function() {

        /**
         * Properties of a UserInfo.
         * @memberof gamereq
         * @interface IUserInfo
         * @property {number|null} [userid] UserInfo userid
         */

        /**
         * Constructs a new UserInfo.
         * @memberof gamereq
         * @classdesc Represents a UserInfo.
         * @implements IUserInfo
         * @constructor
         * @param {gamereq.IUserInfo=} [properties] Properties to set
         */
        function UserInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UserInfo userid.
         * @member {number} userid
         * @memberof gamereq.UserInfo
         * @instance
         */
        UserInfo.prototype.userid = 0;

        /**
         * Creates a new UserInfo instance using the specified properties.
         * @function create
         * @memberof gamereq.UserInfo
         * @static
         * @param {gamereq.IUserInfo=} [properties] Properties to set
         * @returns {gamereq.UserInfo} UserInfo instance
         */
        UserInfo.create = function create(properties) {
            return new UserInfo(properties);
        };

        /**
         * Encodes the specified UserInfo message. Does not implicitly {@link gamereq.UserInfo.verify|verify} messages.
         * @function encode
         * @memberof gamereq.UserInfo
         * @static
         * @param {gamereq.IUserInfo} message UserInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.userid != null && Object.hasOwnProperty.call(message, "userid"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.userid);
            return writer;
        };

        /**
         * Encodes the specified UserInfo message, length delimited. Does not implicitly {@link gamereq.UserInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof gamereq.UserInfo
         * @static
         * @param {gamereq.IUserInfo} message UserInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a UserInfo message from the specified reader or buffer.
         * @function decode
         * @memberof gamereq.UserInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {gamereq.UserInfo} UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gamereq.UserInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userid = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a UserInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof gamereq.UserInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {gamereq.UserInfo} UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a UserInfo message.
         * @function verify
         * @memberof gamereq.UserInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UserInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.userid != null && message.hasOwnProperty("userid"))
                if (!$util.isInteger(message.userid))
                    return "userid: integer expected";
            return null;
        };

        /**
         * Creates a UserInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof gamereq.UserInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {gamereq.UserInfo} UserInfo
         */
        UserInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.gamereq.UserInfo)
                return object;
            var message = new $root.gamereq.UserInfo();
            if (object.userid != null)
                message.userid = object.userid >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a UserInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof gamereq.UserInfo
         * @static
         * @param {gamereq.UserInfo} message UserInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UserInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.userid = 0;
            if (message.userid != null && message.hasOwnProperty("userid"))
                object.userid = message.userid;
            return object;
        };

        /**
         * Converts this UserInfo to JSON.
         * @function toJSON
         * @memberof gamereq.UserInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UserInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UserInfo;
    })();

    gamereq.RoomPlayerInfo = (function() {

        /**
         * Properties of a RoomPlayerInfo.
         * @memberof gamereq
         * @interface IRoomPlayerInfo
         * @property {number|null} [roomid] RoomPlayerInfo roomid
         * @property {number|null} [playerno] RoomPlayerInfo playerno
         * @property {number|null} [userid] RoomPlayerInfo userid
         */

        /**
         * Constructs a new RoomPlayerInfo.
         * @memberof gamereq
         * @classdesc Represents a RoomPlayerInfo.
         * @implements IRoomPlayerInfo
         * @constructor
         * @param {gamereq.IRoomPlayerInfo=} [properties] Properties to set
         */
        function RoomPlayerInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomPlayerInfo roomid.
         * @member {number} roomid
         * @memberof gamereq.RoomPlayerInfo
         * @instance
         */
        RoomPlayerInfo.prototype.roomid = 0;

        /**
         * RoomPlayerInfo playerno.
         * @member {number} playerno
         * @memberof gamereq.RoomPlayerInfo
         * @instance
         */
        RoomPlayerInfo.prototype.playerno = 0;

        /**
         * RoomPlayerInfo userid.
         * @member {number} userid
         * @memberof gamereq.RoomPlayerInfo
         * @instance
         */
        RoomPlayerInfo.prototype.userid = 0;

        /**
         * Creates a new RoomPlayerInfo instance using the specified properties.
         * @function create
         * @memberof gamereq.RoomPlayerInfo
         * @static
         * @param {gamereq.IRoomPlayerInfo=} [properties] Properties to set
         * @returns {gamereq.RoomPlayerInfo} RoomPlayerInfo instance
         */
        RoomPlayerInfo.create = function create(properties) {
            return new RoomPlayerInfo(properties);
        };

        /**
         * Encodes the specified RoomPlayerInfo message. Does not implicitly {@link gamereq.RoomPlayerInfo.verify|verify} messages.
         * @function encode
         * @memberof gamereq.RoomPlayerInfo
         * @static
         * @param {gamereq.IRoomPlayerInfo} message RoomPlayerInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomPlayerInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomid != null && Object.hasOwnProperty.call(message, "roomid"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.roomid);
            if (message.playerno != null && Object.hasOwnProperty.call(message, "playerno"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.playerno);
            if (message.userid != null && Object.hasOwnProperty.call(message, "userid"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.userid);
            return writer;
        };

        /**
         * Encodes the specified RoomPlayerInfo message, length delimited. Does not implicitly {@link gamereq.RoomPlayerInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof gamereq.RoomPlayerInfo
         * @static
         * @param {gamereq.IRoomPlayerInfo} message RoomPlayerInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomPlayerInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomPlayerInfo message from the specified reader or buffer.
         * @function decode
         * @memberof gamereq.RoomPlayerInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {gamereq.RoomPlayerInfo} RoomPlayerInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomPlayerInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gamereq.RoomPlayerInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomid = reader.uint32();
                    break;
                case 2:
                    message.playerno = reader.uint32();
                    break;
                case 3:
                    message.userid = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomPlayerInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof gamereq.RoomPlayerInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {gamereq.RoomPlayerInfo} RoomPlayerInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomPlayerInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomPlayerInfo message.
         * @function verify
         * @memberof gamereq.RoomPlayerInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomPlayerInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomid != null && message.hasOwnProperty("roomid"))
                if (!$util.isInteger(message.roomid))
                    return "roomid: integer expected";
            if (message.playerno != null && message.hasOwnProperty("playerno"))
                if (!$util.isInteger(message.playerno))
                    return "playerno: integer expected";
            if (message.userid != null && message.hasOwnProperty("userid"))
                if (!$util.isInteger(message.userid))
                    return "userid: integer expected";
            return null;
        };

        /**
         * Creates a RoomPlayerInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof gamereq.RoomPlayerInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {gamereq.RoomPlayerInfo} RoomPlayerInfo
         */
        RoomPlayerInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.gamereq.RoomPlayerInfo)
                return object;
            var message = new $root.gamereq.RoomPlayerInfo();
            if (object.roomid != null)
                message.roomid = object.roomid >>> 0;
            if (object.playerno != null)
                message.playerno = object.playerno >>> 0;
            if (object.userid != null)
                message.userid = object.userid >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a RoomPlayerInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof gamereq.RoomPlayerInfo
         * @static
         * @param {gamereq.RoomPlayerInfo} message RoomPlayerInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomPlayerInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.roomid = 0;
                object.playerno = 0;
                object.userid = 0;
            }
            if (message.roomid != null && message.hasOwnProperty("roomid"))
                object.roomid = message.roomid;
            if (message.playerno != null && message.hasOwnProperty("playerno"))
                object.playerno = message.playerno;
            if (message.userid != null && message.hasOwnProperty("userid"))
                object.userid = message.userid;
            return object;
        };

        /**
         * Converts this RoomPlayerInfo to JSON.
         * @function toJSON
         * @memberof gamereq.RoomPlayerInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomPlayerInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomPlayerInfo;
    })();

    gamereq.MenuSwitchInfo = (function() {

        /**
         * Properties of a MenuSwitchInfo.
         * @memberof gamereq
         * @interface IMenuSwitchInfo
         * @property {gamereq.IRoomPlayerInfo|null} [where] MenuSwitchInfo where
         * @property {number|null} [index] MenuSwitchInfo index
         */

        /**
         * Constructs a new MenuSwitchInfo.
         * @memberof gamereq
         * @classdesc Represents a MenuSwitchInfo.
         * @implements IMenuSwitchInfo
         * @constructor
         * @param {gamereq.IMenuSwitchInfo=} [properties] Properties to set
         */
        function MenuSwitchInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MenuSwitchInfo where.
         * @member {gamereq.IRoomPlayerInfo|null|undefined} where
         * @memberof gamereq.MenuSwitchInfo
         * @instance
         */
        MenuSwitchInfo.prototype.where = null;

        /**
         * MenuSwitchInfo index.
         * @member {number} index
         * @memberof gamereq.MenuSwitchInfo
         * @instance
         */
        MenuSwitchInfo.prototype.index = 0;

        /**
         * Creates a new MenuSwitchInfo instance using the specified properties.
         * @function create
         * @memberof gamereq.MenuSwitchInfo
         * @static
         * @param {gamereq.IMenuSwitchInfo=} [properties] Properties to set
         * @returns {gamereq.MenuSwitchInfo} MenuSwitchInfo instance
         */
        MenuSwitchInfo.create = function create(properties) {
            return new MenuSwitchInfo(properties);
        };

        /**
         * Encodes the specified MenuSwitchInfo message. Does not implicitly {@link gamereq.MenuSwitchInfo.verify|verify} messages.
         * @function encode
         * @memberof gamereq.MenuSwitchInfo
         * @static
         * @param {gamereq.IMenuSwitchInfo} message MenuSwitchInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MenuSwitchInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.where != null && Object.hasOwnProperty.call(message, "where"))
                $root.gamereq.RoomPlayerInfo.encode(message.where, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.index != null && Object.hasOwnProperty.call(message, "index"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.index);
            return writer;
        };

        /**
         * Encodes the specified MenuSwitchInfo message, length delimited. Does not implicitly {@link gamereq.MenuSwitchInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof gamereq.MenuSwitchInfo
         * @static
         * @param {gamereq.IMenuSwitchInfo} message MenuSwitchInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MenuSwitchInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MenuSwitchInfo message from the specified reader or buffer.
         * @function decode
         * @memberof gamereq.MenuSwitchInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {gamereq.MenuSwitchInfo} MenuSwitchInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MenuSwitchInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gamereq.MenuSwitchInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.where = $root.gamereq.RoomPlayerInfo.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.index = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MenuSwitchInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof gamereq.MenuSwitchInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {gamereq.MenuSwitchInfo} MenuSwitchInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MenuSwitchInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MenuSwitchInfo message.
         * @function verify
         * @memberof gamereq.MenuSwitchInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MenuSwitchInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.where != null && message.hasOwnProperty("where")) {
                var error = $root.gamereq.RoomPlayerInfo.verify(message.where);
                if (error)
                    return "where." + error;
            }
            if (message.index != null && message.hasOwnProperty("index"))
                if (!$util.isInteger(message.index))
                    return "index: integer expected";
            return null;
        };

        /**
         * Creates a MenuSwitchInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof gamereq.MenuSwitchInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {gamereq.MenuSwitchInfo} MenuSwitchInfo
         */
        MenuSwitchInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.gamereq.MenuSwitchInfo)
                return object;
            var message = new $root.gamereq.MenuSwitchInfo();
            if (object.where != null) {
                if (typeof object.where !== "object")
                    throw TypeError(".gamereq.MenuSwitchInfo.where: object expected");
                message.where = $root.gamereq.RoomPlayerInfo.fromObject(object.where);
            }
            if (object.index != null)
                message.index = object.index >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a MenuSwitchInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof gamereq.MenuSwitchInfo
         * @static
         * @param {gamereq.MenuSwitchInfo} message MenuSwitchInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MenuSwitchInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.where = null;
                object.index = 0;
            }
            if (message.where != null && message.hasOwnProperty("where"))
                object.where = $root.gamereq.RoomPlayerInfo.toObject(message.where, options);
            if (message.index != null && message.hasOwnProperty("index"))
                object.index = message.index;
            return object;
        };

        /**
         * Converts this MenuSwitchInfo to JSON.
         * @function toJSON
         * @memberof gamereq.MenuSwitchInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MenuSwitchInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return MenuSwitchInfo;
    })();

    gamereq.MenuChooseInfo = (function() {

        /**
         * Properties of a MenuChooseInfo.
         * @memberof gamereq
         * @interface IMenuChooseInfo
         * @property {gamereq.IRoomPlayerInfo|null} [where] MenuChooseInfo where
         * @property {number|null} [index] MenuChooseInfo index
         */

        /**
         * Constructs a new MenuChooseInfo.
         * @memberof gamereq
         * @classdesc Represents a MenuChooseInfo.
         * @implements IMenuChooseInfo
         * @constructor
         * @param {gamereq.IMenuChooseInfo=} [properties] Properties to set
         */
        function MenuChooseInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MenuChooseInfo where.
         * @member {gamereq.IRoomPlayerInfo|null|undefined} where
         * @memberof gamereq.MenuChooseInfo
         * @instance
         */
        MenuChooseInfo.prototype.where = null;

        /**
         * MenuChooseInfo index.
         * @member {number} index
         * @memberof gamereq.MenuChooseInfo
         * @instance
         */
        MenuChooseInfo.prototype.index = 0;

        /**
         * Creates a new MenuChooseInfo instance using the specified properties.
         * @function create
         * @memberof gamereq.MenuChooseInfo
         * @static
         * @param {gamereq.IMenuChooseInfo=} [properties] Properties to set
         * @returns {gamereq.MenuChooseInfo} MenuChooseInfo instance
         */
        MenuChooseInfo.create = function create(properties) {
            return new MenuChooseInfo(properties);
        };

        /**
         * Encodes the specified MenuChooseInfo message. Does not implicitly {@link gamereq.MenuChooseInfo.verify|verify} messages.
         * @function encode
         * @memberof gamereq.MenuChooseInfo
         * @static
         * @param {gamereq.IMenuChooseInfo} message MenuChooseInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MenuChooseInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.where != null && Object.hasOwnProperty.call(message, "where"))
                $root.gamereq.RoomPlayerInfo.encode(message.where, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.index != null && Object.hasOwnProperty.call(message, "index"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.index);
            return writer;
        };

        /**
         * Encodes the specified MenuChooseInfo message, length delimited. Does not implicitly {@link gamereq.MenuChooseInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof gamereq.MenuChooseInfo
         * @static
         * @param {gamereq.IMenuChooseInfo} message MenuChooseInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MenuChooseInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MenuChooseInfo message from the specified reader or buffer.
         * @function decode
         * @memberof gamereq.MenuChooseInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {gamereq.MenuChooseInfo} MenuChooseInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MenuChooseInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gamereq.MenuChooseInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.where = $root.gamereq.RoomPlayerInfo.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.index = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MenuChooseInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof gamereq.MenuChooseInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {gamereq.MenuChooseInfo} MenuChooseInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MenuChooseInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MenuChooseInfo message.
         * @function verify
         * @memberof gamereq.MenuChooseInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MenuChooseInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.where != null && message.hasOwnProperty("where")) {
                var error = $root.gamereq.RoomPlayerInfo.verify(message.where);
                if (error)
                    return "where." + error;
            }
            if (message.index != null && message.hasOwnProperty("index"))
                if (!$util.isInteger(message.index))
                    return "index: integer expected";
            return null;
        };

        /**
         * Creates a MenuChooseInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof gamereq.MenuChooseInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {gamereq.MenuChooseInfo} MenuChooseInfo
         */
        MenuChooseInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.gamereq.MenuChooseInfo)
                return object;
            var message = new $root.gamereq.MenuChooseInfo();
            if (object.where != null) {
                if (typeof object.where !== "object")
                    throw TypeError(".gamereq.MenuChooseInfo.where: object expected");
                message.where = $root.gamereq.RoomPlayerInfo.fromObject(object.where);
            }
            if (object.index != null)
                message.index = object.index | 0;
            return message;
        };

        /**
         * Creates a plain object from a MenuChooseInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof gamereq.MenuChooseInfo
         * @static
         * @param {gamereq.MenuChooseInfo} message MenuChooseInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MenuChooseInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.where = null;
                object.index = 0;
            }
            if (message.where != null && message.hasOwnProperty("where"))
                object.where = $root.gamereq.RoomPlayerInfo.toObject(message.where, options);
            if (message.index != null && message.hasOwnProperty("index"))
                object.index = message.index;
            return object;
        };

        /**
         * Converts this MenuChooseInfo to JSON.
         * @function toJSON
         * @memberof gamereq.MenuChooseInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MenuChooseInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return MenuChooseInfo;
    })();

    gamereq.GameStartRsp = (function() {

        /**
         * Properties of a GameStartRsp.
         * @memberof gamereq
         * @interface IGameStartRsp
         * @property {gamereq.IRoomPlayerInfo|null} [where] GameStartRsp where
         * @property {number|null} [mode] GameStartRsp mode
         * @property {number|null} [randomseed] GameStartRsp randomseed
         */

        /**
         * Constructs a new GameStartRsp.
         * @memberof gamereq
         * @classdesc Represents a GameStartRsp.
         * @implements IGameStartRsp
         * @constructor
         * @param {gamereq.IGameStartRsp=} [properties] Properties to set
         */
        function GameStartRsp(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GameStartRsp where.
         * @member {gamereq.IRoomPlayerInfo|null|undefined} where
         * @memberof gamereq.GameStartRsp
         * @instance
         */
        GameStartRsp.prototype.where = null;

        /**
         * GameStartRsp mode.
         * @member {number} mode
         * @memberof gamereq.GameStartRsp
         * @instance
         */
        GameStartRsp.prototype.mode = 0;

        /**
         * GameStartRsp randomseed.
         * @member {number} randomseed
         * @memberof gamereq.GameStartRsp
         * @instance
         */
        GameStartRsp.prototype.randomseed = 0;

        /**
         * Creates a new GameStartRsp instance using the specified properties.
         * @function create
         * @memberof gamereq.GameStartRsp
         * @static
         * @param {gamereq.IGameStartRsp=} [properties] Properties to set
         * @returns {gamereq.GameStartRsp} GameStartRsp instance
         */
        GameStartRsp.create = function create(properties) {
            return new GameStartRsp(properties);
        };

        /**
         * Encodes the specified GameStartRsp message. Does not implicitly {@link gamereq.GameStartRsp.verify|verify} messages.
         * @function encode
         * @memberof gamereq.GameStartRsp
         * @static
         * @param {gamereq.IGameStartRsp} message GameStartRsp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameStartRsp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.where != null && Object.hasOwnProperty.call(message, "where"))
                $root.gamereq.RoomPlayerInfo.encode(message.where, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.mode != null && Object.hasOwnProperty.call(message, "mode"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.mode);
            if (message.randomseed != null && Object.hasOwnProperty.call(message, "randomseed"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.randomseed);
            return writer;
        };

        /**
         * Encodes the specified GameStartRsp message, length delimited. Does not implicitly {@link gamereq.GameStartRsp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof gamereq.GameStartRsp
         * @static
         * @param {gamereq.IGameStartRsp} message GameStartRsp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameStartRsp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameStartRsp message from the specified reader or buffer.
         * @function decode
         * @memberof gamereq.GameStartRsp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {gamereq.GameStartRsp} GameStartRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameStartRsp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gamereq.GameStartRsp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.where = $root.gamereq.RoomPlayerInfo.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.mode = reader.uint32();
                    break;
                case 3:
                    message.randomseed = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GameStartRsp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof gamereq.GameStartRsp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {gamereq.GameStartRsp} GameStartRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameStartRsp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameStartRsp message.
         * @function verify
         * @memberof gamereq.GameStartRsp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameStartRsp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.where != null && message.hasOwnProperty("where")) {
                var error = $root.gamereq.RoomPlayerInfo.verify(message.where);
                if (error)
                    return "where." + error;
            }
            if (message.mode != null && message.hasOwnProperty("mode"))
                if (!$util.isInteger(message.mode))
                    return "mode: integer expected";
            if (message.randomseed != null && message.hasOwnProperty("randomseed"))
                if (!$util.isInteger(message.randomseed))
                    return "randomseed: integer expected";
            return null;
        };

        /**
         * Creates a GameStartRsp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof gamereq.GameStartRsp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {gamereq.GameStartRsp} GameStartRsp
         */
        GameStartRsp.fromObject = function fromObject(object) {
            if (object instanceof $root.gamereq.GameStartRsp)
                return object;
            var message = new $root.gamereq.GameStartRsp();
            if (object.where != null) {
                if (typeof object.where !== "object")
                    throw TypeError(".gamereq.GameStartRsp.where: object expected");
                message.where = $root.gamereq.RoomPlayerInfo.fromObject(object.where);
            }
            if (object.mode != null)
                message.mode = object.mode >>> 0;
            if (object.randomseed != null)
                message.randomseed = object.randomseed >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a GameStartRsp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof gamereq.GameStartRsp
         * @static
         * @param {gamereq.GameStartRsp} message GameStartRsp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameStartRsp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.where = null;
                object.mode = 0;
                object.randomseed = 0;
            }
            if (message.where != null && message.hasOwnProperty("where"))
                object.where = $root.gamereq.RoomPlayerInfo.toObject(message.where, options);
            if (message.mode != null && message.hasOwnProperty("mode"))
                object.mode = message.mode;
            if (message.randomseed != null && message.hasOwnProperty("randomseed"))
                object.randomseed = message.randomseed;
            return object;
        };

        /**
         * Converts this GameStartRsp to JSON.
         * @function toJSON
         * @memberof gamereq.GameStartRsp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameStartRsp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GameStartRsp;
    })();

    gamereq.UserOperation = (function() {

        /**
         * Properties of a UserOperation.
         * @memberof gamereq
         * @interface IUserOperation
         * @property {number|null} [playerno] UserOperation playerno
         * @property {number|null} [opecode] UserOperation opecode
         */

        /**
         * Constructs a new UserOperation.
         * @memberof gamereq
         * @classdesc Represents a UserOperation.
         * @implements IUserOperation
         * @constructor
         * @param {gamereq.IUserOperation=} [properties] Properties to set
         */
        function UserOperation(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UserOperation playerno.
         * @member {number} playerno
         * @memberof gamereq.UserOperation
         * @instance
         */
        UserOperation.prototype.playerno = 0;

        /**
         * UserOperation opecode.
         * @member {number} opecode
         * @memberof gamereq.UserOperation
         * @instance
         */
        UserOperation.prototype.opecode = 0;

        /**
         * Creates a new UserOperation instance using the specified properties.
         * @function create
         * @memberof gamereq.UserOperation
         * @static
         * @param {gamereq.IUserOperation=} [properties] Properties to set
         * @returns {gamereq.UserOperation} UserOperation instance
         */
        UserOperation.create = function create(properties) {
            return new UserOperation(properties);
        };

        /**
         * Encodes the specified UserOperation message. Does not implicitly {@link gamereq.UserOperation.verify|verify} messages.
         * @function encode
         * @memberof gamereq.UserOperation
         * @static
         * @param {gamereq.IUserOperation} message UserOperation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserOperation.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.playerno != null && Object.hasOwnProperty.call(message, "playerno"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.playerno);
            if (message.opecode != null && Object.hasOwnProperty.call(message, "opecode"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.opecode);
            return writer;
        };

        /**
         * Encodes the specified UserOperation message, length delimited. Does not implicitly {@link gamereq.UserOperation.verify|verify} messages.
         * @function encodeDelimited
         * @memberof gamereq.UserOperation
         * @static
         * @param {gamereq.IUserOperation} message UserOperation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserOperation.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a UserOperation message from the specified reader or buffer.
         * @function decode
         * @memberof gamereq.UserOperation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {gamereq.UserOperation} UserOperation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserOperation.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gamereq.UserOperation();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.playerno = reader.uint32();
                    break;
                case 2:
                    message.opecode = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a UserOperation message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof gamereq.UserOperation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {gamereq.UserOperation} UserOperation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserOperation.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a UserOperation message.
         * @function verify
         * @memberof gamereq.UserOperation
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UserOperation.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.playerno != null && message.hasOwnProperty("playerno"))
                if (!$util.isInteger(message.playerno))
                    return "playerno: integer expected";
            if (message.opecode != null && message.hasOwnProperty("opecode"))
                if (!$util.isInteger(message.opecode))
                    return "opecode: integer expected";
            return null;
        };

        /**
         * Creates a UserOperation message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof gamereq.UserOperation
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {gamereq.UserOperation} UserOperation
         */
        UserOperation.fromObject = function fromObject(object) {
            if (object instanceof $root.gamereq.UserOperation)
                return object;
            var message = new $root.gamereq.UserOperation();
            if (object.playerno != null)
                message.playerno = object.playerno >>> 0;
            if (object.opecode != null)
                message.opecode = object.opecode >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a UserOperation message. Also converts values to other types if specified.
         * @function toObject
         * @memberof gamereq.UserOperation
         * @static
         * @param {gamereq.UserOperation} message UserOperation
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UserOperation.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.playerno = 0;
                object.opecode = 0;
            }
            if (message.playerno != null && message.hasOwnProperty("playerno"))
                object.playerno = message.playerno;
            if (message.opecode != null && message.hasOwnProperty("opecode"))
                object.opecode = message.opecode;
            return object;
        };

        /**
         * Converts this UserOperation to JSON.
         * @function toJSON
         * @memberof gamereq.UserOperation
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UserOperation.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UserOperation;
    })();

    gamereq.GameFrameReq = (function() {

        /**
         * Properties of a GameFrameReq.
         * @memberof gamereq
         * @interface IGameFrameReq
         * @property {number|null} [roomid] GameFrameReq roomid
         * @property {number|null} [userid] GameFrameReq userid
         * @property {number|null} [frame] GameFrameReq frame
         * @property {gamereq.IUserOperation|null} [userope] GameFrameReq userope
         */

        /**
         * Constructs a new GameFrameReq.
         * @memberof gamereq
         * @classdesc Represents a GameFrameReq.
         * @implements IGameFrameReq
         * @constructor
         * @param {gamereq.IGameFrameReq=} [properties] Properties to set
         */
        function GameFrameReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GameFrameReq roomid.
         * @member {number} roomid
         * @memberof gamereq.GameFrameReq
         * @instance
         */
        GameFrameReq.prototype.roomid = 0;

        /**
         * GameFrameReq userid.
         * @member {number} userid
         * @memberof gamereq.GameFrameReq
         * @instance
         */
        GameFrameReq.prototype.userid = 0;

        /**
         * GameFrameReq frame.
         * @member {number} frame
         * @memberof gamereq.GameFrameReq
         * @instance
         */
        GameFrameReq.prototype.frame = 0;

        /**
         * GameFrameReq userope.
         * @member {gamereq.IUserOperation|null|undefined} userope
         * @memberof gamereq.GameFrameReq
         * @instance
         */
        GameFrameReq.prototype.userope = null;

        /**
         * Creates a new GameFrameReq instance using the specified properties.
         * @function create
         * @memberof gamereq.GameFrameReq
         * @static
         * @param {gamereq.IGameFrameReq=} [properties] Properties to set
         * @returns {gamereq.GameFrameReq} GameFrameReq instance
         */
        GameFrameReq.create = function create(properties) {
            return new GameFrameReq(properties);
        };

        /**
         * Encodes the specified GameFrameReq message. Does not implicitly {@link gamereq.GameFrameReq.verify|verify} messages.
         * @function encode
         * @memberof gamereq.GameFrameReq
         * @static
         * @param {gamereq.IGameFrameReq} message GameFrameReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameFrameReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomid != null && Object.hasOwnProperty.call(message, "roomid"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.roomid);
            if (message.userid != null && Object.hasOwnProperty.call(message, "userid"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.userid);
            if (message.frame != null && Object.hasOwnProperty.call(message, "frame"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.frame);
            if (message.userope != null && Object.hasOwnProperty.call(message, "userope"))
                $root.gamereq.UserOperation.encode(message.userope, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GameFrameReq message, length delimited. Does not implicitly {@link gamereq.GameFrameReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof gamereq.GameFrameReq
         * @static
         * @param {gamereq.IGameFrameReq} message GameFrameReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameFrameReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameFrameReq message from the specified reader or buffer.
         * @function decode
         * @memberof gamereq.GameFrameReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {gamereq.GameFrameReq} GameFrameReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameFrameReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gamereq.GameFrameReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomid = reader.uint32();
                    break;
                case 2:
                    message.userid = reader.uint32();
                    break;
                case 3:
                    message.frame = reader.uint32();
                    break;
                case 4:
                    message.userope = $root.gamereq.UserOperation.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GameFrameReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof gamereq.GameFrameReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {gamereq.GameFrameReq} GameFrameReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameFrameReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameFrameReq message.
         * @function verify
         * @memberof gamereq.GameFrameReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameFrameReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomid != null && message.hasOwnProperty("roomid"))
                if (!$util.isInteger(message.roomid))
                    return "roomid: integer expected";
            if (message.userid != null && message.hasOwnProperty("userid"))
                if (!$util.isInteger(message.userid))
                    return "userid: integer expected";
            if (message.frame != null && message.hasOwnProperty("frame"))
                if (!$util.isInteger(message.frame))
                    return "frame: integer expected";
            if (message.userope != null && message.hasOwnProperty("userope")) {
                var error = $root.gamereq.UserOperation.verify(message.userope);
                if (error)
                    return "userope." + error;
            }
            return null;
        };

        /**
         * Creates a GameFrameReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof gamereq.GameFrameReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {gamereq.GameFrameReq} GameFrameReq
         */
        GameFrameReq.fromObject = function fromObject(object) {
            if (object instanceof $root.gamereq.GameFrameReq)
                return object;
            var message = new $root.gamereq.GameFrameReq();
            if (object.roomid != null)
                message.roomid = object.roomid >>> 0;
            if (object.userid != null)
                message.userid = object.userid >>> 0;
            if (object.frame != null)
                message.frame = object.frame >>> 0;
            if (object.userope != null) {
                if (typeof object.userope !== "object")
                    throw TypeError(".gamereq.GameFrameReq.userope: object expected");
                message.userope = $root.gamereq.UserOperation.fromObject(object.userope);
            }
            return message;
        };

        /**
         * Creates a plain object from a GameFrameReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof gamereq.GameFrameReq
         * @static
         * @param {gamereq.GameFrameReq} message GameFrameReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameFrameReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.roomid = 0;
                object.userid = 0;
                object.frame = 0;
                object.userope = null;
            }
            if (message.roomid != null && message.hasOwnProperty("roomid"))
                object.roomid = message.roomid;
            if (message.userid != null && message.hasOwnProperty("userid"))
                object.userid = message.userid;
            if (message.frame != null && message.hasOwnProperty("frame"))
                object.frame = message.frame;
            if (message.userope != null && message.hasOwnProperty("userope"))
                object.userope = $root.gamereq.UserOperation.toObject(message.userope, options);
            return object;
        };

        /**
         * Converts this GameFrameReq to JSON.
         * @function toJSON
         * @memberof gamereq.GameFrameReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameFrameReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GameFrameReq;
    })();

    gamereq.GameFrameNtf = (function() {

        /**
         * Properties of a GameFrameNtf.
         * @memberof gamereq
         * @interface IGameFrameNtf
         * @property {number|null} [frame] GameFrameNtf frame
         * @property {Array.<gamereq.IUserOperation>|null} [useropes] GameFrameNtf useropes
         */

        /**
         * Constructs a new GameFrameNtf.
         * @memberof gamereq
         * @classdesc Represents a GameFrameNtf.
         * @implements IGameFrameNtf
         * @constructor
         * @param {gamereq.IGameFrameNtf=} [properties] Properties to set
         */
        function GameFrameNtf(properties) {
            this.useropes = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GameFrameNtf frame.
         * @member {number} frame
         * @memberof gamereq.GameFrameNtf
         * @instance
         */
        GameFrameNtf.prototype.frame = 0;

        /**
         * GameFrameNtf useropes.
         * @member {Array.<gamereq.IUserOperation>} useropes
         * @memberof gamereq.GameFrameNtf
         * @instance
         */
        GameFrameNtf.prototype.useropes = $util.emptyArray;

        /**
         * Creates a new GameFrameNtf instance using the specified properties.
         * @function create
         * @memberof gamereq.GameFrameNtf
         * @static
         * @param {gamereq.IGameFrameNtf=} [properties] Properties to set
         * @returns {gamereq.GameFrameNtf} GameFrameNtf instance
         */
        GameFrameNtf.create = function create(properties) {
            return new GameFrameNtf(properties);
        };

        /**
         * Encodes the specified GameFrameNtf message. Does not implicitly {@link gamereq.GameFrameNtf.verify|verify} messages.
         * @function encode
         * @memberof gamereq.GameFrameNtf
         * @static
         * @param {gamereq.IGameFrameNtf} message GameFrameNtf message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameFrameNtf.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.frame != null && Object.hasOwnProperty.call(message, "frame"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.frame);
            if (message.useropes != null && message.useropes.length)
                for (var i = 0; i < message.useropes.length; ++i)
                    $root.gamereq.UserOperation.encode(message.useropes[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GameFrameNtf message, length delimited. Does not implicitly {@link gamereq.GameFrameNtf.verify|verify} messages.
         * @function encodeDelimited
         * @memberof gamereq.GameFrameNtf
         * @static
         * @param {gamereq.IGameFrameNtf} message GameFrameNtf message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameFrameNtf.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameFrameNtf message from the specified reader or buffer.
         * @function decode
         * @memberof gamereq.GameFrameNtf
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {gamereq.GameFrameNtf} GameFrameNtf
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameFrameNtf.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gamereq.GameFrameNtf();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.frame = reader.uint32();
                    break;
                case 2:
                    if (!(message.useropes && message.useropes.length))
                        message.useropes = [];
                    message.useropes.push($root.gamereq.UserOperation.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GameFrameNtf message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof gamereq.GameFrameNtf
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {gamereq.GameFrameNtf} GameFrameNtf
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameFrameNtf.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameFrameNtf message.
         * @function verify
         * @memberof gamereq.GameFrameNtf
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameFrameNtf.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.frame != null && message.hasOwnProperty("frame"))
                if (!$util.isInteger(message.frame))
                    return "frame: integer expected";
            if (message.useropes != null && message.hasOwnProperty("useropes")) {
                if (!Array.isArray(message.useropes))
                    return "useropes: array expected";
                for (var i = 0; i < message.useropes.length; ++i) {
                    var error = $root.gamereq.UserOperation.verify(message.useropes[i]);
                    if (error)
                        return "useropes." + error;
                }
            }
            return null;
        };

        /**
         * Creates a GameFrameNtf message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof gamereq.GameFrameNtf
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {gamereq.GameFrameNtf} GameFrameNtf
         */
        GameFrameNtf.fromObject = function fromObject(object) {
            if (object instanceof $root.gamereq.GameFrameNtf)
                return object;
            var message = new $root.gamereq.GameFrameNtf();
            if (object.frame != null)
                message.frame = object.frame >>> 0;
            if (object.useropes) {
                if (!Array.isArray(object.useropes))
                    throw TypeError(".gamereq.GameFrameNtf.useropes: array expected");
                message.useropes = [];
                for (var i = 0; i < object.useropes.length; ++i) {
                    if (typeof object.useropes[i] !== "object")
                        throw TypeError(".gamereq.GameFrameNtf.useropes: object expected");
                    message.useropes[i] = $root.gamereq.UserOperation.fromObject(object.useropes[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a GameFrameNtf message. Also converts values to other types if specified.
         * @function toObject
         * @memberof gamereq.GameFrameNtf
         * @static
         * @param {gamereq.GameFrameNtf} message GameFrameNtf
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameFrameNtf.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.useropes = [];
            if (options.defaults)
                object.frame = 0;
            if (message.frame != null && message.hasOwnProperty("frame"))
                object.frame = message.frame;
            if (message.useropes && message.useropes.length) {
                object.useropes = [];
                for (var j = 0; j < message.useropes.length; ++j)
                    object.useropes[j] = $root.gamereq.UserOperation.toObject(message.useropes[j], options);
            }
            return object;
        };

        /**
         * Converts this GameFrameNtf to JSON.
         * @function toJSON
         * @memberof gamereq.GameFrameNtf
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameFrameNtf.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GameFrameNtf;
    })();

    return gamereq;
})();

module.exports = $root;
