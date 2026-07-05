import React, { useEffect } from 'react';
import { Article } from '../types';
import { ArrowLeft, Calendar, User } from 'lucide-react';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

export default function ArticleDetail({ article, onBack }: ArticleDetailProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update SEO dynamically
    document.title = `${article.title} | Knowledge Base`;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", article.excerpt);
    
    let metaKey = document.querySelector('meta[name="keywords"]');
    if (metaKey) metaKey.setAttribute("content", article.tags.join(', '));

    // Inject JSON-LD Schema
    const scriptId = 'article-schema-jsonld';
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "image": [`https://buyswisspeptides.shop${article.imageUrl.replace('.', '')}`],
      "datePublished": article.publishDate,
      "author": [{
        "@type": "Person",
        "name": article.author
      }],
      "description": article.excerpt
    });

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();
    };
  }, [article.id]);

  return (
    <div className="bg-white min-h-screen pb-24 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <button 
          onClick={onBack}
          className="flex items-center text-sm font-bold text-gray-400 hover:text-[#DE5246] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          BACK TO ARTICLES
        </button>

        <article>
          <div className="flex gap-2 mb-6">
            {article.tags.map(tag => (
              <span key={tag} className="text-[10px] font-bold tracking-widest text-[#E55B4C] bg-red-50 px-2 py-1 rounded uppercase">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-[#0C1B2D] leading-tight mb-6">
            {article.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-gray-500 font-medium mb-12 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.publishDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden bg-gray-100 mb-12 shadow-sm">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
          </div>

          <div 
            className="prose prose-lg prose-slate max-w-none 
              prose-headings:font-extrabold prose-headings:text-[#0C1B2D] prose-headings:tracking-tight
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
              prose-li:text-gray-600 prose-li:my-2
              prose-strong:text-[#0C1B2D] prose-strong:font-bold"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(article.content) }}
          />
        </article>
      </div>
    </div>
  );
}

// Simple markdown parser for the article content
function parseMarkdown(md: string): string {
  let html = md
    .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-extrabold mb-6">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mt-10 mb-4">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-8 mb-3">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>');

  // Wrap loose text in paragraphs
  html = html.split('\n\n').map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<h') || p.startsWith('<li')) return p;
    return `<p class="mb-4">${p}</p>`;
  }).join('\n');

  // Wrap lists in ul
  html = html.replace(/(<li.*?>.*?<\/li>)/gms, '<ul class="mb-6">$1</ul>');
  html = html.replace(/<\/ul>\n<ul class="mb-6">/g, '\n');

  return html;
}
