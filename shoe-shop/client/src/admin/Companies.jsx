import { useState } from 'react';
import { useFetch } from '../lib/hooks.jsx';
import { api } from '../lib/api.js';
export default function Companies() {
  const { data, mutate } = useFetch('/api/admin/companies');
  const [name,setName]=useState(''); const [address,setAddress]=useState('');
  const add = async (e)=>{ e.preventDefault(); await api.post('/api/admin/companies',{name,address}); setName(''); setAddress(''); mutate(); };
  return (
    <div className="container page"><h1>Companies</h1>
      <form onSubmit={add} className="panel"><h2>Add company</h2><input value={name} onChange={e=>setName(e.target.value)} placeholder="Company name" required/><input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Address"/><button className="btn primary">Add</button></form>
      <div className="grid products">{(data||[]).map(c=><div key={c.id} className="card"><h3>{c.name}</h3><p className="small muted">{c.address||''}</p></div>)}</div>
    </div>
  );
}
