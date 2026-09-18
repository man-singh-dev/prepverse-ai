import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { getSession } from '../../auth/mockAuth';
import {
  mockStats,
  mockRecentReports,
  mockWeakAreas,
  mockRecommendedTopics,
} from '../mockData';

export default function Dashboard() {
  const session = getSession();

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Welcome back{session?.name ? `, ${session.name}` : ''} 👋</h1>
          <p>Here&apos;s how your interview prep is going.</p>
        </div>
        <Button>Start mock interview</Button>
      </div>

      <div className="stats-grid">
        {mockStats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
            <span className={`stat-trend ${stat.direction}`}>
              {stat.direction === 'up' ? '↑' : '↓'} {stat.trend}
            </span>
          </div>
        ))}
      </div>

      <div className="dashboard-columns">
        <div>
          <Card className="recent-reports">
            <div className="card-header">
              <h3 className="card-title">Recent reports</h3>
            </div>
            {mockRecentReports.map((report) => (
              <div key={report.id} className="report-row">
                <div>
                  <strong>{report.title}</strong>
                  <p className="text-muted">{report.date}</p>
                </div>
                <span className="badge badge-primary">{report.score}%</span>
              </div>
            ))}
          </Card>
        </div>

        <div>
          <Card className="weak-areas">
            <div className="card-header">
              <h3 className="card-title">Areas to improve</h3>
            </div>
            {mockWeakAreas.map((area) => (
              <div key={area.topic} className="weak-area-item">
                <div style={{ width: '100%' }}>
                  <div className="flex justify-between" style={{ marginBottom: 'var(--space-1)' }}>
                    <span>{area.topic}</span>
                    <span className="text-muted">{area.progress}%</span>
                  </div>
                  <div className="progress">
                    <div
                      className={`progress-bar ${area.progress < 50 ? 'warning' : ''}`}
                      style={{ width: `${area.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </Card>

          <Card className="recommended-topics">
            <div className="card-header">
              <h3 className="card-title">Recommended topics</h3>
            </div>
            <div>
              {mockRecommendedTopics.map((topic) => (
                <span key={topic} className="topic-tag">
                  {topic}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
