import * as $protobuf from "protobufjs";
/** Namespace gamereq. */
export namespace gamereq {

    /** Properties of a LoginIn. */
    interface ILoginIn {

        /** LoginIn userid */
        userid?: (number|null);

        /** LoginIn timestamp */
        timestamp?: (number|Long|null);

        /** LoginIn syncframe */
        syncframe?: (number|null);
    }

    /** Represents a LoginIn. */
    class LoginIn implements ILoginIn {

        /**
         * Constructs a new LoginIn.
         * @param [properties] Properties to set
         */
        constructor(properties?: gamereq.ILoginIn);

        /** LoginIn userid. */
        public userid: number;

        /** LoginIn timestamp. */
        public timestamp: (number|Long);

        /** LoginIn syncframe. */
        public syncframe: number;

        /**
         * Creates a new LoginIn instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginIn instance
         */
        public static create(properties?: gamereq.ILoginIn): gamereq.LoginIn;

        /**
         * Encodes the specified LoginIn message. Does not implicitly {@link gamereq.LoginIn.verify|verify} messages.
         * @param message LoginIn message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gamereq.ILoginIn, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoginIn message, length delimited. Does not implicitly {@link gamereq.LoginIn.verify|verify} messages.
         * @param message LoginIn message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gamereq.ILoginIn, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoginIn message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginIn
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gamereq.LoginIn;

        /**
         * Decodes a LoginIn message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoginIn
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gamereq.LoginIn;

        /**
         * Verifies a LoginIn message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoginIn message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoginIn
         */
        public static fromObject(object: { [k: string]: any }): gamereq.LoginIn;

        /**
         * Creates a plain object from a LoginIn message. Also converts values to other types if specified.
         * @param message LoginIn
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gamereq.LoginIn, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoginIn to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PlayerInfo. */
    interface IPlayerInfo {

        /** PlayerInfo playerno */
        playerno?: (number|null);

        /** PlayerInfo userid */
        userid?: (number|null);

        /** PlayerInfo ready */
        ready?: (boolean|null);
    }

    /** Represents a PlayerInfo. */
    class PlayerInfo implements IPlayerInfo {

        /**
         * Constructs a new PlayerInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: gamereq.IPlayerInfo);

        /** PlayerInfo playerno. */
        public playerno: number;

        /** PlayerInfo userid. */
        public userid: number;

        /** PlayerInfo ready. */
        public ready: boolean;

        /**
         * Creates a new PlayerInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PlayerInfo instance
         */
        public static create(properties?: gamereq.IPlayerInfo): gamereq.PlayerInfo;

        /**
         * Encodes the specified PlayerInfo message. Does not implicitly {@link gamereq.PlayerInfo.verify|verify} messages.
         * @param message PlayerInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gamereq.IPlayerInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PlayerInfo message, length delimited. Does not implicitly {@link gamereq.PlayerInfo.verify|verify} messages.
         * @param message PlayerInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gamereq.IPlayerInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PlayerInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PlayerInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gamereq.PlayerInfo;

        /**
         * Decodes a PlayerInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PlayerInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gamereq.PlayerInfo;

        /**
         * Verifies a PlayerInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PlayerInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PlayerInfo
         */
        public static fromObject(object: { [k: string]: any }): gamereq.PlayerInfo;

        /**
         * Creates a plain object from a PlayerInfo message. Also converts values to other types if specified.
         * @param message PlayerInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gamereq.PlayerInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PlayerInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LoginInRsp. */
    interface ILoginInRsp {

        /** LoginInRsp userid */
        userid?: (number|null);

        /** LoginInRsp timestamp */
        timestamp?: (number|Long|null);

        /** LoginInRsp roomid */
        roomid?: (number|null);

        /** LoginInRsp roomstatus */
        roomstatus?: (number|null);

        /** LoginInRsp menuindex */
        menuindex?: (number|null);

        /** LoginInRsp gamemode */
        gamemode?: (number|null);

        /** LoginInRsp randomseed */
        randomseed?: (number|null);

        /** LoginInRsp players */
        players?: (gamereq.IPlayerInfo[]|null);

        /** LoginInRsp framerecord */
        framerecord?: (gamereq.IGameFrameNtf[]|null);
    }

    /** Represents a LoginInRsp. */
    class LoginInRsp implements ILoginInRsp {

