import * as $protobuf from "protobufjs";
/** Namespace gamereq. */
export namespace gamereq {

    /** Properties of a LoginInfo. */
    interface ILoginInfo {

        /** LoginInfo userid */
        userid?: (number|null);

        /** LoginInfo timestamp */
        timestamp?: (number|Long|null);
    }

    /** Represents a LoginInfo. */
    class LoginInfo implements ILoginInfo {

        /**
         * Constructs a new LoginInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: gamereq.ILoginInfo);

        /** LoginInfo userid. */
        public userid: number;

        /** LoginInfo timestamp. */
        public timestamp: (number|Long);

        /**
         * Creates a new LoginInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginInfo instance
         */
        public static create(properties?: gamereq.ILoginInfo): gamereq.LoginInfo;

        /**
         * Encodes the specified LoginInfo message. Does not implicitly {@link gamereq.LoginInfo.verify|verify} messages.
         * @param message LoginInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gamereq.ILoginInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoginInfo message, length delimited. Does not implicitly {@link gamereq.LoginInfo.verify|verify} messages.
         * @param message LoginInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gamereq.ILoginInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoginInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gamereq.LoginInfo;

        /**
         * Decodes a LoginInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoginInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gamereq.LoginInfo;

        /**
         * Verifies a LoginInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoginInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoginInfo
         */
        public static fromObject(object: { [k: string]: any }): gamereq.LoginInfo;

        /**
         * Creates a plain object from a LoginInfo message. Also converts values to other types if specified.
         * @param message LoginInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gamereq.LoginInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoginInfo to JSON.
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

    /** Properties of a RoomOperation. */
    interface IRoomOperation {

        /** RoomOperation where */
        where?: (gamereq.IRoomPlayerInfo|null);

        /** RoomOperation success */
        success?: (boolean|null);
    }

    /** Represents a RoomOperation. */
    class RoomOperation implements IRoomOperation {

        /**
         * Constructs a new RoomOperation.
         * @param [properties] Properties to set
         */
        constructor(properties?: gamereq.IRoomOperation);

        /** RoomOperation where. */
        public where?: (gamereq.IRoomPlayerInfo|null);

        /** RoomOperation success. */
        public success: boolean;

        /**
         * Creates a new RoomOperation instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomOperation instance
         */
        public static create(properties?: gamereq.IRoomOperation): gamereq.RoomOperation;

        /**
         * Encodes the specified RoomOperation message. Does not implicitly {@link gamereq.RoomOperation.verify|verify} messages.
         * @param message RoomOperation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gamereq.IRoomOperation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomOperation message, length delimited. Does not implicitly {@link gamereq.RoomOperation.verify|verify} messages.
         * @param message RoomOperation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gamereq.IRoomOperation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomOperation message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomOperation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gamereq.RoomOperation;

        /**
         * Decodes a RoomOperation message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomOperation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gamereq.RoomOperation;

        /**
         * Verifies a RoomOperation message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomOperation message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomOperation
         */
        public static fromObject(object: { [k: string]: any }): gamereq.RoomOperation;

        /**
         * Creates a plain object from a RoomOperation message. Also converts values to other types if specified.
         * @param message RoomOperation
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gamereq.RoomOperation, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomOperation to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GameOperation. */
    interface IGameOperation {

        /** GameOperation key */
        key?: (number|null);

        /** GameOperation event */
        event?: (number|null);
    }

    /** Represents a GameOperation. */
    class GameOperation implements IGameOperation {

        /**
         * Constructs a new GameOperation.
         * @param [properties] Properties to set
         */
        constructor(properties?: gamereq.IGameOperation);

        /** GameOperation key. */
        public key: number;

        /** GameOperation event. */
        public event: number;

        /**
         * Creates a new GameOperation instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GameOperation instance
         */
        public static create(properties?: gamereq.IGameOperation): gamereq.GameOperation;

        /**
         * Encodes the specified GameOperation message. Does not implicitly {@link gamereq.GameOperation.verify|verify} messages.
         * @param message GameOperation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gamereq.IGameOperation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GameOperation message, length delimited. Does not implicitly {@link gamereq.GameOperation.verify|verify} messages.
         * @param message GameOperation message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gamereq.IGameOperation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GameOperation message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GameOperation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gamereq.GameOperation;

        /**
         * Decodes a GameOperation message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GameOperation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gamereq.GameOperation;

        /**
         * Verifies a GameOperation message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GameOperation message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GameOperation
         */
        public static fromObject(object: { [k: string]: any }): gamereq.GameOperation;

