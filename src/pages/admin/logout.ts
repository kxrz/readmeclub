---
import { Astro } from 'astro';

Astro.cookies.delete('admin_session', { path: '/' });
return Astro.redirect('/admin');
---

