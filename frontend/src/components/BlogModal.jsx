import { useEffect, useState } from 'react';
import './css/blogmodal.css';

export default function BlogModal({ post, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setTimeout(() => setIsVisible(true), 30);
    const onEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onEsc);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onEsc);
    };
  }, [onClose]);

  return (
    <div className={`blogmodal-overlay ${isVisible ? 'visible' : ''}`} onClick={onClose}>
      <div className={`blogmodal-content ${isVisible ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="blogmodal-close" onClick={onClose} aria-label="Закрыть">×</button>

        <div className="blogmodal-cover">
          <img src={post.cover} alt={post.title} />
          <div className="blogmodal-chip">{post.tag}</div>
        </div>

        <div className="blogmodal-header">
          <h2 className="blogmodal-title">{post.title}</h2>
          <div className="blogmodal-meta">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>

        <div className="blogmodal-body">
          {post.blocks.map((block, idx) => (
            <div key={idx} className={`blog-block blog-block-${block.type}`}>
              {block.type === 'p' && <p>{block.text}</p>}
              {block.type === 'h3' && <h3>{block.text}</h3>}
              {block.type === 'img' && (
                <figure>
                  <img src={block.src} alt={block.alt || post.title} loading="lazy" />
                  {block.caption && <figcaption>{block.caption}</figcaption>}
                </figure>
              )}
              {block.type === 'code' && (
                <pre>
                  <code>{block.code}</code>
                </pre>
              )}
              {block.type === 'quote' && (
                <blockquote>{block.text}</blockquote>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


