async function test() {
    console.log('Testing frontend...');
    const indexHtmlRes = await fetch('https://www.jannathandloom.com');
    const indexHtml = await indexHtmlRes.text();
    const apiUrlMatch = indexHtml.match(/https?:\/\/[a-zA-Z0-9.-]+\.vercel\.app/g);
    console.log('Detected Vercel URLs in frontend HTML:', apiUrlMatch);

    console.log('\nTesting backend CORS directly...');
    const url = 'https://server-eta-wheat-26.vercel.app/api/products';
    // Also test root health check
    const rootRes = await fetch('https://server-eta-wheat-26.vercel.app/');
    console.log('Health check status:', rootRes.status, await rootRes.text());
    try {
        const res = await fetch(url, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'https://www.jannathandloom.com',
                'Access-Control-Request-Method': 'GET'
            }
        });
        console.log('Status:', res.status);
        console.log('CORS Headers:', res.headers.get('access-control-allow-origin'));
    } catch (e) {
        console.error('Error fetching backend:', e.message);
    }
}
test();
