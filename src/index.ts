import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { getAuth, getMailList, info } from './input';

async function main() {
  const curDir = path.join(process.execPath, '..');
  const auth = getAuth(curDir);
  const transporter = nodemailer.createTransport({ service: 'gmail', host: 'smtp.gmail.com', auth });

  const promises = getMailList(curDir).map(async ({ email, name }) => {
    const filePath = path.join('.', '급여명세서', `${name}_급여명세서.pdf`);
    process.chdir(curDir);

    return transporter
      .sendMail({
        from: auth.user,
        to: email,
        attachments: [{ path: filePath }],
        ...info,
      })
      .then(() => {
        console.log(`${name}에게 ${filePath} 파일 전송 : 성공 ✅`);
      })
      .catch((error) => {
        console.log(`${name}에게 ${filePath} 파일 전송 : 실패 ❌`);
        fs.writeFileSync(path.join(curDir, 'error.log'), JSON.stringify(error));
        console.log(error);
      });
  });

  await Promise.all(promises);
}

main().catch(console.error);
