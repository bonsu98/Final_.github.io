import React, { useEffect } from 'react';
import { Article } from '../types';
import { BookOpen } from 'lucide-react';

interface ArticleListProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
}

export default function ArticleList({ articles, onArticleClick }: ArticleListProps) {
  useEffect(() => {
    document.title = "Learn About Peptides | Knowledge Base";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Explore our knowledge base to learn about research peptides, pentadecapeptide, and proteins related to peptides.");
    
    let metaKey = document.querySelector('meta[name="keywords"]');
    if (metaKey) metaKey.setAttribute("content", "peptides, research peptides, pentadecapeptide, protein related to peptides");
  }, []);

  return (
    <div className="bg-[#F8F9FA] min-h-screen py-16 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-[#0C1B2D] tracking-tight uppercase mb-4">
            Knowledge Base
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Deepen your understanding of research peptides and the science behind them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div 
              key={article.id}
              onClick={() => onArticleClick(article)}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 group flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#E55B4C] uppercase mb-3">
                  <BookOpen className="w-4 h-4" />
                  <span>{article.tags[0]}</span>
                </div>
                <h2 className="text-xl font-extrabold text-[#0C1B2D] mb-3 group-hover:text-[#DE5246] transition-colors line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3 mb-6 flex-1">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400 font-medium pt-4 border-t border-gray-50">
                  <span>{article.author}</span>
                  <span>{new Date(article.publishDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
