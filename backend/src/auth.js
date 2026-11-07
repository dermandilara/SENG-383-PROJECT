const jwt = require('jsonwebtoken');
function secret() {
  const value = process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'seng383-local-demo-only-secret' : '');
  if (!value) throw new Error('JWT_SECRET must be configured.');
  return value;
}
function authenticate(req, res, next) {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required.' });
  try {
    const token = jwt.verify(h.slice(7), secret(), { algorithms: ['HS256'] });
    req.user = { id: Number(token.sub), role: token.role };
    if (!Number.isInteger(req.user.id) || !['parent', 'specialist', 'child'].includes(req.user.role)) throw new Error('Bad claims');
    next();
  } catch { return res.status(401).json({ error: 'Invalid or expired token.' }); }
}
function canAccessChild(db, childId, user) {
  const child = db.prepare('SELECT id, display_name, parent_id, user_id FROM children WHERE id = ?').get(childId);
  if (!child) return { allowed: false, child: null };
  const account = db.prepare('SELECT role FROM users WHERE id = ?').get(user.id);
  if (!account || account.role !== user.role) return { allowed: false, child };
  if (user.role === 'parent' && child.parent_id === user.id) return { allowed: true, child };
  if (user.role === 'child' && child.user_id === user.id) return { allowed: true, child };
  if (user.role === 'specialist') {
    const link = db.prepare('SELECT 1 FROM specialist_links WHERE child_id = ? AND specialist_id = ?').get(child.id, user.id);
    if (link) return { allowed: true, child };
  }
  return { allowed: false, child };
}
module.exports = { authenticate, canAccessChild, secret };
