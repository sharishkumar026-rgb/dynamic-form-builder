export const downloadBlob = (
  blob: Blob,
  filename: string
): void => {
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const downloadFile = (
  url: string,
  filename?: string
): void => {
  const link = document.createElement("a");

  link.href = url;

  if (filename) {
    link.download = filename;
  }

  link.target = "_blank";
  link.rel = "noopener noreferrer";

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
};

export const downloadText = (
  content: string,
  filename: string,
  mimeType: string = "text/plain;charset=utf-8"
): void => {
  const blob = new Blob([content], {
    type: mimeType,
  });

  downloadBlob(blob, filename);
};

export const downloadJson = (
  data: unknown,
  filename: string
): void => {
  const json = JSON.stringify(data, null, 2);

  downloadText(
    json,
    filename,
    "application/json;charset=utf-8"
  );
};

export const downloadCsv = (
  content: string,
  filename: string
): void => {
  downloadText(
    content,
    filename,
    "text/csv;charset=utf-8"
  );
};

export const downloadExcel = (
  blob: Blob,
  filename: string
): void => {
  downloadBlob(
    blob,
    filename.endsWith(".xlsx")
      ? filename
      : `${filename}.xlsx`
  );
};

export const downloadPdf = (
  blob: Blob,
  filename: string
): void => {
  downloadBlob(
    blob,
    filename.endsWith(".pdf")
      ? filename
      : `${filename}.pdf`
  );
};

export const getFilenameFromContentDisposition = (
  contentDisposition?: string | null
): string | null => {
  if (!contentDisposition) {
    return null;
  }

  const utf8Match = contentDisposition.match(
    /filename\*=UTF-8''([^;]+)/i
  );

  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }

  const filenameMatch = contentDisposition.match(
    /filename="?([^"]+)"?/i
  );

  return filenameMatch?.[1] || null;
};

export const getFileExtension = (
  filename: string
): string => {
  const lastDotIndex = filename.lastIndexOf(".");

  if (lastDotIndex === -1) {
    return "";
  }

  return filename
    .slice(lastDotIndex + 1)
    .toLowerCase();
};

export const ensureFileExtension = (
  filename: string,
  extension: string
): string => {
  const normalizedExtension = extension.startsWith(".")
    ? extension
    : `.${extension}`;

  if (
    filename
      .toLowerCase()
      .endsWith(normalizedExtension.toLowerCase())
  ) {
    return filename;
  }

  return `${filename}${normalizedExtension}`;
};

export const createDownloadFilename = (
  name: string,
  extension: string
): string => {
  const sanitizedName = name
    .trim()
    .replace(/[<>:"/\\|?*]+/g, "-")
    .replace(/\s+/g, "-");

  return ensureFileExtension(
    sanitizedName || "download",
    extension
  );
};

export const download = {
  blob: downloadBlob,
  file: downloadFile,
  text: downloadText,
  json: downloadJson,
  csv: downloadCsv,
  excel: downloadExcel,
  pdf: downloadPdf,
};