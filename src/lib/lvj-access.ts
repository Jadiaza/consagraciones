const LVJ_ACCESS_ENDPOINT = "https://lavozdejesus.co/api/acceso.php";

/**
 * Sincroniza la identidad Supabase con el registro oficial de usuarios de LVJPRAYER.
 * No crea una cuenta nueva ni modifica el progreso de Consagración.
 */
export async function syncLvjIdentity(accessToken: string): Promise<void> {
  if (!accessToken) return;

  try {
    const response = await fetch(LVJ_ACCESS_ENDPOINT, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) return;
    const payload = (await response.json()) as { success?: boolean };
    if (!payload.success) return;
  } catch {
    // La identidad Supabase y el acceso a Consagración no dependen de esta sincronización.
  }
}
