const https = require('https');
const fs = require('fs');
const path = require('path');

// NASA ADS API configuration
const NASA_ADS_TOKEN = process.env.NASA_ADS_TOKEN;
const NASA_ADS_BASE_URL = 'https://api.adsabs.harvard.edu/v1/search/query';

// Institution coordinates database
const institutionCoords = {
    'Harvard University': { lat: 42.3744, lng: -71.1169 },
    'Harvard-Smithsonian Center for Astrophysics': { lat: 42.3601, lng: -71.0589 },
    'MIT': { lat: 42.3601, lng: -71.0942 },
    'University of Cambridge': { lat: 52.2053, lng: 0.1218 },
    'Oxford University': { lat: 51.7548, lng: -1.2544 },
    'Max Planck Institute': { lat: 48.2608, lng: 11.6795 },
    'European Southern Observatory': { lat: 48.2642, lng: -24.6272 },
    'Caltech': { lat: 34.1377, lng: -118.1253 },
    'UC Berkeley': { lat: 37.8719, lng: -122.2585 },
    'Stanford University': { lat: 37.4275, lng: -122.1697 },
    'University of Chicago': { lat: 41.7886, lng: -87.5987 },
    'Princeton University': { lat: 40.3430, lng: -74.6514 },
    'Yale University': { lat: 41.3163, lng: -72.9223 },
    'Columbia University': { lat: 40.8075, lng: -73.9626 },
    'University of Toronto': { lat: 43.6629, lng: -79.3957 },
    'University of Tokyo': { lat: 35.7128, lng: 139.7619 },
    'Australian National University': { lat: -35.2777, lng: 149.1185 },
    'Tel Aviv University': { lat: 32.1133, lng: 34.8006 },
    'University of Cape Town': { lat: -33.9577, lng: 18.4615 },
    'Indian Institute of Science': { lat: 13.0210, lng: 77.5658 },
    'University of São Paulo': { lat: -23.5629, lng: -46.7319 },
    'CERN': { lat: 46.2044, lng: 6.1432 },
    'ESO': { lat: -24.6272, lng: -70.4041 },
    'Space Telescope Science Institute': { lat: 39.3299, lng: -76.6205 },
    'Jet Propulsion Laboratory': { lat: 34.2011, lng: -118.1711 },
    'Carnegie Observatories': { lat: 34.1141, lng: -118.0570 },
    'University of Warwick': { lat: 52.3791, lng: -1.5603 },
    'University of Southampton': { lat: 50.9097, lng: -1.4044 },
    'University of Leicester': { lat: 52.6369, lng: -1.1398 },
    'Universidad de Chile': { lat: -33.4569, lng: -70.6483 },
    'Observatoire de Paris': { lat: 48.8566, lng: 2.3522 },
    'University of Arizona': { lat: 32.2319, lng: -110.9501 },
    'University of Wisconsin': { lat: 43.0759, lng: -89.4194 },
    'University of Michigan': { lat: 42.2780, lng: -83.7382 },
    'Johns Hopkins University': { lat: 39.3299, lng: -76.6205 }
};

// Extract institution from affiliation string
function extractInstitution(affiliation) {
    if (!affiliation) return 'Unknown Institution';
    
    // Common institution patterns
    const patterns = [
        { regex: /Harvard[- ]?Smithsonian/i, name: 'Harvard-Smithsonian Center for Astrophysics' },
        { regex: /Harvard/i, name: 'Harvard University' },
        { regex: /MIT/i, name: 'MIT' },
        { regex: /Cambridge/i, name: 'University of Cambridge' },
        { regex: /Oxford/i, name: 'Oxford University' },
        { regex: /Max Planck/i, name: 'Max Planck Institute' },
        { regex: /Caltech/i, name: 'Caltech' },
        { regex: /Berkeley/i, name: 'UC Berkeley' },
        { regex: /Stanford/i, name: 'Stanford University' },
        { regex: /Chicago/i, name: 'University of Chicago' },
        { regex: /Princeton/i, name: 'Princeton University' },
        { regex: /Yale/i, name: 'Yale University' },
        { regex: /Columbia/i, name: 'Columbia University' },
        { regex: /Toronto/i, name: 'University of Toronto' },
        { regex: /Tokyo/i, name: 'University of Tokyo' },
        { regex: /Australian National/i, name: 'Australian National University' },
        { regex: /Tel Aviv/i, name: 'Tel Aviv University' },
        { regex: /Cape Town/i, name: 'University of Cape Town' },
        { regex: /Indian Institute/i, name: 'Indian Institute of Science' },
        { regex: /São Paulo/i, name: 'University of São Paulo' },
        { regex: /CERN/i, name: 'CERN' },
        { regex: /ESO/i, name: 'European Southern Observatory' },
        { regex: /Space Telescope/i, name: 'Space Telescope Science Institute' },
        { regex: /JPL|Jet Propulsion/i, name: 'Jet Propulsion Laboratory' },
        { regex: /Carnegie/i, name: 'Carnegie Observatories' },
        { regex: /Warwick/i, name: 'University of Warwick' },
        { regex: /Southampton/i, name: 'University of Southampton' },
        { regex: /Leicester/i, name: 'University of Leicester' },
        { regex: /Universidad de Chile/i, name: 'Universidad de Chile' },
        { regex: /Observatoire de Paris/i, name: 'Observatoire de Paris' },
        { regex: /Arizona/i, name: 'University of Arizona' },
        { regex: /Wisconsin/i, name: 'University of Wisconsin' },
        { regex: /Michigan/i, name: 'University of Michigan' },
        { regex: /Johns Hopkins/i, name: 'Johns Hopkins University' }
    ];
    
    for (const pattern of patterns) {
        if (pattern.regex.test(affiliation)) {
            return pattern.name;
        }
    }
    
    return affiliation.split(',')[0].trim(); // First part of affiliation
}

