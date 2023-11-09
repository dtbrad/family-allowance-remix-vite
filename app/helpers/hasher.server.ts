import {createHmac} from 'crypto';

export default function hasher(password: string, salt: string) {
    const hash = createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt,
        hashedpassword: value
    };
}
