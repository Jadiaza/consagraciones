/**
 * MediaService — capa de resolución de recursos multimedia.
 *
 * Los archivos (podcast, audios, imágenes, PDFs, certificados) NO se guardan
 * en la base de datos: viven en Cloudflare R2. La base de datos guarda sólo
 * los metadatos (provider + storage_key + public_url).
 *
 * Variables de entorno (públicas, sin secretos):
 *   VITE_MEDIA_BASE_URL   ej. https://media.dominio.com
 *
 * Los secretos de Cloudflare (API Token / R2 Secret Access Key) NUNCA se
 * exponen en el frontend. Las URLs firmadas para recursos privados deberán
 * generarse desde un endpoint de servidor.
 */

export type MediaProviderName = "cloudflare_r2" | "mock";

export interface MediaAssetRef {
  provider?: string | null;
  storage_key?: string | null;
  public_url?: string | null;
}

export interface MediaProvider {
  readonly name: MediaProviderName;
  resolve(asset: MediaAssetRef): string | null;
}

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, "");

export class CloudflareMediaProvider implements MediaProvider {
  readonly name = "cloudflare_r2" as const;

  constructor(private readonly baseUrl: string) {}

  resolve(asset: MediaAssetRef): string | null {
    if (asset.public_url) return asset.public_url;
    if (!asset.storage_key || !this.baseUrl) return null;
    return `${trimSlashes(this.baseUrl)}/${trimSlashes(asset.storage_key)}`;
  }
}

/** Provider temporal mientras no se entregan las credenciales de Cloudflare. */
export class MockMediaProvider implements MediaProvider {
  readonly name = "mock" as const;

  resolve(asset: MediaAssetRef): string | null {
    return asset.public_url ?? null;
  }
}

class MediaServiceImpl {
  constructor(private readonly provider: MediaProvider) {}

  get providerName() {
    return this.provider.name;
  }

  /** Devuelve la URL utilizable por la interfaz, o null si aún no está disponible. */
  url(asset: MediaAssetRef | null | undefined): string | null {
    if (!asset) return null;
    return this.provider.resolve(asset);
  }

  isAvailable(asset: MediaAssetRef | null | undefined): boolean {
    return this.url(asset) !== null;
  }
}

const baseUrl = (import.meta.env["VITE_MEDIA_BASE_URL"] as string | undefined) ?? "";

export const MediaService = new MediaServiceImpl(
  baseUrl ? new CloudflareMediaProvider(baseUrl) : new MockMediaProvider(),
);