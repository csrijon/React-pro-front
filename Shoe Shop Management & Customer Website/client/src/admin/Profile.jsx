import { useState } from 'react';
import { api } from '../lib/api.js';
import { useAuth, useToast } from '../lib/hooks.jsx';
import { Field } from '../components/ui.jsx';

export default function Profile() {
  const { user, refresh } = useAuth();
  const toast = useToast();
  const [username, setUsername] = useState(user.username);
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });
  const [err, setErr] = useState({});

  const saveName = async (e) => {
    e.preventDefault(); setErr({});
    try { await api.put('/api/admin/profile', { username }); await refresh(); toast.success('Username updated'); } catch (ex) { setErr(ex.fields || { username: ex.message }); }
  };
  const savePw = async (e) => {
    e.preventDefault(); setErr({});
    try { await api.put('/api/auth/password', pw); setPw({ currentPassword: '', newPassword: '' }); toast.success('Password changed'); } catch (ex) { setErr(ex.fields || { currentPassword: ex.message }); }
  };
  return (
    <>
      <div className="page-head"><h1>Admin profile</h1></div>
      <div className="grid two">
        <form className="panel" onSubmit={saveName} noValidate>
          <h2>Username</h2>
          <Field label="Username" error={err.username}><input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" /></Field>
          <button className="btn primary">Save</button>
        </form>
        <form className="panel" onSubmit={savePw} noValidate>
          <h2>Change password</h2>
          <Field label="Current password" error={err.currentPassword}><input type="password" autoComplete="current-password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} /></Field>
          <Field label="New password" error={err.newPassword} hint="At least 8 characters"><input type="password" autoComplete="new-password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} /></Field>
          <button className="btn primary">Change password</button>
        </form>
      </div>
    </>
  );
}
