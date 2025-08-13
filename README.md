# 🌟 White Dwarf Papers Tracker

An interactive web application that tracks and visualizes white dwarf research papers from NASA ADS, displaying them on a world map with citation-based sizing and institutional clustering.

## 🚀 Live Demo

Visit the live website: [https://YOUR_USERNAME.github.io/white-dwarf-tracker](https://YOUR_USERNAME.github.io/white-dwarf-tracker)

## ✨ Features

- **Interactive World Map**: Visualize research institutions studying white dwarfs
- **Citation-based Sizing**: Marker sizes reflect total citations from each institution
- **Real NASA ADS Data**: Fetches actual papers from NASA's Astrophysics Data System
- **Multiple Time Ranges**: Filter papers by publication year (2024, 2023-2024, 2020-2024, etc.)
- **Citation Filtering**: Show only papers above a minimum citation threshold
- **Institution Details**: Click markers to see top papers and statistics
- **Auto-updating**: Daily updates via GitHub Actions
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Mapping**: Leaflet.js with OpenStreetMap tiles
- **Data Source**: NASA ADS API
- **Automation**: GitHub Actions
- **Hosting**: GitHub Pages

## 📊 Data Overview

The tracker monitors papers containing "white dwarf" in the title or abstract, providing:
- Paper titles, authors, and publication years
- Citation counts and journal names
- Author institutional affiliations
- Geographic mapping of research institutions
- Real-time statistics and trends

## 🔧 Setup Instructions

### 1. Fork/Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/white-dwarf-tracker.git
cd white-dwarf-tracker
```

### 2. Set Up NASA ADS API Token

1. Get a free API token from [NASA ADS](https://ui.adsabs.harvard.edu/user/settings/token)
2. Go to your repository Settings → Secrets and Variables → Actions
3. Click "New repository secret"
4. Name: `NASA_ADS_TOKEN`
5. Value: Your API token

### 3. Enable GitHub Pages

1. Go to repository Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `main` / `/ (root)`
4. Save

### 4. Trigger First Data Fetch

1. Go to Actions tab in your repository
2. Click "Update White Dwarf Papers" workflow
3. Click "Run workflow" → "Run workflow"
4. Wait for completion (creates `data/papers-data.json`)

## 📁 Repository Structure

```
white-dwarf-tracker/
├── .github/workflows/
│   └── update-papers.yml      # GitHub Actions workflow
├── scripts/
│   └── fetch-papers.js       # NASA ADS data fetching script
├── data/
│   └── papers-data.json      # Generated papers data (auto-created)
├── index.html               # Main website
├── package.json            # Node.js dependencies
└── README.md              # This file
```

## 🔄 How It Works

1. **GitHub Actions** runs daily at 6 AM UTC
2. **Fetch script** queries NASA ADS API for white dwarf papers
3. **Data processing** extracts institutions and coordinates
4. **JSON file** is updated with new papers and citations
5. **Website** loads data from JSON file (no browser API calls)
6. **Interactive map** displays the research landscape

## 🎨 Customization

### Add New Institutions

Edit `scripts/fetch-papers.js` and add entries to `institutionCoords`:

```javascript
const institutionCoords = {
    'Your University': { lat: 40.7589, lng: -73.9851 },
    // ... existing entries
};
```

### Modify Search Query

Change the search terms in `scripts/fetch-papers.js`:

```javascript
const query = `(title:"neutron star" OR abstract:"neutron star") year:${startYear}-${endYear}`;
```

### Adjust Update Frequency

Edit `.github/workflows/update-papers.yml`:

```yaml
schedule:
  - cron: '0 18 * * *'  # Daily at 6 PM UTC
```

## 🔒 Security

- ✅ API tokens stored securely in GitHub Secrets
- ✅ No client-side API calls or exposed tokens
- ✅ Server-side data processing via GitHub Actions
- ✅ Static JSON file hosting on GitHub Pages

## 📈 Statistics

The application tracks:
- Total papers matching search criteria
- Number of unique research institutions
- Total and average citation counts
- Geographic distribution of research

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NASA ADS](https://ui.adsabs.harvard.edu/) for providing the astrophysics database
- [Leaflet](https://leafletjs.com/) for the interactive mapping library
- [OpenStreetMap](https://www.openstreetmap.org/) contributors for map tiles
- The white dwarf research community for their contributions to science

## 🐛 Issues & Support

If you encounter any issues or have suggestions:
1. Check existing [issues](https://github.com/YOUR_USERNAME/white-dwarf-tracker/issues)
2. Create a new issue with detailed information
3. Include browser version, error messages, and steps to reproduce

---

Made with ❤️ for the astronomy community
