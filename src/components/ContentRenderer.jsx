import { useEffect, useRef, useState } from 'react';

export default function ContentRenderer({ url }) {
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    
    const fetchContent = async () => {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Erro ao buscar o conteúdo: ${response.statusText}`);
        }

        const payload = await response.json();

        if (iframeRef.current) {
          const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;

          iframeDoc.open();
          iframeDoc.write(`<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
                <script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js"></script>
                ${Object.values(payload.styles || {}).map((href) => `<link rel="stylesheet" href="${href}">`).join('')}
              </head>
              <body>
                ${payload.content || ''}
                ${Object.values(payload.scripts || {}).map((src) => `<script src="${src}"></script>`).join('')}
              </body>
            </html>`);
          iframeDoc.close();
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchContent();
  }, [url]);

  return (
    <div>
      {loading && <p className="text-center">Carregando conteúdo...</p>}
      {error && <p className="text-red-500 text-center">Erro: {error}</p>}
      {!loading && !error && (
        <iframe
          ref={iframeRef}
          title="Content Renderer"
          style={{ width: '100%', height: '100vh', border: 'none' }}
        ></iframe>
      )}
    </div>
  );
}
