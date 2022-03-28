import { Page, chromium } from 'playwright';
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
});

export async function scraperForInjuries(url: string) {
    client.connect();

    const browser = await chromium.launch({
        headless: false
    });

    const page: Page = await browser.newPage();

    await page.goto(url);

    const title = await page.evaluate(function () {
        const title = document.querySelector('') as HTMLElement;
        const toText = title.innerText.replace(/\[\d+\]/g, '');
        return toText
    })

    const description = await page.evaluate(function () {
        const descriptions = Array.from(document.querySelectorAll(''));
        let p = ""
        for (let description of descriptions) {
            let toElement = description as HTMLElement
            const toText = toElement.innerText.replace(/\[\d+\]/g, '')
            p += toText;
            p += '\n';
        }
        return p

    })
    console.log(title + '\n' + description)

    //await client.query(`insert into Injuries (injury_name, description, created_at, updated_at) VALUES ($1,$2, NOW(), NOW())`,[title, description]);

    client.end();

    await browser.close();
}

// scraperForInjuries('')

export async function scraperForSyndromes(url: string) {
    client.connect();

    const browser = await chromium.launch({
        headless: false
    });

    const page: Page = await browser.newPage();

    await page.goto(url);

    const syndrome = await page.evaluate(function () {
        const syndrome = document.querySelector('') as HTMLElement;
        const toText = syndrome.innerText.replace(/\[\d+\]/g, '');
        return toText
    })

    const details = await page.evaluate(function () {
        const details = Array.from(document.querySelectorAll(''));
        let p = ""
        for (let detail of details) {
            let toElement = detail as HTMLElement
            const toText = toElement.innerText.replace(/\[\d+\]/g, '')
            p += toText;
            p += '\n';
        }
        return p

    })
    
    
    console.log(syndrome, details)

    //await client.query(`insert into Syndromes (syndrome_name, created_at, updated_at) VALUES ($1, NOW(), NOW())`,[syndrome]);

    //await client.query(`insert into Syndromes (syndrome_name, details, created_at, updated_at) VALUES ($1,$2, NOW(), NOW())`,[syndrome, details]);

    client.end();

    await browser.close();
}

// scraperForSyndromes('')