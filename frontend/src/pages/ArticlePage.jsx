import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { devblogPosts } from '../data/devblog';
import './css/ArticlePage.css';

export default function ArticlePage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundPost = devblogPosts.find(p => p.id === id);
    setPost(foundPost);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="article-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка статьи...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="article-not-found">
        <h1>Статья не найдена</h1>
        <p>Запрашиваемая статья не существует.</p>
        <button onClick={() => window.close()}>Закрыть</button>
      </div>
    );
  }

  return (
    <div className="article-page">
      <div className="article-container">
        <header className="article-header">
          <div className="article-cover">
            <img src={post.cover} alt={post.title} />
            <div className="article-chip">{post.tag}</div>
          </div>
          
          <div className="article-meta">
            <h1 className="article-title">{post.title}</h1>
            <div className="article-info">
              <span className="article-date">{post.date}</span>
              <span className="article-read-time">{post.readTime}</span>
            </div>
          </div>
        </header>

        <main className="article-content">
          {post.blocks.map((block, index) => (
            <div key={index} className={`article-block article-block-${block.type}`}>
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
        </main>

        <footer className="article-footer">
          <button className="back-button" onClick={() => window.close()}>
            ← Назад к блогу
          </button>
        </footer>
      </div>
    </div>
  );
}
