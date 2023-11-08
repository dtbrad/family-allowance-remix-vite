import {createHmac} from 'crypto';
import 'dotenv/config';

const cryptoSalt = process.env.CRYPTO_SALT;

function hasher(password: string, salt: string) {
    const hash = createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt,
        hashedpassword: value
    };
}

export default function generatePassword(password: string) {
    const passwordData = hasher(password, cryptoSalt!);
    return passwordData.hashedpassword;
}
