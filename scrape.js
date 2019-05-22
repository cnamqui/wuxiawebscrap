const request = require('request');
const cheerio = require('cheerio');
const concat = require('concat-files');

const [node, path, name, prefix, start, end] = process.argv;
const _prefix = prefix || 'tgr-chapter-';
const _name = 'the-great-ruler';
const _start = Number(start || 885);
const _end = Number(end || 1038);
console.log(_start, _end);
let promises = [];
let files = [];
for (let i = _start || 1; i <= _end; i++) {
  const url = `https://www.wuxiaworld.com/novel/${_name}/${_prefix}${i}`;
  console.log(url);
  files.push(`${_name}_${i}.txt`);
  let p = new Promise((resolve, reject) => {
    request(url, function(err, resp, body) {
      if (err || !body) {
        console.log(`err: ${url}`);
        reject(err);
        //throw err;
      }
      $ = cheerio.load(body);
      const fs = require('fs');
      var options = { encoding: 'utf8' };
     // var wstream = fs.createWriteStream(`${_name}_${i}.txt`, options);
      const test = $('.fr-view');
      let txt = '';
      $('.fr-view')
        .find('p[dir] span')
        .each((ind, elm) => {
          txt += $(elm).text() + '\n';
        });
      // wstream.write('---------------------\n\n\n\n\n');
      txt += '---------------------\n\n\n\n\n';
      fs.writeFile(`${_name}_${i}.txt`, txt, options, () => {
        resolve(`${_name}_${i}.txt`);
      });
      //wstream.end();
      //resolve(`${_name}_${i}.txt`);
    });
  });
  promises.push(p);
}
Promise.all(promises).then(r => {
  //console.log(r);
  // console.log(files);
  concat(files, `${_name}_${_start}_TO_${_end}.txt`, function(err) {
    if (err) throw err;
    console.log('done');
  });
});
