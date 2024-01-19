import { DocumentType } from "@typegoose/typegoose";
import { File } from "../../../models/file";
import axios from "axios";
import FormData from "form-data";

export async function uploadImageByUrl(fileEntry: DocumentType<File>) {
  const url = fileEntry.url;

  const form = new FormData();
  form.append(
    "metadata",
    JSON.stringify({
      url,
      type: fileEntry.type,
      fileId: fileEntry._id,
    })
  );
  form.append("requireSignedURLs", "false");
  form.append("url", url);

  const response = await axios.post(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_IMAGES_ACCOUNT_ID}/images/v1`,
    form,
    {
      headers: {
        Authorization: `Bearer ${process.env.CF_IMAGES_API_KEY}`,
        ...form.getHeaders(),
      },
    }
  );
  if (response.data.success) {
    const data = response.data.result;
    fileEntry.imagesData = {
      id: data.id,
      variants: data.variants,
      uploaded: new Date(),
      filename: data.original_filename,
      requiredSignedURLs: false,
    };
    await fileEntry.save();
    return fileEntry;
  }
}
