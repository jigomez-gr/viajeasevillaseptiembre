const http = require('http');

http.get('http://localhost:3000', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Includes ALTA VELOCIDAD IRYO:', data.includes('ALTA VELOCIDAD IRYO'));
        console.log('Includes Auditorio Virtual:', data.includes('Auditorio Virtual'));
        const index = data.indexOf('ALTA VELOCIDAD IRYO');
        if (index !== -1) {
            console.log('Snippet:', data.substring(index - 100, index + 300));
        } else {
            console.log('Could not find ALTA VELOCIDAD IRYO in HTML. HTML length:', data.length);
        }
    });
}).on('error', (err) => {
    console.error('Error fetching localhost:', err);
});
