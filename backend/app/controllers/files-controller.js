import { createReadStream } from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';

// Get the current module's directory
const currentModuleUrl = new URL(import.meta.url);
const currentModuleDir = path.dirname(currentModuleUrl.pathname);

// Define a route handler to download a file
export const get = async (req, res) => {
  const filename = req.params.filePath;
  const filePath = path.join(currentModuleDir, 'files', filename);

  try {
    // Check if the file exists
    await fsPromises.access(filePath);

    // Set the Content-Disposition header for file download
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream the file to the response
    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error(error);

    // Handle the case where the file doesn't exist
    res.status(404).json({ message: 'File not found' });
  }
};
