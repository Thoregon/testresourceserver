/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

import express    from 'express';
import cors       from 'cors';
import parse      from 'co-body';
import path       from 'path';
import fs         from 'fs/promises';

const btoa = (data) => Buffer.from(data, "binary").toString("base64");
const atob = (data) => Buffer.from(data, "base64").toString("binary");

const service   = express();

service.use(cors({ origin: '*' }));

const setHeaders =  function(res, path) {
    res.set("Access-Control-Allow-Origin",  "*");
    res.set("Access-Control-Allow-Headers", "Content-Type,X-Requested-With");
    res.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.set("Cross-Origin-Embedder-Policy", "require-corp");
    res.set("Cross-Origin-Opener-Policy",   "same-origin");
}


//  serve uploaded files
const staticroot = path.resolve(process.cwd(), 'www');
service.use(express.static(staticroot, { setHeaders }));

// serve other test
const staticroot2 = path.resolve(process.cwd(), '../thoregon.modules/thoregon.neuland/test');
service.use(express.static(staticroot2, { setHeaders }));

const B64MGK = '$B64$';
const B64ML  = B64MGK.length;

// receive uploaded files
service.post('/add', async (req, res) => {
    try {
        let body = await parse.json(req, { limit: '2mb' });

        if (!body) {
            console.log('nothing to store');
            res.status(400).send('No files were uploaded.');
            return;
        }

        let { cid, filename, ext , content } = body;
        if (!content) {
            console.log('nothing to store');
            res.status(400).send('No files were uploaded.');
            return;
        }
        if (content.startsWith(B64MGK)) content = Buffer.from(content.substring(B64ML), "base64");    // base64 -> binary
        await fs.writeFile(path.join(staticroot, `${cid}.${ext}`), content);
        res.status(200).json({ status: 'ok' });
    } catch(e) {
        console.log("POST add", e);
        res.status(500).json({ error: e.stack ?? e.message });
    }
});

const PORT = 7779;

service.listen(PORT,"0.0.0.0");

console.log("Test Resource Server\n====================\n");
console.log(`> Listening to 7779 -> http://127.0.0.1:${PORT}/README.md`);
console.log(`> POST Resources to -> http://127.0.0.1:${PORT}/add   :: body json { cid, filename, ext , content }`);
