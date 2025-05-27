# ArqueoTech - Identificação de Artefatos Arqueológicos
![image](https://github.com/user-attachments/assets/489dc4f5-7443-479e-a658-33b1e68caeca)


Sistema de análise arqueológica combinando visão computacional e histórico cultural para identificação de artefatos em tempo real.

## Estrutura de Arquivos

```
projeto-arqueotech/
├── backend/
│ ├── logs/ # Logs de operações e erros
│ ├── middleware/ # Autenticação JWT e segurança
│ ├── models/ # Schemas MongoDB para usuários/artefatos
│ ├── monitoring/ # Métricas de desempenho e uso
│ ├── routes/ # Endpoints da API REST
│ ├── tests/ # Testes de integração e unitários
│ ├── utils/ # Ferramentas auxiliares e logger
│ ├── .env # Configurações de ambiente
│ ├── package.json
│ └── server.js
├── frontend/
│ ├── public/ # Assets estáticos
│ ├── src/
│ │ ├── css/ # Estilos com glassmorphism
│ │ ├── js/ # Integração IA e Webcam
│ │ └── pages/ # Interface do usuário
│ ├── package.json
│ └── README.md
├── doc/ # Documentação completa
│ ├── DVP.pdf
│ ├── diagrama-componentes.png
│ └── apresentacao.mp4
└── README.md # Este arquivo

```

## 🚀 Funcionalidades Principais

**🔍 Identificação de Artefatos**
- Análise em tempo real via webcam (30fps)
- Upload de imagens (PNG/JPG até 10MB)
- Detecção de vasos de gargalo e cariátides

**🔒 Autenticação Segura**
- Registro com validação de e-mail
- Login com JWT e refresh tokens
- Níveis de acesso (usuário/admin)

**📚 Base Histórica**
- Contexto cultural dos artefatos
- Linha do tempo histórica
- Referências bibliográficas

**📊 Monitoramento**
- Métricas de desempenho em tempo real
- Logs detalhados (Winston)
- Dashboard administrativo

## 💻 Tecnologias Utilizadas

**Backend**
- Node.js v18 + Express
- MongoDB Atlas + Mongoose
- JWT + Bcrypt para autenticação
- Winston + Morgan para logging

**Frontend**
- TensorFlow.js para inferência IA
- Teachable Machine (modelos pré-treinados)
- Webcam API + MediaPipe
- Glassmorphism UI Design


## Instruções de Instalação
Pré-requisitos:
Node.js instalado.
MongoDB configurado.
Clonar o repositório:

1. **Clone o repositório**
```bash
git clone https://github.com/mvsiqueiraa/PROJETO-ARQUEOTECH.git
cd projeto-arqueotech
cd arqueotech
```

2. **Instale as dependências do backend**
```bash
cd backend
npm install
```

3. **Instale as dependências do frontend**
```bash
cd ../frontend
npm install
```

## Como Executar o Projeto

1. **Inicie o servidor backend**
```bash
cd backend
npm run dev
```

2. **Inicie o frontend**
```bash
cd frontend
npm start
```

3. **Acesse a aplicação**
- Para o frontend, abra o arquivo index.html no navegador ou use uma extensão como Live Server.

---

**ArqueoTech** 🔍 - Conectando o passado ao futuro através da tecnologia!
