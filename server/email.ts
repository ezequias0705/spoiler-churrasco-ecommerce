import { MailService } from '@sendgrid/mail';
import fs from 'fs';
import path from 'path';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (!SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    content: string;
    filename: string;
    type: string;
    disposition: string;
  }>;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
      attachments: params.attachments,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendProjectEmail(recipientEmail: string): Promise<boolean> {
  try {
    // Ler o arquivo tar.gz
    const projectPath = path.join(process.cwd(), 'spoiler-churrasco-project.tar.gz');
    const fileBuffer = fs.readFileSync(projectPath);
    const base64Content = fileBuffer.toString('base64');

    const emailContent = `
    <h2>Projeto Spoiler do Churrasco - Código Completo</h2>
    
    <p>Olá!</p>
    
    <p>Seu projeto de e-commerce <strong>Spoiler do Churrasco</strong> está completo e anexado neste email.</p>
    
    <h3>📦 O que está incluído:</h3>
    <ul>
      <li><strong>Frontend React</strong> - Interface moderna e responsiva</li>
      <li><strong>Backend Node.js</strong> - API REST completa</li>
      <li><strong>Catálogo de Produtos</strong> - Sistema para churrasqueiras artesanais</li>
      <li><strong>Sistema de Carrinho</strong> - Funcionalidade completa de compras</li>
      <li><strong>Personalização</strong> - Gravação, acabamentos e dimensões</li>
      <li><strong>Gestão de Pedidos</strong> - Substituindo o sistema do WhatsApp</li>
      <li><strong>Formulários de Contato</strong> - Para suporte e dúvidas</li>
    </ul>
    
    <h3>🚀 Como executar:</h3>
    <ol>
      <li>Extraia o arquivo anexado</li>
      <li>Abra o terminal na pasta do projeto</li>
      <li>Execute: <code>npm install</code></li>
      <li>Execute: <code>npm run dev</code></li>
      <li>Acesse: <code>http://localhost:5000</code></li>
    </ol>
    
    <h3>💡 Características do projeto:</h3>
    <ul>
      <li>Design com tema de churrasco (cores marrom/laranja)</li>
      <li>Conteúdo em português brasileiro</li>
      <li>Sistema moderno substituindo WhatsApp</li>
      <li>Personalização avançada de produtos</li>
      <li>Interface responsiva para mobile e desktop</li>
    </ul>
    
    <p>O projeto está completo e pronto para uso. Qualquer dúvida, entre em contato!</p>
    
    <p>Sucesso com seu novo e-commerce! 🔥</p>
    `;

    const success = await sendEmail({
      to: recipientEmail,
      from: 'noreply@replit.com',
      subject: '🔥 Projeto Spoiler do Churrasco - Código Completo',
      html: emailContent,
      text: 'Seu projeto Spoiler do Churrasco está anexado. Execute npm install e npm run dev para iniciar.',
      attachments: [{
        content: base64Content,
        filename: 'spoiler-churrasco-project.tar.gz',
        type: 'application/gzip',
        disposition: 'attachment'
      }]
    });

    return success;
  } catch (error) {
    console.error('Erro ao enviar projeto por email:', error);
    return false;
  }
}