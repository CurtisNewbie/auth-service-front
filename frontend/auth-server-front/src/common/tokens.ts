export interface UserToken {

    id: number;

    /** secret key */
    secretKey: string;

    /** name of the key */
    name: string;

    /** when the key is expired */
    expirationTime: Date;

    /** when the record is created */
    createTime: Date;

} 