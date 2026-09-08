import { ImageStoragePort } from "@/application/ports/ImageStoragePort";

export class UploadArticleImageUseCase {
  constructor(private readonly imageStorage: ImageStoragePort) {}

  async execute(input: { buffer: Buffer; filenameHint?: string }): Promise<string> {
    return this.imageStorage.uploadImage({
      buffer: input.buffer,
      folder: "articles",
      filenameHint: input.filenameHint,
    });
  }
}
