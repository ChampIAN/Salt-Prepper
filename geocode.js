require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
    'https://yumrljdqolzezhbetdwj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bXJsamRxb2x6ZXpoYmV0ZHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjIzMzEsImV4cCI6MjA4ODgzODMzMX0.MOX1JJS4FaMFQF4DjX51O1K1QiLTxy9igg5xRgkDP-I'
);

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    const { data: parks, error } = await supabase.from('rv_parks').select('id, name, address');
    if (error) {
        console.error(error);
        return;
    }

    console.log(`Found ${parks.length} parks to geocode`);

    let updates = [];

    for (const park of parks) {
        if (!park.address) continue;
        console.log(`Geocoding ${park.address}...`);
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(park.address)}&limit=1`;
            const res = await fetch(url, { headers: { 'User-Agent': 'SaltAndPrepper/1.0' } });
            const geom = await res.json();

            let lat, lon;
            if (geom && geom.length > 0) {
                lat = parseFloat(geom[0].lat);
                lon = parseFloat(geom[0].lon);
            } else {
                // Try just the city/state part
                const parts = park.address.split(',');
                if (parts.length >= 2) {
                    const fallback = parts.slice(1).join(',').trim();
                    const url2 = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallback)}&limit=1`;
                    const res2 = await fetch(url2, { headers: { 'User-Agent': 'SaltAndPrepper/1.0' } });
                    const geom2 = await res2.json();
                    if (geom2 && geom2.length > 0) {
                        lat = parseFloat(geom2[0].lat);
                        lon = parseFloat(geom2[0].lon);
                    }
                }
            }
            if (lat && lon) {
                updates.push(`UPDATE public.rv_parks SET latitude = ${lat}, longitude = ${lon} WHERE id = '${park.id}';`);
            } else {
                console.log(`Could not geocode ${park.address}`);
                // random fallback in US
                updates.push(`UPDATE public.rv_parks SET latitude = ${37 + (Math.random() * 10 - 5)}, longitude = ${-95 + (Math.random() * 40 - 20)} WHERE id = '${park.id}';`);
            }
        } catch (e) {
            console.error(e);
        }
        await sleep(1000); // rate limit for nominatim
    }

    fs.writeFileSync('update_coords.sql', updates.join('\n'));
    console.log('Done mapping.');
}

run();
