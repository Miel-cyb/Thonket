
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const products = req.body;
      const filePath = path.join(process.cwd(), 'src', 'data', 'products.js');
      
      if (!Array.isArray(products)) {
        return res.status(400).json({ message: 'Invalid product data format.' });
      }

      // Format the data as a JavaScript module
      const fileContent = `const products = ${JSON.stringify(products, null, 2)};\n\nexport default products;\n`;
      
      fs.writeFileSync(filePath, fileContent, 'utf8');
      
      res.status(200).json({ message: 'Products updated successfully.' });
    } catch (error) {
      console.error('Failed to update products:', error);
      res.status(500).json({ message: 'Failed to update products file.' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