        /**
         * Constructs a new LoginInRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: gamereq.ILoginInRsp);

        /** LoginInRsp userid. */
        public userid: number;

        /** LoginInRsp timestamp. */
        public timestamp: (number|Long);

        /** LoginInRsp roomid. */
        public roomid: number;

        /** LoginInRsp roomstatus. */
        public roomstatus: number;

        /** LoginInRsp menuindex. */
        public menuindex: number;

        /** LoginInRsp gamemode. */
        public gamemode: number;

        /** LoginInRsp randomseed. */
        public randomseed: number;

        /** LoginInRsp players. */
        public players: gamereq.IPlayerInfo[];

        /** LoginInRsp framerecord. */
        public framerecord: gamereq.IGameFrameNtf[];

        /**
         * Creates a new LoginInRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginInRsp instance
         */
        public static create(properties?: gamereq.ILoginInRsp): gamereq.LoginInRsp;

        /**
         * Encodes the specified LoginInRsp message. Does not implicitly {@link gamereq.LoginInRsp.verify|verify} messages.
         * @param message LoginInRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gamereq.ILoginInRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoginInRsp message, length delimited. Does not implicitly {@link gamereq.LoginInRsp.verify|verify} messages.
         * @param message LoginInRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gamereq.ILoginInRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoginInRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginInRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gamereq.LoginInRsp;

        /**
         * Decodes a LoginInRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoginInRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gamereq.LoginInRsp;

        /**
         * Verifies a LoginInRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoginInRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoginInRsp
         */
        public static fromObject(object: { [k: string]: any }): gamereq.LoginInRsp;

        /**
         * Creates a plain object from a LoginInRsp message. Also converts values to other types if specified.
         * @param message LoginInRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gamereq.LoginInRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoginInRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an ErrorInfo. */
    interface IErrorInfo {

        /** ErrorInfo description */
        description?: (string|null);
    }

    /** Represents an ErrorInfo. */
    class ErrorInfo implements IErrorInfo {

        /**
         * Constructs a new ErrorInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: gamereq.IErrorInfo);

        /** ErrorInfo description. */
        public description: string;

        /**
         * Creates a new ErrorInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ErrorInfo instance
         */
        public static create(properties?: gamereq.IErrorInfo): gamereq.ErrorInfo;

        /**
         * Encodes the specified ErrorInfo message. Does not implicitly {@link gamereq.ErrorInfo.verify|verify} messages.
         * @param message ErrorInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gamereq.IErrorInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ErrorInfo message, length delimited. Does not implicitly {@link gamereq.ErrorInfo.verify|verify} messages.
         * @param message ErrorInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gamereq.IErrorInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ErrorInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ErrorInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gamereq.ErrorInfo;

        /**
         * Decodes an ErrorInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ErrorInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gamereq.ErrorInfo;

        /**
         * Verifies an ErrorInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ErrorInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ErrorInfo
         */
        public static fromObject(object: { [k: string]: any }): gamereq.ErrorInfo;

        /**
         * Creates a plain object from an ErrorInfo message. Also converts values to other types if specified.
         * @param message ErrorInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gamereq.ErrorInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ErrorInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a UserInfo. */
    interface IUserInfo {

        /** UserInfo userid */
        userid?: (number|null);
    }

    /** Represents a UserInfo. */
    class UserInfo implements IUserInfo {

        /**
         * Constructs a new UserInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: gamereq.IUserInfo);

        /** UserInfo userid. */
        public userid: number;

        /**
         * Creates a new UserInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UserInfo instance
         */
        public static create(properties?: gamereq.IUserInfo): gamereq.UserInfo;

        /**
         * Encodes the specified UserInfo message. Does not implicitly {@link gamereq.UserInfo.verify|verify} messages.
         * @param message UserInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gamereq.IUserInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UserInfo message, length delimited. Does not implicitly {@link gamereq.UserInfo.verify|verify} messages.
         * @param message UserInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gamereq.IUserInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a UserInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gamereq.UserInfo;

        /**
         * Decodes a UserInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UserInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gamereq.UserInfo;

        /**
         * Verifies a UserInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a UserInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UserInfo
         */
        public static fromObject(object: { [k: string]: any }): gamereq.UserInfo;

