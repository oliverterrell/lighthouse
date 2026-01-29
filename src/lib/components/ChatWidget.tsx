'use client';

import { renderMarkdown } from '@/lib/utils';
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useDemoStore } from '@/lib/stores/DemoStore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { activeStrategy } = useDemoStore('activeStrategy');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          strategy: activeStrategy,
        }),
      });

      const data = await response.json();

      if (data.message) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(to bottom right, #2563eb, #9333ea)',
            color: 'white',
            border: 'none',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            zIndex: 9999,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.3)';
          }}
        >
          <MessageCircle style={{ width: '24px', height: '24px' }} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '400px',
            height: '600px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '16px',
            backgroundColor: '#18181b',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(to bottom right, #2563eb, #9333ea)',
              padding: '12px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageCircle style={{ width: '20px', height: '20px', color: 'white' }} />
              <span style={{ fontWeight: 600, color: 'white' }}>Visa Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.8)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)')}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  color: '#6b7280',
                  fontSize: '14px',
                  marginTop: '32px',
                }}
              >
                <p style={{ marginBottom: '8px' }}>👋 Hi! I'm your O-1 visa assistant.</p>
                <p>Ask me anything about your case strategy or the visa process!</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    borderRadius: '16px',
                    padding: '8px 16px',
                    backgroundColor: msg.role === 'user' ? '#2563eb' : 'rgba(255, 255, 255, 0.1)',
                    color: msg.role === 'user' ? 'white' : '#e5e7eb',
                  }}
                >
                  <p style={{ fontSize: '14px', whiteSpace: 'pre-wrap', margin: 0 }}>{renderMarkdown(msg.content)}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '8px 16px',
                  }}
                >
                  <Loader2
                    style={{
                      width: '16px',
                      height: '16px',
                      color: '#9ca3af',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask a question..."
                disabled={loading}
                style={{
                  flex: 1,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '8px 16px',
                  fontSize: '14px',
                  color: 'white',
                  border: 'none',
                  outline: 'none',
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  display: 'flex',
                  width: '40px',
                  height: '40px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  opacity: loading || !input.trim() ? 0.5 : 1,
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!loading && input.trim()) {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }}
              >
                <Send style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add keyframe animation for loader */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};
