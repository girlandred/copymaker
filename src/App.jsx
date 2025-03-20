import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [htmlInput, setHtmlInput] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [padding, setPadding] = useState("");
  const [modifiedHtml, setModifiedHtml] = useState("");
  const [imageSources, setImageSources] = useState([]);

  useEffect(() => {
    if (htmlInput) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(htmlInput, "text/html");
      const imgSrcs = Array.from(doc.querySelectorAll("img")).map((img) => img.src);
      setImageSources(imgSrcs);
    }
  }, [htmlInput]);

  const handleModify = () => {
    let parser = new DOMParser();
    let doc = parser.parseFromString(htmlInput, "text/html");

    if (newUrl) {
      doc.querySelectorAll('a[href="urlhere"]').forEach((a) => {
        a.href = newUrl;
      });
    }

    doc.querySelectorAll("img").forEach((img, index) => {
      const updatedSrc = imageSources[index];
      if (updatedSrc) {
        img.src = updatedSrc;
      }
    });

    if (padding) {
      doc.querySelectorAll("td").forEach((td) => {
        td.style.padding = padding;
      });
    }

    setModifiedHtml(doc.body.innerHTML);
  };

  const handleImageSourceChange = (index, newSrc) => {
    const updatedImageSources = [...imageSources];
    updatedImageSources[index] = newSrc;
    setImageSources(updatedImageSources);
  };

  return (
    <div className="container">
      <div className="left-panel">
        <h2>Live Preview</h2>
        <div className="preview" dangerouslySetInnerHTML={{ __html: modifiedHtml }} />
      </div>

      <div className="right-panel">
        <h2>Email HTML Modifier</h2>

        <div className="form-group">
          <label>Paste Your HTML:</label>
          <textarea
            rows="10"
            placeholder="Paste your HTML here..."
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
          ></textarea>
        </div>

        <div className="form-group">
          <label>New URL:</label>
          <input
            type="text"
            placeholder="Enter new link"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>TD Padding:</label>
          <input
            type="text"
            placeholder="Set padding"
            value={padding}
            onChange={(e) => setPadding(e.target.value)}
          />
        </div>

        <h3>Image Sources:</h3>
        <div className="form-group">
          {imageSources.length > 0 && imageSources.map((src, index) => (
            <div key={index} className="image-source-group">
              <label>Image {index + 1} Source:</label>
              <input
                type="text"
                value={src}
                onChange={(e) => handleImageSourceChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>

        <button className="btn" onClick={handleModify}>
          Generate Modified HTML
        </button>

        <h3>Modified HTML Output:</h3>
        <textarea rows="10" value={modifiedHtml} readOnly></textarea>
      </div>
    </div>
  );
}

export default App;