// Get coordinates for institution
function getInstitutionCoords(institution) {
    const coords = institutionCoords[institution];
    if (coords) {
        return {
            lat: coords.lat + (Math.random() - 0.5) * 0.2, // Add small random offset
            lng: coords.lng + (Math.random() - 0.5) * 0.2
        };
    }
    
    // Default to random coordinates if not found
    return {
        lat: (Math.random() - 0.5) * 160, // Random latitude
        lng: (Math.random() - 0.5) * 360  // Random longitude
    };
}

// Make HTTPS request
function makeRequest(url, options) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (error) {
                    reject(new Error(`Failed to parse JSON: ${error.message}`));
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.end();
    });
}

// Fetch papers from NASA ADS
async function fetchNASAPapers(yearRange = '2020-2024', maxResults = 200) {
    if (!NASA_ADS_TOKEN) {
        throw new Error('NASA_ADS_TOKEN environment variable is not set');
    }
    
    const [startYear, endYear] = yearRange.split('-');
    const query = `(title:"white dwarf" OR abstract:"white dwarf") year:${startYear}-${endYear}`;
    const fields = 'title,author,year,citation_count,bibcode,aff,pub';
    
    const url = new URL(NASA_ADS_BASE_URL);
    url.searchParams.set('q', query);
    url.searchParams.set('fl', fields);
    url.searchParams.set('rows', maxResults.toString());
    url.searchParams.set('sort', 'citation_count desc');
    
    const options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${NASA_ADS_TOKEN}`,
            'Content-Type': 'application/json'
        }
    };
    
    try {
        console.log(`Fetching papers from NASA ADS: ${url.toString()}`);
        const data = await makeRequest(url.toString(), options);
        
        if (!data.response || !data.response.docs) {
            throw new Error('Invalid response from NASA ADS API');
        }
        
        console.log(`Successfully fetched ${data.response.docs.length} papers`);
        
        const papers = data.response.docs.map(doc => {
            const firstAuthorAff = doc.aff && doc.aff[0] ? doc.aff[0] : 'Unknown Institution';
            const institution = extractInstitution(firstAuthorAff);
            const coords = getInstitutionCoords(institution);
            
            return {
                title: doc.title ? doc.title[0] : 'Untitled',
                authors: doc.author || ['Unknown Author'],
                year: doc.year || new Date().getFullYear(),
                citations: doc.citation_count || 0,
                institution: institution,
                lat: coords.lat,
                lng: coords.lng,
                bibcode: doc.bibcode,
                journal: doc.pub || 'Unknown Journal',
                affiliation: firstAuthorAff,
                fetchedAt: new Date().toISOString()
            };
        });
        
        return papers;
        
    } catch (error) {
        console.error('Error fetching NASA ADS data:', error);
        throw error;
    }
}

// Main function
async function main() {
    try {
        console.log('Starting NASA ADS data fetch...');
        
        // Fetch papers for multiple year ranges
        const yearRanges = ['2024-2024', '2023-2024', '2020-2024', '2015-2024', '2010-2024'];
        const allData = {};
        
        for (const yearRange of yearRanges) {
            console.log(`\nFetching papers for ${yearRange}...`);
            try {
                const papers = await fetchNASAPapers(yearRange, 200);
                allData[yearRange] = papers;
                console.log(`✅ Successfully fetched ${papers.length} papers for ${yearRange}`);
                
                // Add delay to respect API rate limits
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (error) {
                console.error(`❌ Failed to fetch papers for ${yearRange}:`, error.message);
                allData[yearRange] = [];
            }
        }
        
        // Create data directory if it doesn't exist
        const dataDir = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        // Save data to JSON file
        const outputFile = path.join(dataDir, 'papers-data.json');
        const outputData = {
            lastUpdated: new Date().toISOString(),
            totalPapers: Object.values(allData).flat().length,
            yearRanges: allData
        };
        
        fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));
        console.log(`\n✅ Successfully saved ${outputData.totalPapers} papers to ${outputFile}`);
        
        // Print summary
        console.log('\n📊 Summary:');
        for (const [yearRange, papers] of Object.entries(allData)) {
            console.log(`  ${yearRange}: ${papers.length} papers`);
        }
        
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}
