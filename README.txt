================================================================================
  PROJECTO 2 — SISTEMAS DISTRIBUÍDOS
  Stripe Webhook + Ngrok + Nginx + RabbitMQ + Orders API
================================================================================
  Disciplina : Sistemas Distribuídos
  Docente    : Romilton Lima
  Turma      : 3o Ano / 2o Semestre — LEIT
================================================================================


================================================================================
  ARQUITECTURA DO SISTEMA
================================================================================

  Stripe Dashboard
       |
       v  (HTTPS)
  Ngrok Tunnel  (porta pública HTTPS → localhost:8080)
       |
       v
  Nginx Reverse Proxy  (:8080)
       |  /webhook  ou  /api/webhooks/stripe
       v
  webhook_api — FastAPI  (:8001)
       |  publica mensagem
       v
  RabbitMQ — fila: stripe_events  (:5672 / painel :15672)
       |  consome mensagem
       v
  worker.py  (consumer)
       |  HTTP PUT /orders/{id}
       v
  orders_api — FastAPI  (:8002)
       |
       v
  PostgreSQL  (:5432)


================================================================================
  PRÉ-REQUISITOS — INSTALAR ANTES DE COMEÇAR
================================================================================

  1. Docker Desktop
       https://www.docker.com/products/docker-desktop
       -> Abrir o Docker Desktop e aguardar o motor iniciar

  2. Ngrok
       https://ngrok.com/download
       -> Após instalar, autenticar com o token da conta:
            ngrok config add-authtoken SEU_TOKEN_AQUI
       -> Token disponível em: https://dashboard.ngrok.com/get-started/your-authtoken

  3. Conta Stripe (modo teste)
       https://dashboard.stripe.com
       -> Usar sempre em "Área Restrita" (modo teste)


================================================================================
  CONFIGURAÇÃO DO FICHEIRO .env
================================================================================

  Na raiz do projecto existe um ficheiro .env com as seguintes variáveis:

    STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    NGROK_AUTHTOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  Como obter cada valor:

  NGROK_AUTHTOKEN:
    -> Aceder a https://dashboard.ngrok.com/get-started/your-authtoken
    -> Copiar o token e colar no .env

  STRIPE_WEBHOOK_SECRET:
    -> Configurar o webhook no Stripe primeiro (Passo 3 abaixo)
    -> O secret é gerado após criar o webhook destination
    -> Começa sempre por: whsec_...


================================================================================
  EXECUÇÃO DO PROJECTO — PASSO A PASSO
================================================================================

  ----------------------------------------------------------------------------
  PASSO 1 — Iniciar todos os serviços (Docker Compose)
  ----------------------------------------------------------------------------

  Abrir um terminal (PowerShell ou CMD) na pasta raiz do projecto:

    cd C:\Users\User\Documents\UTA\SiD\Ecomerce

  Iniciar todos os containers:

    docker-compose up --build -d

  Aguardar 30 a 60 segundos. Verificar se tudo está a correr:

    docker ps

  Resultado esperado — 7 containers em execução:
  +-----------------+----------+----------------------------------+
  | NOME            | ESTADO   | PORTAS                           |
  +-----------------+----------+----------------------------------+
  | nginx_proxy     | Up       | 0.0.0.0:8080->80/tcp             |
  | webhook_api     | Up       | 0.0.0.0:8001->8000/tcp           |
  | python_worker   | Up       |                                  |
  | orders_api      | Up       | 0.0.0.0:8002->8000/tcp           |
  | postgres_db     | Up       | 0.0.0.0:5432->5432/tcp           |
  | rabbitmq        | Up       | 0.0.0.0:5672->5672/tcp           |
  |                 | (healthy)| 0.0.0.0:15672->15672/tcp         |
  | ngrok_tunnel    | Up       | 0.0.0.0:4040->4040/tcp           |
  +-----------------+----------+----------------------------------+


  ----------------------------------------------------------------------------
  PASSO 2 — Obter o URL público do Ngrok
  ----------------------------------------------------------------------------

  Abrir o browser e aceder ao painel do Ngrok:

    http://localhost:4040

  Copiar o URL HTTPS que aparece. Exemplo:
    https://marianna-contradictable-winnie.ngrok-free.app

  NOTA: Este URL muda a cada reinício do Ngrok.
        Se o Ngrok já estava a correr de uma sessão anterior,
        o URL pode ser o mesmo.


  ----------------------------------------------------------------------------
  PASSO 3 — Configurar o Webhook Destination no Stripe
  ----------------------------------------------------------------------------

  1. Aceder ao Stripe Dashboard (modo teste):
       https://dashboard.stripe.com/test/webhooks

  2. Clicar em "Add destination" ou editar o destino existente

  3. Preencher o campo Endpoint URL com:
       https://SEU-URL-NGROK.ngrok-free.app/webhook

     Exemplo:
       https://marianna-contradictable-winnie.ngrok-free.app/webhook

  4. Seleccionar os 3 eventos seguintes:
       - checkout.session.completed
       - payment_intent.succeeded
       - payment_intent.payment_failed

  5. Guardar o webhook

  6. Copiar o "Signing secret" (Segredo da assinatura) — começa por whsec_

  7. Colar o valor no ficheiro .env:
       STRIPE_WEBHOOK_SECRET=whsec_VALOR_COPIADO

  8. Reiniciar o webhook_api para carregar o novo secret:
       docker restart webhook_api


  ----------------------------------------------------------------------------
  PASSO 4 — Testar o funcionamento
  ----------------------------------------------------------------------------

  No Stripe Dashboard:
    Webhooks -> [seu webhook] -> "Enviar eventos de teste"
    Seleccionar: checkout.session.completed
    Clicar "Enviar"

  Verificar o resultado:
    -> No Stripe Dashboard: deve aparecer "200 OK" em verde
    -> Nos logs do worker:
         docker logs python_worker -f

  Exemplo de log esperado no worker:
    [Worker] Evento recebido do RabbitMQ: checkout.session.completed
    [Worker] Order criada com sucesso: {"status": "success", "order_id": 1}


  ----------------------------------------------------------------------------
  PASSO 5 — Verificar as Orders na base de dados
  ----------------------------------------------------------------------------

  Aceder à documentação automática da Orders API:
    http://localhost:8002/docs

  Ou via browser / Postman:
    GET http://localhost:8002/orders/        <- lista todas as orders
    GET http://localhost:8002/orders/1       <- ver order com id=1
    PUT http://localhost:8002/orders/1       <- actualizar order
        Body: { "status": "PAID", "stripe_event_id": "evt_xxx" }


