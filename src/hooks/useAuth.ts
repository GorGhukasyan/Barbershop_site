'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface AuthUser {
  id: string;
  email: string;
  barberId: string;
  barberName: string;
  role: 'admin' | 'barber';
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { setUser(null); setLoading(false); return; }

      const { data: barber } = await supabase
        .from('barbers')
        .select('id, name, role')
        .eq('user_id', authUser.id)
        .single();

      if (barber) {
        setUser({ id: authUser.id, email: authUser.email!, barberId: barber.id, barberName: barber.name, role: barber.role as 'admin' | 'barber' });
      }
      setLoading(false);
    }

    loadUser();
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/hy/admin/login';
  }

  return { user, loading, signOut };
}
