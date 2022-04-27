import fs from 'fs';
import path from 'path';

export const getAuth = (curDir: string) => {
  const auth = require(`${curDir}/auth.json`);
  if (!auth.user || !auth.pass) throw '관리자 정보가 잘못되었습니다. auth.json 파일을 수정해주세요.';
  return { user: auth.user, pass: auth.pass };
};

const today = new Date();
export const info = {
  subject: `${today.getFullYear()}년 ${today.getMonth() + 1}월 급여명세서입니다.`,
  text: '수고 많으셨어요!',
};

export const getMailList = (curDir: string) => {
  const filePath = path.join(curDir, 'email-list.csv');
  const data = fs.readFileSync(filePath, { encoding: 'utf8' });
  return data.split('\n').map((x) => {
    const [name, email] = x.split(',');
    return { name, email };
  });
};
