import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import ClientForm from "./ClientForm";
import "./css/ClientFormSection.css";

export const ClientFormSection = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [displayedCode, setDisplayedCode] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const observerRef = useRef(null);
  const codeRef = useRef(null);

  // Полный код для анимации печатания
  const fullCode = `# Создание проекта с нашей командой
project_config = {
    "name": "ваш_проект",
    "type": "e-commerce",
    "budget": 500000,
    "timeline": "3 месяца",
    "features": ["responsive", "seo", "analytics"]
}

# Функция создания проекта
def create_project(config):
    print("🚀 Начинаем создание проекта...")
    
    # Валидация конфигурации
    if not config.get("name") or not config.get("budget"):
        raise ValueError("Неполная конфигурация проекта")
    
    # Расчет стоимости
    base_price = config["budget"]
    features_count = len(config["features"])
    total_cost = base_price + (features_count * 50000)
    
    # Создание проекта
    project = {
        "id": generate_id(),
        "name": config["name"],
        "cost": total_cost,
        "duration": config["timeline"],
        "status": "in_progress",
        "created_at": datetime.now()
    }
    
    # Отправка уведомления команде
    notify_team(project)
    
    return project

# Вспомогательные функции
def generate_id():
    import uuid
    return str(uuid.uuid4())[:9]

def notify_team(project):
    print("📧 Уведомление отправлено команде")
    # Отправка в Telegram бота
    send_to_telegram(project)

# Запуск создания проекта
result = create_project(project_config)
print("✅ Проект создан:", result)`;

  // Функция для разбивки кода на токены для подсветки
  const tokenizeCode = (code) => {
    const lines = code.split('\n');
    return lines.map(line => {
      const tokens = [];
      let currentToken = '';
      let inString = false;
      let stringChar = '';
      let inComment = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        // Проверяем начало комментария
        if (!inString && !inComment && char === '#') {
          if (currentToken) {
            tokens.push({ type: 'text', value: currentToken });
            currentToken = '';
          }
          inComment = true;
          currentToken = char;
        } else if (inComment) {
          currentToken += char;
        } else if (!inString && (char === '"' || char === "'")) {
          if (currentToken) {
            tokens.push({ type: 'text', value: currentToken });
            currentToken = '';
          }
          inString = true;
          stringChar = char;
          currentToken = char;
        } else if (inString && char === stringChar) {
          currentToken += char;
          tokens.push({ type: 'string', value: currentToken });
          currentToken = '';
          inString = false;
        } else if (!inString && !inComment && /[{}[\]();,=+\-*/<>!&|]/.test(char)) {
          if (currentToken) {
            tokens.push({ type: 'text', value: currentToken });
            currentToken = '';
          }
          tokens.push({ type: 'punctuation', value: char });
        } else if (!inString && !inComment && /\s/.test(char)) {
          if (currentToken) {
            tokens.push({ type: 'text', value: currentToken });
            currentToken = '';
          }
          tokens.push({ type: 'space', value: char });
        } else if (!inComment) {
          currentToken += char;
        }
      }
      
      if (currentToken) {
        if (inComment) {
          tokens.push({ type: 'comment', value: currentToken });
        } else {
          tokens.push({ type: 'text', value: currentToken });
        }
      }
      
      return tokens;
    });
  };

  // Функция для определения типа токена
  const getTokenType = (token) => {
    if (token.type === 'string') return 'string';
    if (token.type === 'punctuation') return 'punctuation';
    if (token.type === 'space') return 'space';
    if (token.type === 'comment') return 'comment';
    
    const keywords = ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'raise', 'try', 'except', 'finally', 'import', 'from', 'as', 'with', 'lambda', 'and', 'or', 'not', 'in', 'is'];
    const literals = ['True', 'False', 'None'];
    
    if (keywords.includes(token.value)) return 'keyword';
    if (literals.includes(token.value)) return 'literal';
    if (/^\d+$/.test(token.value)) return 'number';
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token.value) && token.value.endsWith('(')) return 'function';
    
    return 'text';
  };

  // Функция для рендеринга токенов
  const renderTokens = (tokens) => {
    return tokens.map((token, index) => {
      const type = getTokenType(token);
      const className = `code-${type}`;
      return (
        <span key={index} className={className}>
          {token.value}
        </span>
      );
    });
  };

  // Функция автоматической прокрутки к концу
  const scrollToBottom = () => {
    if (codeRef.current) {
      codeRef.current.scrollTop = codeRef.current.scrollHeight;
    }
  };

  // Функция анимации печатания
  const startTyping = useCallback(() => {
    if (isTyping) return;
    
    setIsTyping(true);
    setDisplayedCode("");
    
    let currentIndex = 0;
    const typingSpeed = 30; // миллисекунды между символами
    
    const typeNextChar = () => {
      if (currentIndex < fullCode.length) {
        setDisplayedCode(fullCode.substring(0, currentIndex + 1));
        currentIndex++;
        // Автоматическая прокрутка к концу
        setTimeout(scrollToBottom, 0);
        setTimeout(typeNextChar, typingSpeed);
      } else {
        setIsTyping(false);
      }
    };
    
    // Небольшая задержка перед началом печатания
    setTimeout(typeNextChar, 500);
  }, [isTyping, fullCode]);

  // Функция для рендеринга кода с подсветкой
  const renderCodeWithHighlighting = (code) => {
    const lines = code.split('\n');
    return lines.map((line, lineIndex) => {
      const tokens = tokenizeCode(line)[0] || [];
      return (
        <div key={lineIndex} className="code-line">
          {renderTokens(tokens)}
        </div>
      );
    });
  };

  // Intersection Observer для отслеживания появления секции
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          startTyping();
        }
      },
      { threshold: 0.3 }
    );

    if (ref?.current) {
      observerRef.current.observe(ref.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isVisible, ref, startTyping]);

  return (
    <div ref={ref} className="client-form-section">
      <div className="form-section-container">
        <div className="form-section-content">
          <h2 className="form-section-title">{t('blog-title')}</h2>
          <p className="form-section-subtitle">{t('blog-subtitle')}</p>
          
          <div className="form-section-features">
            <div className="feature-item">
              <div className="feature-icon">📄</div>
              <h3 className="feature-title">{t('blog-feature-1-title')}</h3>
              <p className="feature-description">{t('blog-feature-1-desc')}</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">💵</div>
              <h3 className="feature-title">{t('blog-feature-2-title')}</h3>
              <p className="feature-description">{t('blog-feature-2-desc')}</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">{t('blog-feature-3-title')}</h3>
              <p className="feature-description">{t('blog-feature-3-desc')}</p>
            </div>
          </div>
          
          <button 
            className="form-section-button"
            onClick={() => setIsFormOpen(true)}
          >
            <span className="button-text">{t('blog-start-project')}</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="form-section-visual">
          <div className="visual-card">
            <div className="card-header">
              <div className="card-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
            </div>
            <div className="card-content" ref={codeRef}>
              <div className="code-block animated-code">
                {renderCodeWithHighlighting(displayedCode)}
                {isTyping && <span className="cursor">|</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isFormOpen &&
        ReactDOM.createPortal(
          <ClientForm
            onClose={() => setIsFormOpen(false)}
          />,
          document.body
        )}
    </div>
  );
});
