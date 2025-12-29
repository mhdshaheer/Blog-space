const bcrypt: any = require('bcryptjs');

export const hashPassword = async (password: string, saltRounds: number = 10): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (e: any) {
    throw e;
  }
};

export const comparePassword = async (candidate: string, hash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(candidate, hash);
  } catch (e: any) {
    throw e;
  }
};
