import { useEffect, useState } from 'react';
import './css/blogmodal.css';

export default function BlogModal({ post, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Сохраняем текущую позицию скролла
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    
    setTimeout(() => setIsVisible(true), 30);
    const onEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onEsc);
    
    return () => {
      // Восстанавливаем скролл и позицию
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
      window.scrollTo(0, scrollY);
      document.removeEventListener('keydown', onEsc);
    };
  }, [onClose]);

  return (
    <div className={`blogmodal-overlay ${isVisible ? 'visible' : ''}`} onClick={onClose}>
      <div className={`blogmodal-content ${isVisible ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="blogmodal-close" onClick={onClose} aria-label={t('close')}>×</button>

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