        /**
         * Creates a plain object from a UserInfo message. Also converts values to other types if specified.
         * @param message UserInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gamereq.UserInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UserInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RoomPlayerInfo. */
    interface IRoomPlayerInfo {

        /** RoomPlayerInfo roomid */
        roomid?: (number|null);

        /** RoomPlayerInfo playerno */
        playerno?: (number|null);

        /** RoomPlayerInfo userid */
        userid?: (number|null);
    }

    /** Represents a RoomPlayerInfo. */
    class RoomPlayerInfo implements IRoomPlayerInfo {

        /**
         * Constructs a new RoomPlayerInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: gamereq.IRoomPlayerInfo);

        /** RoomPlayerInfo roomid. */
        public roomid: number;

        /** RoomPlayerInfo playerno. */
        public playerno: number;

        /** RoomPlayerInfo userid. */
        public userid: number;

        /**
         * Creates a new RoomPlayerInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomPlayerInfo instance
         */
        public static create(properties?: gamereq.IRoomPlayerInfo): gamereq.RoomPlayerInfo;

        /**
         * Encodes the specified RoomPlayerInfo message. Does not implicitly {@link gamereq.RoomPlayerInfo.verify|verify} messages.
         * @param message RoomPlayerInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gamereq.IRoomPlayerInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomPlayerInfo message, length delimited. Does not implicitly {@link gamereq.RoomPlayerInfo.verify|verify} messages.
         * @param message RoomPlayerInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gamereq.IRoomPlayerInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomPlayerInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomPlayerInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gamereq.RoomPlayerInfo;

        /**
         * Decodes a RoomPlayerInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomPlayerInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gamereq.RoomPlayerInfo;

        /**
         * Verifies a RoomPlayerInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomPlayerInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomPlayerInfo
         */
        public static fromObject(object: { [k: string]: any }): gamereq.RoomPlayerInfo;

        /**
         * Creates a plain object from a RoomPlayerInfo message. Also converts values to other types if specified.
         * @param message RoomPlayerInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gamereq.RoomPlayerInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomPlayerInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MenuSwitchInfo. */
    interface IMenuSwitchInfo {

        /** MenuSwitchInfo where */
        where?: (gamereq.IRoomPlayerInfo|null);

        /** MenuSwitchInfo index */
        index?: (number|null);
    }

    /** Represents a MenuSwitchInfo. */
    class MenuSwitchInfo implements IMenuSwitchInfo {

        /**
         * Constructs a new MenuSwitchInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: gamereq.IMenuSwitchInfo);

        /** MenuSwitchInfo where. */
        public where?: (gamereq.IRoomPlayerInfo|null);

        /** MenuSwitchInfo index. */
        public index: number;

        /**
         * Creates a new MenuSwitchInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MenuSwitchInfo instance
         */
        public static create(properties?: gamereq.IMenuSwitchInfo): gamereq.MenuSwitchInfo;

        /**
         * Encodes the specified MenuSwitchInfo message. Does not implicitly {@link gamereq.MenuSwitchInfo.verify|verify} messages.
         * @param message MenuSwitchInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gamereq.IMenuSwitchInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MenuSwitchInfo message, length delimited. Does not implicitly {@link gamereq.MenuSwitchInfo.verify|verify} messages.
         * @param message MenuSwitchInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gamereq.IMenuSwitchInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MenuSwitchInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MenuSwitchInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gamereq.MenuSwitchInfo;

        /**
         * Decodes a MenuSwitchInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MenuSwitchInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gamereq.MenuSwitchInfo;

        /**
         * Verifies a MenuSwitchInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MenuSwitchInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MenuSwitchInfo
         */
        public static fromObject(object: { [k: string]: any }): gamereq.MenuSwitchInfo;

        /**
         * Creates a plain object from a MenuSwitchInfo message. Also converts values to other types if specified.
         * @param message MenuSwitchInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gamereq.MenuSwitchInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MenuSwitchInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MenuChooseInfo. */
    interface IMenuChooseInfo {

        /** MenuChooseInfo where */
        where?: (gamereq.IRoomPlayerInfo|null);

        /** MenuChooseInfo index */
        index?: (number|null);
    }

    /** Represents a MenuChooseInfo. */
    class MenuChooseInfo implements IMenuChooseInfo {

