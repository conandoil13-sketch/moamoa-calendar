import { execSync } from 'child_process';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../src/data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function fetchHtml(url) {
    try {
        const command = `curl -s -L -H "User-Agent: ${UA}" "${url}"`;
        return execSync(command, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
    } catch (error) {
        console.error(`Curl error fetching ${url}:`, error.message);
        return "";
    }
}

async function crawlAcademicSchedule() {
    console.log('Crawling Academic Schedule...');
    const data = fetchHtml('https://www.kookmin.ac.kr/user/scGuid/scSchedule/index.do');
    if (!data) return;

    const $ = cheerio.load(data);
    const schedules = [];
    let currentMonth = "";

    $('#monthTable tr').each((i, el) => {
        const monthEm = $(el).find('em');
        if (monthEm.length > 0) {
            currentMonth = monthEm.first().text().trim();
        }

        const tds = $(el).find('td');
        if (tds.length < 2) return;

        let dateRange = "";
        let description = "";

        if (tds.length >= 3) {
            dateRange = tds.eq(tds.length - 2).text().trim();
            description = tds.eq(tds.length - 1).text().trim();
        } else if (tds.length === 2) {
            dateRange = tds.eq(0).text().trim();
            description = tds.eq(1).text().trim();
        }

        if (dateRange && description && !description.includes('내용')) {
            schedules.push({
                month: parseInt(currentMonth),
                range: dateRange,
                description: description.replace(/\s+/g, ' ')
            });
        }
    });

    fs.writeFileSync(
        path.join(DATA_DIR, 'academic_schedule.json'),
        JSON.stringify(schedules, null, 2)
    );
    console.log(`Saved ${schedules.length} schedule items.`);
}

async function crawlCafeteriaMenu() {
    console.log('Crawling Cafeteria Menu...');
    const data = fetchHtml('https://www.kookmin.ac.kr/user/unLvlh/lvlhSpor/todayMenu/index.do');
    if (!data) return;

    const $ = cheerio.load(data);
    const menus = {};

    $('p.cont_subtit').each((_, header) => {
        const restaurantName = $(header).text().trim();
        if (!restaurantName || (!restaurantName.includes('식당') && !restaurantName.includes('카페'))) return;

        const table = $(header).nextAll('div.table_wrap').first().find('table');
        if (!table.length) return;

        const restaurantMenu = [];
        table.find('tbody tr').each((_, row) => {
            const tds = $(row).find('td');
            if (tds.length < 2) return;

            const corner = tds.first().text().trim().replace(/\s+/g, ' ');
            if (!corner || corner === '구분') return;

            const weeklyMeals = [];
            tds.slice(1).each((i, td) => {
                // Find the specific text content, avoiding the value in the hidden input
                // The structure often is: <input value="...">{Display Text}
                // However, some nodes have the text inside a value attribute.
                // Let's just grab the text but filter out anything that looks like JSON or attribute garbage.

                let text = $(td).clone().find('input').remove().end().text().trim();

                // Sometimes the text is only inside the input's value or as a text node next to it.
                // Let's refine the cleaning:
                text = text.replace(/\}?\">/g, '').trim(); // Remove leftovers like "}">"
                text = text.replace(/\s+/g, ' ');

                weeklyMeals.push(text);
            });

            if (weeklyMeals.some(m => m.length > 2)) {
                restaurantMenu.push({
                    corner,
                    weeklyMeals
                });
            }
        });

        if (restaurantMenu.length > 0) {
            menus[restaurantName] = restaurantMenu;
        }
    });

    fs.writeFileSync(
        path.join(DATA_DIR, 'cafeteria_menu.json'),
        JSON.stringify(menus, null, 2)
    );
    console.log(`Saved menus for ${Object.keys(menus).length} restaurants.`);
}

async function run() {
    await crawlAcademicSchedule();
    await crawlCafeteriaMenu();
}

run();
