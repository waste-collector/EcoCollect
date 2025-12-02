# EcoCollect - Waste Management System

A comprehensive waste collection and management platform designed for modern cities, featuring multiple user portals, real-time tracking, analytics, and XML-based data management.

## System Architecture

### User Roles

- **Citizens**: Report issues, view collection schedules, access nearby collection points
- **Collection Agents**: Manage daily tours, report incidents, track vehicle status
- **Administrators**: Manage tours, vehicles, agents, import/export XML data, view analytics

### Key Features

#### Public Website
- Home page with service overview
- Login/Sign-up pages with role-based access
- Responsive design for all devices

#### Citizen Portal
- Dashboard with waste statistics
- Collection schedules by zone
- Incident reporting system
- Nearby collection points with status indicators
- Interactive maps showing waste containers

#### Collection Agent Portal
- Daily tour management
- Tour progress tracking
- Incident reporting with photos
- Performance metrics and efficiency ratings
- Vehicle status monitoring

#### Admin Portal
- Comprehensive dashboard with KPIs
- XML-based tour management (CRUD operations)
- XML import/export functionality
- Collection points management
- Vehicle fleet management
- Agent team management
- Analytics and emissions tracking
- Real-time system alerts

#### Visualization Components
- Interactive collection point maps with fill-level indicators
- Tour route visualization with completed/pending points
- Efficiency gauges for performance monitoring
- Waste composition pie charts
- Real-time status color coding (Green/Yellow/Red)

## Backend API

### REST Endpoints

#### Tours
- `GET /api/tours` - List all tours (supports XML format)
- `POST /api/tours` - Create new tour
- `PUT /api/tours/[id]` - Update tour
- `DELETE /api/tours/[id]` - Delete tour
- `POST /api/tours/import` - Import tours from XML
- `POST /api/tours/export` - Export tours as XML

#### Collection Points
- `GET /api/collection-points` - List collection points (supports zone filtering)
- `POST /api/collection-points` - Create new collection point

#### Vehicles
- `GET /api/vehicles` - List all vehicles
- `POST /api/vehicles` - Register new vehicle

#### Agents
- `GET /api/agents` - List agents (supports zone filtering)
- `POST /api/agents` - Register new agent

## XML Data Format

### Tour XML Structure
\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<tours>
  <tour>
    <id>TOUR-001</id>
    <name>Downtown Morning Route</name>
    <zone>Downtown District</zone>
    <agent>John Smith</agent>
    <vehicle>V-001</vehicle>
    <distance>12.5</distance>
    <duration>2h 30m</duration>
    <status>completed</status>
    <date>2025-12-02</date>
  </tour>
</tours>
\`\`\`

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation Steps

1. Download the project from v0:
   \`\`\`bash
   # Use the shadcn CLI or manual installation
   npm install
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open browser to `http://localhost:3000`

## Demo Credentials

All portals use demo authentication. Use these credentials:
- **Email**: demo@ecocollect.io
- **Password**: demo123

Select your role (Citizen, Agent, or Admin) on the login page.

## Sample XML Import/Export

### Export Tours as XML
\`\`\`bash
curl http://localhost:3000/api/tours/export \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"tours": [...]}'
\`\`\`

### Import Tours from XML
\`\`\`bash
curl http://localhost:3000/api/tours/import \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"xmlContent": "<?xml version=\"1.0\"?>..."}'
\`\`\`

## Test Plan & Acceptance Checklist

### Frontend UI Interactions
- [ ] Public website navigation and links functional
- [ ] Login with different roles redirects to correct dashboard
- [ ] Citizen dashboard displays schedules and reports
- [ ] Agent can view and start tours
- [ ] Admin can create, edit, delete tours
- [ ] All forms show proper validation feedback
- [ ] Maps display collection points with correct color coding
- [ ] Charts display accurate sample data
- [ ] Responsive design works on mobile (320px+)

### Backend XML Functionality
- [ ] Tours can be fetched in JSON format
- [ ] Tours can be fetched in XML format
- [ ] New tours can be created via API
- [ ] Tours can be updated via API
- [ ] Tours can be deleted via API
- [ ] XML import parses valid XML correctly
- [ ] XML export generates valid XML structure
- [ ] Invalid XML is rejected with error message
- [ ] Collection points API works with zone filtering
- [ ] Vehicle and agent endpoints return correct data

### Data Visualization
- [ ] Collection point map displays all points
- [ ] Color-coded status indicators (green/yellow/red) show correctly
- [ ] Tour route map displays route with completed/pending points
- [ ] Efficiency gauge animates to correct percentage
- [ ] Waste composition chart segments display correctly
- [ ] All charts are responsive and scale appropriately

### System Integration
- [ ] Multiple portals can be accessed without conflicts
- [ ] Navigation between pages works smoothly
- [ ] Data persists during session (in-memory for demo)
- [ ] Error handling shows user-friendly messages
- [ ] Loading states display appropriately

## Architecture Notes

- **Frontend**: Next.js 16 with React 19, TypeScript, Tailwind CSS
- **Components**: shadcn/ui for base components, custom components for maps/charts
- **API**: Next.js API routes (in-memory storage for demo)
- **Data Format**: JSON with XML import/export support
- **Maps/Charts**: Canvas-based visualizations (no external dependencies)
- **Styling**: Eco-friendly color scheme (forest green primary)

## Environment Variables

Currently, no environment variables are required for the demo. In production, you would add:
- Database connection strings
- API authentication tokens
- Email service credentials
- Map provider API keys (if using real mapping services)

## Deployment

Deploy to Vercel:
1. Push code to GitHub
2. Import repository in Vercel dashboard
3. Vercel automatically detects Next.js and deploys
4. Environment variables can be added in Vercel settings

## Future Enhancements

- Real database integration (PostgreSQL, MongoDB)
- Advanced routing algorithms
- Real-time GPS tracking
- Mobile app for agents
- SMS/Email notifications
- Multi-language support
- Advanced authentication (OAuth)
- Real map integration (Google Maps, Leaflet)
- Machine learning for route optimization
- IoT sensor integration for container monitoring

## Support

For issues or questions, refer to the system documentation or contact the development team.