        /**
         * Constructs a new MenuChooseInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: gamereq.IMenuChooseInfo);

        /** MenuChooseInfo where. */
        public where?: (gamereq.IRoomPlayerInfo|null);

        /** MenuChooseInfo index. */
        public index: number;

        /**
         * Creates a new MenuChooseInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MenuChooseInfo instance
         */
        public static create(properties?: gamereq.IMenuChooseInfo): gamereq.MenuChooseInfo;

        /**
         * Encodes the specified MenuChooseInfo message. Does not implicitly {@link gamereq.MenuChooseInfo.verify|verify} messages.
         * @param message MenuChooseInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gamereq.IMenuChooseInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MenuChooseInfo message, length delimited. Does not implicitly {@link gamereq.MenuChooseInfo.verify|verify} messages.
         * @param message MenuChooseInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gamereq.IMenuChooseInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MenuChooseInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MenuChooseInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gamereq.MenuChooseInfo;

        /**
         * Decodes a MenuChooseInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MenuChooseInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gamereq.MenuChooseInfo;

        /**
         * Verifies a MenuChooseInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MenuChooseInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MenuChooseInfo
         */
        public static fromObject(object: { [k: string]: any }): gamereq.MenuChooseInfo;

        /**
         * Creates a plain object from a MenuChooseInfo message. Also converts values to other types if specified.
         * @param message MenuChooseInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gamereq.MenuChooseInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MenuChooseInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GameStartRsp. */
    interface IGameStartRsp {

        /** GameStartRsp where */
        where?: (gamereq.IRoomPlayerInfo|null);

        /** GameStartRsp mode */
        mode?: (number|null);

        /** GameStartRsp randomseed */
        randomseed?: (number|null);
    }

    /** Represents a GameStartRsp. */
    class GameStartRsp implements IGameStartRsp {

        /**
         * Constructs a new GameStartRsp.
         * @param [properties] Properties to set
         */
        constructor(properties?: gamereq.IGameStartRsp);

        /** GameStartRsp where. */
        public where?: (gamereq.IRoomPlayerInfo|null);

        /** GameStartRsp mode. */
        public mode: number;

        /** GameStartRsp randomseed. */
        public randomseed: number;

        /**
         * Creates a new GameStartRsp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GameStartRsp instance
         */
        public static create(properties?: gamereq.IGameStartRsp): gamereq.GameStartRsp;

        /**
         * Encodes the specified GameStartRsp message. Does not implicitly {@link gamereq.GameStartRsp.verify|verify} messages.
         * @param message GameStartRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gamereq.IGameStartRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GameStartRsp message, length delimited. Does not implicitly {@link gamereq.GameStartRsp.verify|verify} messages.
         * @param message GameStartRsp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gamereq.IGameStartRsp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GameStartRsp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GameStartRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gamereq.GameStartRsp;

        /**
         * Decodes a GameStartRsp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GameStartRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gamereq.GameStartRsp;

        /**
         * Verifies a GameStartRsp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GameStartRsp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GameStartRsp
         */
        public static fromObject(object: { [k: string]: any }): gamereq.GameStartRsp;

        /**
         * Creates a plain object from a GameStartRsp message. Also converts values to other types if specified.
         * @param message GameStartRsp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gamereq.GameStartRsp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GameStartRsp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a UserOperation. */
    interface IUserOperation {

        /** UserOperation playerno */
        playerno?: (number|null);

        /** UserOperation opecode */
        opecode?: (number|null);
    }

    /** Represents a UserOperation. */
    class UserOperation implements IUserOperation {

        /**
         * Constructs a new UserOperation.
         * @param [properties] Properties to set
         */
        constructor(properties?: gamereq.IUserOperation);

        /** UserOperation playerno. */
        public playerno: number;

        /** UserOperation opecode. */
        public opecode: number;

        /**
         * Creates a new UserOperation instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UserOperation instance
         */
        public static create(properties?: gamereq.IUserOperation): gamereq.UserOperation;

