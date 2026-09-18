const columns = [
  {
    heading: 'Product',
    links: ['Features', 'Mock Interviews', 'Resume Builder', 'Pricing'],
  },
  {
    heading: 'Company',
    links: ['About', 'Careers', 'Blog'],
  },
  {
    heading: 'Resources',
    links: ['Help Center', 'Community', 'Contact'],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="navbar-brand" style={{ marginBottom: 'var(--space-3)' }}>
              PrepVerse AI
            </div>
            <p className="text-muted">Practice smarter. Interview with confidence.</p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <div className="footer-heading">{column.heading}</div>
              {column.links.map((link) => (
                <a key={link} href="#" className="footer-link">
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-bottom">© {new Date().getFullYear()} PrepVerse AI. All rights reserved.</div>
      </div>
    </footer>
  );
}