        /**
         * Creates a plain object from a GameOperation message. Also converts values to other types if specified.
         * @param message GameOperation
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gamereq.GameOperation, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GameOperation to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a UserOperation. */
    interface IUserOperation {

        /** UserOperation where */
        where?: (gamereq.IRoomPlayerInfo|null);

        /** UserOperation ope */
        ope?: (gamereq.IGameOperation|null);
    }

    /** Represents a UserOperation. */
    class UserOperation implements IUserOperation {

        /**
         * Constructs a new UserOperation.
         * @param [properties] Properties to set
         */
        constructor(properties?: gamereq.IUserOperation);

        /** UserOperation where. */
        public where?: (gamereq.IRoomPlayerInfo|null);

        /** UserOperation ope. */
        public ope?: (gamereq.IGameOperation|null);

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

    /** Properties of a GameFrame. */
    interface IGameFrame {

        /** GameFrame frame */
        frame?: (number|null);

        /** GameFrame useropes */
        useropes?: (gamereq.IUserOperation[]|null);
    }

    /** Represents a GameFrame. */
    class GameFrame implements IGameFrame {

        /**
         * Constructs a new GameFrame.
         * @param [properties] Properties to set
         */
        constructor(properties?: gamereq.IGameFrame);

        /** GameFrame frame. */
        public frame: number;

        /** GameFrame useropes. */
        public useropes: gamereq.IUserOperation[];

        /**
         * Creates a new GameFrame instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GameFrame instance
         */
        public static create(properties?: gamereq.IGameFrame): gamereq.GameFrame;

        /**
         * Encodes the specified GameFrame message. Does not implicitly {@link gamereq.GameFrame.verify|verify} messages.
         * @param message GameFrame message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gamereq.IGameFrame, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GameFrame message, length delimited. Does not implicitly {@link gamereq.GameFrame.verify|verify} messages.
         * @param message GameFrame message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gamereq.IGameFrame, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GameFrame message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GameFrame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gamereq.GameFrame;

        /**
         * Decodes a GameFrame message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GameFrame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gamereq.GameFrame;

        /**
         * Verifies a GameFrame message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GameFrame message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GameFrame
         */
        public static fromObject(object: { [k: string]: any }): gamereq.GameFrame;

        /**
         * Creates a plain object from a GameFrame message. Also converts values to other types if specified.
         * @param message GameFrame
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gamereq.GameFrame, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GameFrame to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MainGameFrame. */
    interface IMainGameFrame {

        /** MainGameFrame frames */
        frames?: (gamereq.IGameFrame[]|null);
    }

    /** Represents a MainGameFrame. */
    class MainGameFrame implements IMainGameFrame {

        /**
         * Constructs a new MainGameFrame.
         * @param [properties] Properties to set
         */
        constructor(properties?: gamereq.IMainGameFrame);

        /** MainGameFrame frames. */
        public frames: gamereq.IGameFrame[];

        /**
         * Creates a new MainGameFrame instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MainGameFrame instance
         */
        public static create(properties?: gamereq.IMainGameFrame): gamereq.MainGameFrame;

        /**
         * Encodes the specified MainGameFrame message. Does not implicitly {@link gamereq.MainGameFrame.verify|verify} messages.
         * @param message MainGameFrame message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: gamereq.IMainGameFrame, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MainGameFrame message, length delimited. Does not implicitly {@link gamereq.MainGameFrame.verify|verify} messages.
         * @param message MainGameFrame message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: gamereq.IMainGameFrame, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MainGameFrame message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MainGameFrame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): gamereq.MainGameFrame;

        /**
         * Decodes a MainGameFrame message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MainGameFrame
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): gamereq.MainGameFrame;

        /**
         * Verifies a MainGameFrame message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MainGameFrame message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MainGameFrame
         */
        public static fromObject(object: { [k: string]: any }): gamereq.MainGameFrame;

        /**
         * Creates a plain object from a MainGameFrame message. Also converts values to other types if specified.
         * @param message MainGameFrame
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: gamereq.MainGameFrame, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MainGameFrame to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