        /**
         * Encodes the specified UserOperation message. Does not implicitly {@link gamereq.UserOperation.verify|verify} messages.
         * @param message UserOperation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gamereq.IUserOperation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UserOperation message, length delimited. Does not implicitly {@link gamereq.UserOperation.verify|verify} messages.
         * @param message UserOperation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gamereq.IUserOperation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a UserOperation message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UserOperation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gamereq.UserOperation;

        /**
         * Decodes a UserOperation message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UserOperation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gamereq.UserOperation;

        /**
         * Verifies a UserOperation message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a UserOperation message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UserOperation
         */
        public static fromObject(object: { [k: string]: any }): gamereq.UserOperation;

        /**
         * Creates a plain object from a UserOperation message. Also converts values to other types if specified.
         * @param message UserOperation
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gamereq.UserOperation, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UserOperation to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GameFrameReq. */
    interface IGameFrameReq {

        /** GameFrameReq roomid */
        roomid?: (number|null);

        /** GameFrameReq userid */
        userid?: (number|null);

        /** GameFrameReq frame */
        frame?: (number|null);

        /** GameFrameReq userope */
        userope?: (gamereq.IUserOperation|null);
    }

    /** Represents a GameFrameReq. */
    class GameFrameReq implements IGameFrameReq {

        /**
         * Constructs a new GameFrameReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: gamereq.IGameFrameReq);

        /** GameFrameReq roomid. */
        public roomid: number;

        /** GameFrameReq userid. */
        public userid: number;

        /** GameFrameReq frame. */
        public frame: number;

        /** GameFrameReq userope. */
        public userope?: (gamereq.IUserOperation|null);

        /**
         * Creates a new GameFrameReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GameFrameReq instance
         */
        public static create(properties?: gamereq.IGameFrameReq): gamereq.GameFrameReq;

        /**
         * Encodes the specified GameFrameReq message. Does not implicitly {@link gamereq.GameFrameReq.verify|verify} messages.
         * @param message GameFrameReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gamereq.IGameFrameReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GameFrameReq message, length delimited. Does not implicitly {@link gamereq.GameFrameReq.verify|verify} messages.
         * @param message GameFrameReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gamereq.IGameFrameReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GameFrameReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GameFrameReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gamereq.GameFrameReq;

        /**
         * Decodes a GameFrameReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GameFrameReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gamereq.GameFrameReq;

        /**
         * Verifies a GameFrameReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GameFrameReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GameFrameReq
         */
        public static fromObject(object: { [k: string]: any }): gamereq.GameFrameReq;

        /**
         * Creates a plain object from a GameFrameReq message. Also converts values to other types if specified.
         * @param message GameFrameReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gamereq.GameFrameReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GameFrameReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GameFrameNtf. */
    interface IGameFrameNtf {

        /** GameFrameNtf frame */
        frame?: (number|null);

        /** GameFrameNtf useropes */
        useropes?: (gamereq.IUserOperation[]|null);
    }

    /** Represents a GameFrameNtf. */
    class GameFrameNtf implements IGameFrameNtf {

        /**
         * Constructs a new GameFrameNtf.
         * @param [properties] Properties to set
         */
        constructor(properties?: gamereq.IGameFrameNtf);

        /** GameFrameNtf frame. */
        public frame: number;

        /** GameFrameNtf useropes. */
        public useropes: gamereq.IUserOperation[];

        /**
         * Creates a new GameFrameNtf instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GameFrameNtf instance
         */
        public static create(properties?: gamereq.IGameFrameNtf): gamereq.GameFrameNtf;

        /**
         * Encodes the specified GameFrameNtf message. Does not implicitly {@link gamereq.GameFrameNtf.verify|verify} messages.
         * @param message GameFrameNtf message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gamereq.IGameFrameNtf, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GameFrameNtf message, length delimited. Does not implicitly {@link gamereq.GameFrameNtf.verify|verify} messages.
         * @param message GameFrameNtf message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gamereq.IGameFrameNtf, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GameFrameNtf message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GameFrameNtf
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gamereq.GameFrameNtf;

        /**
         * Decodes a GameFrameNtf message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GameFrameNtf
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gamereq.GameFrameNtf;

        /**
         * Verifies a GameFrameNtf message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GameFrameNtf message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GameFrameNtf
         */
        public static fromObject(object: { [k: string]: any }): gamereq.GameFrameNtf;

        /**
         * Creates a plain object from a GameFrameNtf message. Also converts values to other types if specified.
         * @param message GameFrameNtf
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gamereq.GameFrameNtf, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GameFrameNtf to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
