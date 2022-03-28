import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

// Plaintext hash 做 hashed string
export async function hashPassword(plainPassword:string) {
    const hash = await bcrypt.hash(plainPassword,SALT_ROUNDS);
    return hash;
};

// 另一段hash 咗佢，再同hashed string 比較
export async function checkPassword(plainPassword:string,hashPassword:string){
    const match = await bcrypt.compare(plainPassword,hashPassword);
    return match;
}
