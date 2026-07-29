export interface ImageStoragePort {
  /**
   * بياخد بايتات صورة خام (أي فورمات)، يحولها WebP، ويرفعها.
   * بيرجع الرابط العام النهائي للصورة.
   */
  uploadImage(input: { buffer: Buffer; folder: string; filenameHint?: string }): Promise<string>;
}
