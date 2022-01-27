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

    gamereq.LoginInReq = (function() {

        /**
         * Properties of a LoginInReq.
         * @memberof gamereq
         * @interface ILoginInReq
         * @property {number|null} [userid] LoginInReq userid
         * @property {number|Long|null} [timestamp] LoginInReq timestamp
         */

        /**
         * Constructs a new LoginInReq.
         * @memberof gamereq
         * @classdesc Represents a LoginInReq.
         * @implements ILoginInReq
         * @constructor
         * @param {gamereq.ILoginInReq=} [properties] Properties to set
         */
        function LoginInReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LoginInReq userid.
         * @member {number} userid
         * @memberof gamereq.LoginInReq
         * @instance
         */
        LoginInReq.prototype.userid = 0;

        /**
         * LoginInReq timestamp.
         * @member {number|Long} timestamp
         * @memberof gamereq.LoginInReq
         * @instance
         */
        LoginInReq.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new LoginInReq instance using the specified properties.
         * @function create
         * @memberof gamereq.LoginInReq
         * @static
         * @param {gamereq.ILoginInReq=} [properties] Properties to set
         * @returns {gamereq.LoginInReq} LoginInReq instance
         */
        LoginInReq.create = function create(properties) {
            return new LoginInReq(properties);
        };

        /**
         * Encodes the specified LoginInReq message. Does not implicitly {@link gamereq.LoginInReq.verify|verify} messages.
         * @function encode
         * @memberof gamereq.LoginInReq
         * @static
         * @param {gamereq.ILoginInReq} message LoginInReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginInReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.userid != null && Object.hasOwnProperty.call(message, "userid"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.userid);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.timestamp);
            return writer;
        };

        /**
         * Encodes the specified LoginInReq message, length delimited. Does not implicitly {@link gamereq.LoginInReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof gamereq.LoginInReq
         * @static
         * @param {gamereq.ILoginInReq} message LoginInReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginInReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LoginInReq message from the specified reader or buffer.
         * @function decode
         * @memberof gamereq.LoginInReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {gamereq.LoginInReq} LoginInReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginInReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gamereq.LoginInReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userid = reader.int32();
                    break;
                case 2:
                    message.timestamp = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LoginInReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof gamereq.LoginInReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {gamereq.LoginInReq} LoginInReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginInReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LoginInReq message.
         * @function verify
         * @memberof gamereq.LoginInReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LoginInReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.userid != null && message.hasOwnProperty("userid"))
                if (!$util.isInteger(message.userid))
                    return "userid: integer expected";
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            return null;
        };

        /**
         * Creates a LoginInReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof gamereq.LoginInReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {gamereq.LoginInReq} LoginInReq
         */
        LoginInReq.fromObject = function fromObject(object) {
            if (object instanceof $root.gamereq.LoginInReq)
                return object;
            var message = new $root.gamereq.LoginInReq();
            if (object.userid != null)
                message.userid = object.userid | 0;
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a LoginInReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof gamereq.LoginInReq
         * @static
         * @param {gamereq.LoginInReq} message LoginInReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LoginInReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.userid = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
            }
            if (message.userid != null && message.hasOwnProperty("userid"))
                object.userid = message.userid;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            return object;
        };

        /**
         * Converts this LoginInReq to JSON.
         * @function toJSON
         * @memberof gamereq.LoginInReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LoginInReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LoginInReq;
    })();

    gamereq.LoginInRsp = (function() {

        /**
         * Properties of a LoginInRsp.
         * @memberof gamereq
         * @interface ILoginInRsp
         * @property {number|null} [userid] LoginInRsp userid
         * @property {number|Long|null} [timestamp] LoginInRsp timestamp
         * @property {boolean|null} [success] LoginInRsp success
         * @property {string|null} [description] LoginInRsp description
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
        LoginInRsp.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * LoginInRsp success.
         * @member {boolean} success
         * @memberof gamereq.LoginInRsp
         * @instance
         */
        LoginInRsp.prototype.success = false;

        /**
         * LoginInRsp description.
         * @member {string} description
         * @memberof gamereq.LoginInRsp
         * @instance
         */
        LoginInRsp.prototype.description = "";

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
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.userid);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.timestamp);
            if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.success);
            if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.description);
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
                    message.userid = reader.int32();
                    break;
                case 2:
                    message.timestamp = reader.int64();
                    break;
                case 3:
                    message.success = reader.bool();
                    break;
                case 4:
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
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            if (message.description != null && message.hasOwnProperty("description"))
                if (!$util.isString(message.description))
                    return "description: string expected";
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
                message.userid = object.userid | 0;
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            if (object.success != null)
                message.success = Boolean(object.success);
            if (object.description != null)
                message.description = String(object.description);
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
            if (options.defaults) {
                object.userid = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.success = false;
                object.description = "";
            }
            if (message.userid != null && message.hasOwnProperty("userid"))
                object.userid = message.userid;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
            if (message.description != null && message.hasOwnProperty("description"))
                object.description = message.description;
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

    gamereq.LoginOutReq = (function() {

        /**
         * Properties of a LoginOutReq.
         * @memberof gamereq
         * @interface ILoginOutReq
         * @property {number|null} [userid] LoginOutReq userid
         */

        /**
         * Constructs a new LoginOutReq.
         * @memberof gamereq
         * @classdesc Represents a LoginOutReq.
         * @implements ILoginOutReq
         * @constructor
         * @param {gamereq.ILoginOutReq=} [properties] Properties to set
         */
        function LoginOutReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LoginOutReq userid.
         * @member {number} userid
         * @memberof gamereq.LoginOutReq
         * @instance
         */
        LoginOutReq.prototype.userid = 0;

        /**
         * Creates a new LoginOutReq instance using the specified properties.
         * @function create
         * @memberof gamereq.LoginOutReq
         * @static
         * @param {gamereq.ILoginOutReq=} [properties] Properties to set
         * @returns {gamereq.LoginOutReq} LoginOutReq instance
         */
        LoginOutReq.create = function create(properties) {
            return new LoginOutReq(properties);
        };

        /**
         * Encodes the specified LoginOutReq message. Does not implicitly {@link gamereq.LoginOutReq.verify|verify} messages.
         * @function encode
         * @memberof gamereq.LoginOutReq
         * @static
         * @param {gamereq.ILoginOutReq} message LoginOutReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginOutReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.userid != null && Object.hasOwnProperty.call(message, "userid"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.userid);
            return writer;
        };

        /**
         * Encodes the specified LoginOutReq message, length delimited. Does not implicitly {@link gamereq.LoginOutReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof gamereq.LoginOutReq
         * @static
         * @param {gamereq.ILoginOutReq} message LoginOutReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LoginOutReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LoginOutReq message from the specified reader or buffer.
         * @function decode
         * @memberof gamereq.LoginOutReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {gamereq.LoginOutReq} LoginOutReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginOutReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gamereq.LoginOutReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userid = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LoginOutReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof gamereq.LoginOutReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {gamereq.LoginOutReq} LoginOutReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LoginOutReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LoginOutReq message.
         * @function verify
         * @memberof gamereq.LoginOutReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LoginOutReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.userid != null && message.hasOwnProperty("userid"))
                if (!$util.isInteger(message.userid))
                    return "userid: integer expected";
            return null;
        };

        /**
         * Creates a LoginOutReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof gamereq.LoginOutReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {gamereq.LoginOutReq} LoginOutReq
         */
        LoginOutReq.fromObject = function fromObject(object) {
            if (object instanceof $root.gamereq.LoginOutReq)
                return object;
            var message = new $root.gamereq.LoginOutReq();
            if (object.userid != null)
                message.userid = object.userid | 0;
            return message;
        };

        /**
         * Creates a plain object from a LoginOutReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof gamereq.LoginOutReq
         * @static
         * @param {gamereq.LoginOutReq} message LoginOutReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LoginOutReq.toObject = function toObject(message, options) {
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
         * Converts this LoginOutReq to JSON.
         * @function toJSON
         * @memberof gamereq.LoginOutReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LoginOutReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LoginOutReq;
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
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.userid);
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
                    message.userid = reader.int32();
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
                message.userid = object.userid | 0;
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
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.roomid);
            if (message.playerno != null && Object.hasOwnProperty.call(message, "playerno"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.playerno);
            if (message.userid != null && Object.hasOwnProperty.call(message, "userid"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.userid);
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
                    message.roomid = reader.int32();
                    break;
                case 2:
                    message.playerno = reader.int32();
                    break;
                case 3:
                    message.userid = reader.int32();
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
                message.roomid = object.roomid | 0;
            if (object.playerno != null)
                message.playerno = object.playerno | 0;
            if (object.userid != null)
                message.userid = object.userid | 0;
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

    gamereq.RoomOperation = (function() {

        /**
         * Properties of a RoomOperation.
         * @memberof gamereq
         * @interface IRoomOperation
         * @property {gamereq.IRoomPlayerInfo|null} [where] RoomOperation where
         * @property {boolean|null} [success] RoomOperation success
         */

        /**
         * Constructs a new RoomOperation.
         * @memberof gamereq
         * @classdesc Represents a RoomOperation.
         * @implements IRoomOperation
         * @constructor
         * @param {gamereq.IRoomOperation=} [properties] Properties to set
         */
        function RoomOperation(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomOperation where.
         * @member {gamereq.IRoomPlayerInfo|null|undefined} where
         * @memberof gamereq.RoomOperation
         * @instance
         */
        RoomOperation.prototype.where = null;

        /**
         * RoomOperation success.
         * @member {boolean} success
         * @memberof gamereq.RoomOperation
         * @instance
         */
        RoomOperation.prototype.success = false;

        /**
         * Creates a new RoomOperation instance using the specified properties.
         * @function create
         * @memberof gamereq.RoomOperation
         * @static
         * @param {gamereq.IRoomOperation=} [properties] Properties to set
         * @returns {gamereq.RoomOperation} RoomOperation instance
         */
        RoomOperation.create = function create(properties) {
            return new RoomOperation(properties);
        };

        /**
         * Encodes the specified RoomOperation message. Does not implicitly {@link gamereq.RoomOperation.verify|verify} messages.
         * @function encode
         * @memberof gamereq.RoomOperation
         * @static
         * @param {gamereq.IRoomOperation} message RoomOperation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomOperation.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.where != null && Object.hasOwnProperty.call(message, "where"))
                $root.gamereq.RoomPlayerInfo.encode(message.where, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.success);
            return writer;
        };

        /**
         * Encodes the specified RoomOperation message, length delimited. Does not implicitly {@link gamereq.RoomOperation.verify|verify} messages.
         * @function encodeDelimited
         * @memberof gamereq.RoomOperation
         * @static
         * @param {gamereq.IRoomOperation} message RoomOperation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomOperation.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomOperation message from the specified reader or buffer.
         * @function decode
         * @memberof gamereq.RoomOperation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {gamereq.RoomOperation} RoomOperation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomOperation.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gamereq.RoomOperation();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.where = $root.gamereq.RoomPlayerInfo.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.success = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomOperation message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof gamereq.RoomOperation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {gamereq.RoomOperation} RoomOperation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomOperation.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomOperation message.
         * @function verify
         * @memberof gamereq.RoomOperation
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomOperation.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.where != null && message.hasOwnProperty("where")) {
                var error = $root.gamereq.RoomPlayerInfo.verify(message.where);
                if (error)
                    return "where." + error;
            }
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            return null;
        };

        /**
         * Creates a RoomOperation message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof gamereq.RoomOperation
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {gamereq.RoomOperation} RoomOperation
         */
        RoomOperation.fromObject = function fromObject(object) {
            if (object instanceof $root.gamereq.RoomOperation)
                return object;
            var message = new $root.gamereq.RoomOperation();
            if (object.where != null) {
                if (typeof object.where !== "object")
                    throw TypeError(".gamereq.RoomOperation.where: object expected");
                message.where = $root.gamereq.RoomPlayerInfo.fromObject(object.where);
            }
            if (object.success != null)
                message.success = Boolean(object.success);
            return message;
        };

        /**
         * Creates a plain object from a RoomOperation message. Also converts values to other types if specified.
         * @function toObject
         * @memberof gamereq.RoomOperation
         * @static
         * @param {gamereq.RoomOperation} message RoomOperation
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomOperation.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.where = null;
                object.success = false;
            }
            if (message.where != null && message.hasOwnProperty("where"))
                object.where = $root.gamereq.RoomPlayerInfo.toObject(message.where, options);
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
            return object;
        };

        /**
         * Converts this RoomOperation to JSON.
         * @function toJSON
         * @memberof gamereq.RoomOperation
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomOperation.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomOperation;
    })();

    gamereq.GameOperation = (function() {

        /**
         * Properties of a GameOperation.
         * @memberof gamereq
         * @interface IGameOperation
         * @property {number|null} [key] GameOperation key
         * @property {number|null} [event] GameOperation event
         */

        /**
         * Constructs a new GameOperation.
         * @memberof gamereq
         * @classdesc Represents a GameOperation.
         * @implements IGameOperation
         * @constructor
         * @param {gamereq.IGameOperation=} [properties] Properties to set
         */
        function GameOperation(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GameOperation key.
         * @member {number} key
         * @memberof gamereq.GameOperation
         * @instance
         */
        GameOperation.prototype.key = 0;

        /**
         * GameOperation event.
         * @member {number} event
         * @memberof gamereq.GameOperation
         * @instance
         */
        GameOperation.prototype.event = 0;

        /**
         * Creates a new GameOperation instance using the specified properties.
         * @function create
         * @memberof gamereq.GameOperation
         * @static
         * @param {gamereq.IGameOperation=} [properties] Properties to set
         * @returns {gamereq.GameOperation} GameOperation instance
         */
        GameOperation.create = function create(properties) {
            return new GameOperation(properties);
        };

        /**
         * Encodes the specified GameOperation message. Does not implicitly {@link gamereq.GameOperation.verify|verify} messages.
         * @function encode
         * @memberof gamereq.GameOperation
         * @static
         * @param {gamereq.IGameOperation} message GameOperation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameOperation.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.key);
            if (message.event != null && Object.hasOwnProperty.call(message, "event"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.event);
            return writer;
        };

        /**
         * Encodes the specified GameOperation message, length delimited. Does not implicitly {@link gamereq.GameOperation.verify|verify} messages.
         * @function encodeDelimited
         * @memberof gamereq.GameOperation
         * @static
         * @param {gamereq.IGameOperation} message GameOperation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameOperation.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameOperation message from the specified reader or buffer.
         * @function decode
         * @memberof gamereq.GameOperation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {gamereq.GameOperation} GameOperation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameOperation.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gamereq.GameOperation();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.key = reader.int32();
                    break;
                case 2:
                    message.event = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GameOperation message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof gamereq.GameOperation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {gamereq.GameOperation} GameOperation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameOperation.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameOperation message.
         * @function verify
         * @memberof gamereq.GameOperation
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameOperation.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.key != null && message.hasOwnProperty("key"))
                if (!$util.isInteger(message.key))
                    return "key: integer expected";
            if (message.event != null && message.hasOwnProperty("event"))
                if (!$util.isInteger(message.event))
                    return "event: integer expected";
            return null;
        };

        /**
         * Creates a GameOperation message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof gamereq.GameOperation
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {gamereq.GameOperation} GameOperation
         */
        GameOperation.fromObject = function fromObject(object) {
            if (object instanceof $root.gamereq.GameOperation)
                return object;
            var message = new $root.gamereq.GameOperation();
            if (object.key != null)
                message.key = object.key | 0;
            if (object.event != null)
                message.event = object.event | 0;
            return message;
        };

        /**
         * Creates a plain object from a GameOperation message. Also converts values to other types if specified.
         * @function toObject
         * @memberof gamereq.GameOperation
         * @static
         * @param {gamereq.GameOperation} message GameOperation
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameOperation.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.key = 0;
                object.event = 0;
            }
            if (message.key != null && message.hasOwnProperty("key"))
                object.key = message.key;
            if (message.event != null && message.hasOwnProperty("event"))
                object.event = message.event;
            return object;
        };

        /**
         * Converts this GameOperation to JSON.
         * @function toJSON
         * @memberof gamereq.GameOperation
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameOperation.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GameOperation;
    })();

    gamereq.UserOperation = (function() {

        /**
         * Properties of a UserOperation.
         * @memberof gamereq
         * @interface IUserOperation
         * @property {gamereq.IRoomPlayerInfo|null} [where] UserOperation where
         * @property {gamereq.IGameOperation|null} [ope] UserOperation ope
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
         * UserOperation where.
         * @member {gamereq.IRoomPlayerInfo|null|undefined} where
         * @memberof gamereq.UserOperation
         * @instance
         */
        UserOperation.prototype.where = null;

        /**
         * UserOperation ope.
         * @member {gamereq.IGameOperation|null|undefined} ope
         * @memberof gamereq.UserOperation
         * @instance
         */
        UserOperation.prototype.ope = null;

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
            if (message.where != null && Object.hasOwnProperty.call(message, "where"))
                $root.gamereq.RoomPlayerInfo.encode(message.where, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.ope != null && Object.hasOwnProperty.call(message, "ope"))
                $root.gamereq.GameOperation.encode(message.ope, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
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
                    message.where = $root.gamereq.RoomPlayerInfo.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.ope = $root.gamereq.GameOperation.decode(reader, reader.uint32());
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
            if (message.where != null && message.hasOwnProperty("where")) {
                var error = $root.gamereq.RoomPlayerInfo.verify(message.where);
                if (error)
                    return "where." + error;
            }
            if (message.ope != null && message.hasOwnProperty("ope")) {
                var error = $root.gamereq.GameOperation.verify(message.ope);
                if (error)
                    return "ope." + error;
            }
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
            if (object.where != null) {
                if (typeof object.where !== "object")
                    throw TypeError(".gamereq.UserOperation.where: object expected");
                message.where = $root.gamereq.RoomPlayerInfo.fromObject(object.where);
            }
            if (object.ope != null) {
                if (typeof object.ope !== "object")
                    throw TypeError(".gamereq.UserOperation.ope: object expected");
                message.ope = $root.gamereq.GameOperation.fromObject(object.ope);
            }
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
                object.where = null;
                object.ope = null;
            }
            if (message.where != null && message.hasOwnProperty("where"))
                object.where = $root.gamereq.RoomPlayerInfo.toObject(message.where, options);
            if (message.ope != null && message.hasOwnProperty("ope"))
                object.ope = $root.gamereq.GameOperation.toObject(message.ope, options);
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

    gamereq.GameFrame = (function() {

        /**
         * Properties of a GameFrame.
         * @memberof gamereq
         * @interface IGameFrame
         * @property {number|null} [frame] GameFrame frame
         * @property {Array.<gamereq.IUserOperation>|null} [useropes] GameFrame useropes
         */

        /**
         * Constructs a new GameFrame.
         * @memberof gamereq
         * @classdesc Represents a GameFrame.
         * @implements IGameFrame
         * @constructor
         * @param {gamereq.IGameFrame=} [properties] Properties to set
         */
        function GameFrame(properties) {
            this.useropes = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GameFrame frame.
         * @member {number} frame
         * @memberof gamereq.GameFrame
         * @instance
         */
        GameFrame.prototype.frame = 0;

        /**
         * GameFrame useropes.
         * @member {Array.<gamereq.IUserOperation>} useropes
         * @memberof gamereq.GameFrame
         * @instance
         */
        GameFrame.prototype.useropes = $util.emptyArray;

        /**
         * Creates a new GameFrame instance using the specified properties.
         * @function create
         * @memberof gamereq.GameFrame
         * @static
         * @param {gamereq.IGameFrame=} [properties] Properties to set
         * @returns {gamereq.GameFrame} GameFrame instance
         */
        GameFrame.create = function create(properties) {
            return new GameFrame(properties);
        };

        /**
         * Encodes the specified GameFrame message. Does not implicitly {@link gamereq.GameFrame.verify|verify} messages.
         * @function encode
         * @memberof gamereq.GameFrame
         * @static
         * @param {gamereq.IGameFrame} message GameFrame message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameFrame.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.frame != null && Object.hasOwnProperty.call(message, "frame"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.frame);
            if (message.useropes != null && message.useropes.length)
                for (var i = 0; i < message.useropes.length; ++i)
                    $root.gamereq.UserOperation.encode(message.useropes[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GameFrame message, length delimited. Does not implicitly {@link gamereq.GameFrame.verify|verify} messages.
         * @function encodeDelimited
         * @memberof gamereq.GameFrame
         * @static
         * @param {gamereq.IGameFrame} message GameFrame message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameFrame.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameFrame message from the specified reader or buffer.
         * @function decode
         * @memberof gamereq.GameFrame
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {gamereq.GameFrame} GameFrame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameFrame.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gamereq.GameFrame();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.frame = reader.int32();
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
         * Decodes a GameFrame message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof gamereq.GameFrame
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {gamereq.GameFrame} GameFrame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameFrame.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameFrame message.
         * @function verify
         * @memberof gamereq.GameFrame
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameFrame.verify = function verify(message) {
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
         * Creates a GameFrame message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof gamereq.GameFrame
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {gamereq.GameFrame} GameFrame
         */
        GameFrame.fromObject = function fromObject(object) {
            if (object instanceof $root.gamereq.GameFrame)
                return object;
            var message = new $root.gamereq.GameFrame();
            if (object.frame != null)
                message.frame = object.frame | 0;
            if (object.useropes) {
                if (!Array.isArray(object.useropes))
                    throw TypeError(".gamereq.GameFrame.useropes: array expected");
                message.useropes = [];
                for (var i = 0; i < object.useropes.length; ++i) {
                    if (typeof object.useropes[i] !== "object")
                        throw TypeError(".gamereq.GameFrame.useropes: object expected");
                    message.useropes[i] = $root.gamereq.UserOperation.fromObject(object.useropes[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a GameFrame message. Also converts values to other types if specified.
         * @function toObject
         * @memberof gamereq.GameFrame
         * @static
         * @param {gamereq.GameFrame} message GameFrame
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameFrame.toObject = function toObject(message, options) {
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
         * Converts this GameFrame to JSON.
         * @function toJSON
         * @memberof gamereq.GameFrame
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameFrame.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GameFrame;
    })();

    gamereq.MainGameFrame = (function() {

        /**
         * Properties of a MainGameFrame.
         * @memberof gamereq
         * @interface IMainGameFrame
         * @property {Array.<gamereq.IGameFrame>|null} [frames] MainGameFrame frames
         */

        /**
         * Constructs a new MainGameFrame.
         * @memberof gamereq
         * @classdesc Represents a MainGameFrame.
         * @implements IMainGameFrame
         * @constructor
         * @param {gamereq.IMainGameFrame=} [properties] Properties to set
         */
        function MainGameFrame(properties) {
            this.frames = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MainGameFrame frames.
         * @member {Array.<gamereq.IGameFrame>} frames
         * @memberof gamereq.MainGameFrame
         * @instance
         */
        MainGameFrame.prototype.frames = $util.emptyArray;

        /**
         * Creates a new MainGameFrame instance using the specified properties.
         * @function create
         * @memberof gamereq.MainGameFrame
         * @static
         * @param {gamereq.IMainGameFrame=} [properties] Properties to set
         * @returns {gamereq.MainGameFrame} MainGameFrame instance
         */
        MainGameFrame.create = function create(properties) {
            return new MainGameFrame(properties);
        };

        /**
         * Encodes the specified MainGameFrame message. Does not implicitly {@link gamereq.MainGameFrame.verify|verify} messages.
         * @function encode
         * @memberof gamereq.MainGameFrame
         * @static
         * @param {gamereq.IMainGameFrame} message MainGameFrame message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MainGameFrame.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.frames != null && message.frames.length)
                for (var i = 0; i < message.frames.length; ++i)
                    $root.gamereq.GameFrame.encode(message.frames[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified MainGameFrame message, length delimited. Does not implicitly {@link gamereq.MainGameFrame.verify|verify} messages.
         * @function encodeDelimited
         * @memberof gamereq.MainGameFrame
         * @static
         * @param {gamereq.IMainGameFrame} message MainGameFrame message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MainGameFrame.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MainGameFrame message from the specified reader or buffer.
         * @function decode
         * @memberof gamereq.MainGameFrame
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {gamereq.MainGameFrame} MainGameFrame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MainGameFrame.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.gamereq.MainGameFrame();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.frames && message.frames.length))
                        message.frames = [];
                    message.frames.push($root.gamereq.GameFrame.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MainGameFrame message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof gamereq.MainGameFrame
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {gamereq.MainGameFrame} MainGameFrame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MainGameFrame.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MainGameFrame message.
         * @function verify
         * @memberof gamereq.MainGameFrame
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MainGameFrame.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.frames != null && message.hasOwnProperty("frames")) {
                if (!Array.isArray(message.frames))
                    return "frames: array expected";
                for (var i = 0; i < message.frames.length; ++i) {
                    var error = $root.gamereq.GameFrame.verify(message.frames[i]);
                    if (error)
                        return "frames." + error;
                }
            }
            return null;
        };

        /**
         * Creates a MainGameFrame message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof gamereq.MainGameFrame
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {gamereq.MainGameFrame} MainGameFrame
         */
        MainGameFrame.fromObject = function fromObject(object) {
            if (object instanceof $root.gamereq.MainGameFrame)
                return object;
            var message = new $root.gamereq.MainGameFrame();
            if (object.frames) {
                if (!Array.isArray(object.frames))
                    throw TypeError(".gamereq.MainGameFrame.frames: array expected");
                message.frames = [];
                for (var i = 0; i < object.frames.length; ++i) {
                    if (typeof object.frames[i] !== "object")
                        throw TypeError(".gamereq.MainGameFrame.frames: object expected");
                    message.frames[i] = $root.gamereq.GameFrame.fromObject(object.frames[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a MainGameFrame message. Also converts values to other types if specified.
         * @function toObject
         * @memberof gamereq.MainGameFrame
         * @static
         * @param {gamereq.MainGameFrame} message MainGameFrame
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MainGameFrame.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.frames = [];
            if (message.frames && message.frames.length) {
                object.frames = [];
                for (var j = 0; j < message.frames.length; ++j)
                    object.frames[j] = $root.gamereq.GameFrame.toObject(message.frames[j], options);
            }
            return object;
        };

        /**
         * Converts this MainGameFrame to JSON.
         * @function toJSON
         * @memberof gamereq.MainGameFrame
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MainGameFrame.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return MainGameFrame;
    })();

    return gamereq;
})();

module.exports = $root;
