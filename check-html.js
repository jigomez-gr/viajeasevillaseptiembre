const http = require('http');

http.get('http://localhost:3000', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Status code:', res.statusCode);
        console.log('Title:', data.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);
        console.log('Body length:', data.length);
        console.log('Some body snippets:');
        console.log(data.substring(0, 1500));
    });
}).on('error', (err) => {
    console.error('Error:', err);
});
