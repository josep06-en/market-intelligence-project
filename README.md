# Market Intelligence Project - Pricing Decision Tool

A modern, mobile-friendly web application that helps pricing managers make data-driven decisions through interactive simulations, performance metrics, and actionable insights.

## 🚀 Features

### 📱 Mobile-First Design
- Responsive layout optimized for desktop, tablet, and mobile devices
- Touch-friendly interface with hamburger menu navigation
- Adaptive charts and data visualization

### 💡 Decision-First Approach
- **Strategy Page**: Clear revenue impact visualization and top recommendations
- **Simulation Lab**: Interactive pricing scenario testing for any product
- **Performance Metrics**: Real-time KPI tracking with trend analysis
- **Actionable Insights**: Severity-based insights sorted by business impact

### 📊 Data Visualization
- Interactive revenue trend charts using Recharts
- Dynamic KPI cards with growth indicators
- Color-coded confidence levels and impact metrics
- Date range filtering with preset options (7, 30, 60, 90 days, All Time)

### ⚡ Technical Features
- React 18 with TypeScript for type safety
- Tailwind CSS for modern, responsive styling
- Vite for fast development and optimized builds
- Component-based architecture with reusable UI elements

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v3
- **Charts**: Recharts
- **Data**: JSON-based data pipeline with Python processing
- **Icons**: Custom SVG icons

## 📁 Project Structure

```
market-intelligence-project/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Navbar.tsx   # Mobile-responsive navigation
│   │   │   ├── KPICard.tsx  # KPI display component
│   │   │   └── InsightCard.tsx
│   │   ├── pages/           # Main application pages
│   │   │   ├── Strategy.tsx     # Pricing strategy dashboard
│   │   │   ├── Simulation.tsx   # Interactive pricing simulator
│   │   │   ├── Performance.tsx  # Performance metrics
│   │   │   └── Insights.tsx     # Business insights
│   │   ├── utils/           # Utility functions
│   │   │   ├── dateFilter.ts    # Date range filtering
│   │   │   ├── format.ts        # Data formatting utilities
│   │   │   └── validate.ts      # Data validation
│   │   └── types/           # TypeScript type definitions
│   ├── public/              # Static assets
│   └── package.json         # Dependencies and scripts
├── data/                    # Processed data files
│   ├── processed/           # JSON data for frontend
│   └── raw/                 # Raw data sources
├── scripts/                 # Data processing scripts
│   └── run_pipeline.py      # Data generation pipeline
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Python (for data processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/josep06-en/market-intelligence-project.git
   cd market-intelligence-project
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Generate data (optional)**
   ```bash
   cd ../scripts
   python run_pipeline.py
   ```

4. **Start the development server**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Mobile Usage

The application is fully responsive and works seamlessly on mobile devices:

- **Navigation**: Tap the hamburger menu (☰) to access navigation
- **Date Selection**: Use the dropdown to filter data by date range
- **Interactive Elements**: All buttons and interactions are touch-optimized
- **Charts**: Automatically resize for mobile viewing

## 🎯 Key Pages

### Strategy Page
- View total projected revenue impact
- Top 8 pricing recommendations with expected outcomes
- Quick actions to navigate to simulation and performance
- Key insights summary

### Simulation Lab
- Select any product to test pricing scenarios
- Compare different price points and their impact
- View revenue projections and confidence levels
- Interactive charts for scenario comparison

### Performance Metrics
- Real-time KPIs (Total Revenue, Growth Rate, AOV, etc.)
- Revenue trend visualization
- Transaction and order value tracking
- Date-filtered performance data

### Insights
- Business insights sorted by severity (High, Medium, Low)
- Detailed explanations and affected periods
- Categorized by type (Risk, Opportunity, etc.)

## 🔧 Configuration

### Date Range Filtering
The application supports preset date ranges:
- All Time (2025-01-01 to 2025-12-31)
- Last 90 Days
- Last 60 Days  
- Last 30 Days
- Last 7 Days

### Data Structure
The application expects JSON data in the following structure:
- `kpis.json`: Key performance indicators
- `trends.json`: Time-series trend data
- `insights.json`: Business insights
- `product_metrics.json`: Product-specific metrics
- `recommendations.json`: Pricing recommendations

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   # From project root
   vercel
   ```

3. **Automatic Deployment**
   - Connect your GitHub repository to Vercel
   - Automatic deployments on push to main branch
   - Preview deployments for pull requests

### Manual Build for Production
```bash
cd frontend
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### GitHub Pages (Alternative)
```bash
cd frontend
npm run deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎨 Design Principles

- **Mobile-First**: All components designed for mobile first, then scaled up
- **Clarity Over Complexity**: Users should understand the interface in <5 seconds
- **Action-Oriented**: Every element guides users toward making pricing decisions
- **Data-Driven**: All insights and recommendations backed by real data

## 🔍 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📞 Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Contact: [Your Email/Contact Info]

---

**Built with ❤️ for pricing managers who need to make smarter, data-driven decisions**
