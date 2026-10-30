/**
 * ============================================================
 * TAGHER'S STREETWEAR - CONECTOR SUPABASE (POSTGRESQL CLOUD)
 * ============================================================
 * 
 * Este archivo te permite conectar TAGHER'S directamente a tu base de datos
 * en la nube en Supabase (PostgreSQL).
 * 
 * PASOS PARA ACTIVAR SUPABASE:
 * 1. Crea una cuenta gratuita en https://supabase.com
 * 2. Crea un nuevo proyecto llamado "taghers"
 * 3. En el panel de Supabase, ve a "SQL Editor" y pega todo el contenido de:
 *    doc/schema.sql
 * 4. Ve a "Project Settings" > "API" y copia tu Project URL y tu anon public key.
 * 5. Pega los datos abajo en las constantes SUPABASE_URL y SUPABASE_ANON_KEY.
 */

const SUPABASE_CONFIG = {
  // URL oficial de tu proyecto en Supabase
  SUPABASE_URL: 'https://tbkhebfldzpifulgatkv.supabase.co',
  
  // Clave pública (publishable / anon key) oficial
  SUPABASE_ANON_KEY: 'sb_publishable_vg5CqI2U6MJQPaeVjIB5Bw_K_t8qoId',
  
  // Activo: Conectado a la nube de Supabase
  ENABLED: true
};

class SupabaseService {
  constructor() {
    this.url = SUPABASE_CONFIG.SUPABASE_URL;
    this.key = SUPABASE_CONFIG.SUPABASE_ANON_KEY;
    this.isEnabled = SUPABASE_CONFIG.ENABLED && Boolean(this.url) && Boolean(this.key);
  }

  // Cabeceras estándar para peticiones REST a Supabase
  getHeaders() {
    return {
      'apikey': this.key,
      'Authorization': `Bearer ${this.key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  // Obtener productos desde Supabase
  async getProducts() {
    if (!this.isEnabled) return null;
    try {
      const res = await fetch(`${this.url}/rest/v1/products?select=*`, {
        headers: this.getHeaders()
      });
      return res.ok ? await res.json() : null;
    } catch (e) {
      console.warn('Error conectando a Supabase, usando DB local:', e);
      return null;
    }
  }

  // Obtener pedidos para el Administrador
  async getOrders() {
    if (!this.isEnabled) return null;
    try {
      const res = await fetch(`${this.url}/rest/v1/orders?select=*&order=created_at.desc`, {
        headers: this.getHeaders()
      });
      return res.ok ? await res.json() : null;
    } catch (e) {
      return null;
    }
  }

  // Crear una nueva orden en Supabase
  async createOrder(orderData) {
    if (!this.isEnabled) return null;
    try {
      const res = await fetch(`${this.url}/rest/v1/orders`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(orderData)
      });
      return res.ok ? await res.json() : null;
    } catch (e) {
      return null;
    }
  }
}

// Exportación compatible tanto con frontend (navegador) como con Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SUPABASE_CONFIG, SupabaseService };
} else if (typeof window !== 'undefined') {
  window.SupabaseService = SupabaseService;
  window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}
