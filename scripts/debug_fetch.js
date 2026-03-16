import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function debugFetch() {
    try {
        const urls = [
            'https://www.kookmin.ac.kr/user/scGuid/scSchedule/index.do',
            'https://www.kookmin.ac.kr/user/unLvlh/lvlhSpor/todayMenu/index.do'
        ];

        for (const url of urls) {
            const { data, headers } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            const name = url.split('/').slice(-2)[0];
            fs.writeFileSync(`${name}_raw.html`, data);
            console.log(`${url} Status: 200, Encoding: ${headers['content-type']}`);
        }
    } catch (error) {
        console.error('Debug fetch error:', error.message);
    }
}

debugFetch();