================================================================================
  PAINÉIS DE MONITORIZAÇÃO
================================================================================

  SERVIÇO          URL                         CREDENCIAIS
  ──────────────── ─────────────────────────── ───────────────────
  Ngrok Inspector  http://localhost:4040        (sem login)
  RabbitMQ Painel  http://localhost:15672       guest / guest
  Orders API Docs  http://localhost:8002/docs   (sem login)
  Webhook Health   http://localhost:8001/health (sem login)


================================================================================
  PARAR O PROJECTO
================================================================================

  Parar todos os containers (mantém os dados):
    docker-compose down

  Parar e apagar também a base de dados:
    docker-compose down -v

  Ver logs em tempo real de um serviço:
    docker logs webhook_api -f
    docker logs python_worker -f
    docker logs orders_api -f
    docker logs nginx_proxy -f


================================================================================
  ESTRUTURA DE FICHEIROS
================================================================================

  Ecomerce/
  ├── .env                          <- variáveis de ambiente (secrets)
  ├── docker-compose.yml            <- orquestração de todos os serviços
  ├── README.txt                    <- este ficheiro
  ├── nginx/
  │   └── nginx.conf                <- configuração do reverse proxy
  └── backend/
      ├── webhook/
      │   ├── webhook.py            <- recebe eventos Stripe → publica no RabbitMQ
      │   ├── Dockerfile
      │   └── requirements.txt
      ├── worker/
      │   ├── worker.py             <- consome RabbitMQ → actualiza Orders API
      │   ├── Dockerfile
      │   └── requirements.txt
      └── orders_api/
          ├── main.py               <- API REST de pedidos (GET, POST, PUT)
          ├── Dockerfile
          └── requirements.txt


================================================================================
  RESOLUÇÃO DE PROBLEMAS COMUNS
================================================================================

  PROBLEMA: Stripe envia 404 para o webhook
  SOLUÇÃO:
    1. Confirmar que o URL no Stripe contém /webhook no final
    2. Confirmar que o Ngrok está activo: http://localhost:4040
    3. Confirmar que o URL do Ngrok corresponde ao configurado no Stripe
    4. Executar: docker restart nginx_proxy

  PROBLEMA: Worker não processa mensagens
  SOLUÇÃO:
    1. Verificar se o RabbitMQ está healthy: docker ps
    2. Ver logs: docker logs python_worker
    3. Reiniciar: docker restart python_worker

  PROBLEMA: Erro 400 na validação da assinatura do webhook
  SOLUÇÃO:
    1. Confirmar que STRIPE_WEBHOOK_SECRET no .env está correcto
    2. O secret deve corresponder ao webhook configurado no Stripe
    3. Reiniciar: docker restart webhook_api

  PROBLEMA: Orders API não responde
  SOLUÇÃO:
    1. Verificar se o PostgreSQL está a correr: docker ps | findstr postgres
    2. Ver logs: docker logs orders_api
    3. Reiniciar: docker-compose restart orders_api db


================================================================================
  TECNOLOGIAS UTILIZADAS
================================================================================

  Python 3.11    — linguagem principal do backend
  FastAPI        — framework web (webhook_api e orders_api)
  Pika           — cliente AMQP para RabbitMQ
  Stripe SDK     — validação de eventos e assinaturas
  SQLAlchemy     — ORM para PostgreSQL
  PostgreSQL 15  — base de dados das orders
  RabbitMQ 3     — message broker (fila: stripe_events)
  Nginx          — reverse proxy (encaminha /webhook para webhook_api)
  Ngrok          — túnel HTTPS público para desenvolvimento local
  Docker Compose — orquestração de todos os microserviços

================================================================================
